const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT
// app.use((req, res, next) => {
//     if (req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH') {
//         res.status(503).send('SORRY FOR THE INCONVINIENCES, Site under maintenance, will be back shortly')
//     } else {
        
//     }
// })



app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

//without middleware: new request --> run route handler

// with middleware: new request --> do someting --> run route handler

 

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



//const Task = require('./models/tasks')
//const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5f9347e5b9ab0758f002dcf6')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('5f93440b8ad80458487b812b')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()
// const pet = {
//     name: 'Jake'
// }

// pet.toJSON = function ( ) {
//     console.log(this)
//     return pet
// }
// console.log(JSON.stringify(pet))








// const bcrypt = require('bcryptjs')
// const myFunction = async () => {
//     const password = 'faiz23423'
//     const hashedPassword = await bcrypt.hash(password, 8)

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('faiz23423', hashedPassword)
//     console.log(isMatch)
// }

// myFunction()

