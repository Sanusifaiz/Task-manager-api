const mongoose = require('mongoose')


mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})




// const Tasks = mongoose.model('Tasks', {
//      Description: {
//          type: String,
//          required: true,
//          trim: true
//      },
//      completed: {
//          type: Boolean,
//          default: false
//      }
//  })








//  const task = new Tasks({
//      Description: 'Pick the kids from school    '
//  })

//  task.save().then(() => {
//      console.log(task)
//  }).catch((error) => {
//      console.log('Error!', error)
//  })
