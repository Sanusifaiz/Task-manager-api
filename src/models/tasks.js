const mongoose = require('mongoose')
const validator = require('validator')

const TaskSchema = new mongoose.Schema ({
    Description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})




TaskSchema.pre('save', async function (next) {
    const tasks = this
    console.log('Working!')
    next()
})

const Tasks = mongoose.model('Tasks', TaskSchema)



module.exports = Tasks