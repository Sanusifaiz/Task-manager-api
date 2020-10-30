const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail} = require('../emails/account')
const {sendCancelationEmail} = require('../emails/account')

router.post('/users', async (req, res) => {
    //const user = new User(req.body) 
    
    try {
        const user = await new User(req.body) 
        sendWelcomeEmail(user.email, user.name)
        const token = await  user.generateAuthToken()

        await user.save()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
    




    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400)
    //     res.send(error)

    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.Password)
        const token = await  user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }   
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens =  []
        await req.user.save()
        res.send('All sessions logged out')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
    // User.find({}).then((user) => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(500).send(error)
    // })
})
 

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//             if(!user) {
//                 return res.status(404).send()
//             }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }



//     // User.findById(_id).then((user) => {
//     //     if(!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })


router.patch('/users/me', auth, async (req, res) => {
   const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "Password", "age"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {

        updates.forEach((update) => {
          req.user[update] =   req.body[update]
        })
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)  
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!User) {
        //     return res.status(404).send()
        // } 
       
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send('Account Deleted!!')
    } catch (e) {
        res.status(500).send()
    }
})



const avatar = multer({
    //    dest: 'avatar',      saves files on file system/ directory  // check stickynote on how to render uploaded image on a browser
        limits: {
            fileSize: 1000000,      // in bytes. 1MB = 1000000bytes
            
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
                return cb(new Error('Please upload an image'))
            }
            cb(undefined, true)    // when upload is correct
            
            // cb(new Error('File must be a PDF'))
            // cb(undefined, true)
            // cb(undefined, false)
        } 
    })
router.post('/users/me/avatar', avatar.single('avatar'), auth, async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()    
    
    req.user.avatar = buffer

        await req.user.save()
    
    res.send('Profile picture uploaded')
   }, (error, req, res, next) => {
    res.status(400).send({error: error.message})
   
}) 

router.delete('/users/me/avatar', auth, async (req, res) => {
        req.user.avatar  = undefined
        await req.user.save()
        res.status(200).send(req.user)
    }, (error, req, res, next) => {
        res.status(400).send({error: error.message})
    }
)

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router