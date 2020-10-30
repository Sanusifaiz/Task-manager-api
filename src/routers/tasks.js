const express = require('express')
const router = new express.Router()
const Tasks = require('../models/tasks')
const auth = require('../middleware/auth')



router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["Description", "completed"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    } 
    try {
        const tasks = await Tasks.findOne({_id: req.params.id, owner: req.user._id})

       
       // const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        if (!tasks) {
            return res.status(404).send()
        } 
        updates.forEach((update) => tasks[update] =   req.body[update])
          await tasks.save()
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }

})


router.post('/tasks', auth, async (req, res) => {
    //const tasks = new Tasks(req.body)
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(error)
    }



    // tasks.save().then(() => {
    //     res.status(201).send(tasks)
    // }).catch((error) => {
    //     res.status(400)
    //     res.send(error)
    // })
})

// GET /tasks?completed=true
// GET /tasks?Limit=10&skip=0
//GET /tasks?sortBy=createdAt_asc/desc 
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }

        }).execPopulate()
        res.status(201).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(error)

    }
    
    // Tasks.find({}).then((tasks) => {
    //     res.status(201).send(tasks)
    // }).catch((e) => {
    //     res.status(500).send(error)
    // })  
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        //const tasks = await Tasks.findById(_id)
        const task = await Tasks.findOne({_id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch(e) {
        res.status(500).send()

    }

    // Tasks.findById(_id).then((tasks) => {
    
    //     if(!tasks) {
    //     return res.status(404).send()
    // }
    // res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({_id:req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        } res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router

