const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
       type: String,
       require: true,
       trim: true,
       unique: true, 
       lowercase: true,
       validate(value) {
           if (!validator.isEmail(value)) {
               throw new Error ('Email is invalid')
           }
       }
    },

    Password: {
        type: String,
        required: true,
        trim: true,  
        minlength: 6,
         
        validate(value) {
        if (value.toLowerCase().includes('password')) {
            throw new Error('Password cannot contain "password"')
        }
    }
       

    },

    age: {
        type: Number,
       default: 0,
       validate(value) {
          if (value < 0) {
              throw new Error('Age must be a positive number')
          }
       }
   
      },
    
    tokens: [{
          token: {
              type: String,
              required: true
          }
      }], 

    avatar: {
          type:Buffer
      }
  
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
    
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.Password
    delete userObject.tokens
    delete userObject.token
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken =  async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    
    return token
}


userSchema.statics.findByCredentials = async (email, Password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(Password, user.Password)

    if (!isMatch) {
        throw new Error ('Unable to login')
    }
    return user
}

//Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('Password')) {
        user.Password = await bcrypt.hash(user.Password, 8)
    }
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Tasks.deleteMany({owner: user._id})

    next()
})





const User = mongoose.model('User', userSchema)


module.exports = User