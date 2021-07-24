const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

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

app.listen(port, () => {
  console.log('Server run on port:', port)
})
