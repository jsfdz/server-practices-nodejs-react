const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user.model')

require('dotenv').config()
const port = process.env.PORT || 3000
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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
  const {name, email, password} = req.body
  const hashPassword = await bcrypt.hash(password, 10)
  User({
    name,
    email,
    password: hashPassword
  }).save()
  res.status(200).json({
    statusCode: 200,
    message: `${name} created!`
  })
})

app.get('/users', async (req, res) => {
  const users = await User.find()
  res.status(200).json({
    statusCode: 200,
    data: {users}
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
