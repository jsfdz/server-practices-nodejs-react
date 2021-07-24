const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user.model')
const Task = require('./models/task')
const { auth, generateToken } = require('./auth')

require('dotenv').config()
const port = process.env.PORT || 3000
try {
  mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log('Connected!')
} catch (err) {
  console.log(err)
}
const app = express()

app.set('json spaces', 2)

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: 'backend practices v1.0'
  })
})

app.post('/users', async (req, res) => {
  const { name, email, password } = req.body
  const hashPassword = await bcrypt.hash(password, 10)
  const user = await new User({ name, email, password: hashPassword }).save()
  const token = generateToken({ id: user.id })
  res.status(200).json({
    statusCode: 200,
    message: `${name} created!`,
    token
  })
})

app.get('/users', async (req, res) => {
  const users = await User.find()
  res.status(200).json({
    statusCode: 200,
    data: { users }
  })
})

app.delete('/users', auth, async (req, res) => {
  const { id } = req
  await User.findByIdAndDelete(id)
  res.status(200).json({
    statusCode: 200,
    message: 'Deleted!'
  })
})

app.put('/users', auth, async (req, res) => {
  const { id } = req
  const { name, email, password } = req.body
  const hashPassword = await bcrypt.hash(password, 10)
  await User.findByIdAndUpdate(id, { name, email, password: hashPassword })
  res.status(200).json({
    statusCode: 200,
    message: 'Updated!'
  })
})

app.post('/login', async (req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: 'email not found'
    })
  }

  const comparePassword = await bcrypt.compare(password, user.password)
  const token = generateToken({ id: user.id })
  if (comparePassword) {
    res.status(200).json({
      statusCode: 200,
      data: { user },
      token
    })
  } else {
    return res.status(401).json({
      statusCode: 401,
      message: 'invalid password!'
    })
  }
})

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find()
  res.status(200).json({
    statusCode: 200,
    data: { tasks }
  })
})

app.post('/tasks', auth, async (req, res) => {
  const { id } = req
  console.log(id)
  const { name, task, date } = req.body
  const user = await User.findById(id)
  console.log(user)
  await new Task({ name, task, date, authorName: user._id }).save()
  res.status(200).json({
    statusCode: 200,
    message: 'task created!'
  })
})

app.delete('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params
  await Task.findByIdAndDelete(id)
  res.status(200).json({
    statusCode: 200,
    message: 'Task deleted!'
  })
})

app.put('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params
  const { name, task, date, isCompleted } = req.body
  await Task.findByIdAndUpdate(id, { name, task, date, isCompleted })
  res.status(200).json({
    statusCode: 200,
    message: 'task updated!'
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    path: req.path,
    message: 'Ooops! Error 404'
  })
})

app.listen(port, () => {
  console.log('Server run on port:', port)
})
