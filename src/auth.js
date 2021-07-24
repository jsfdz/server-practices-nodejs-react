const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET, { 
    algorithm: process.env.ALGORITHM, 
    expiresIn: process.env.EXPIRESIN 
  })
  return token
}

const verifyToken = (token) => {
  const { id } = jwt.verify(token, process.env.SECRET)
  return id
}

const auth = (req, res, next) => {
  const token = req.header('authorization')
  if (!token) {
    next(res.status(401).json({
      statusCode: 401,
      path: req.url,
      message: 'Token is Required'
    }))
    return
  }

  try {
    const payload = verifyToken(token)
    req.id = payload
    next()
  } catch (err) {
    next(res.status(401).json({
      statusCode: 401,
      path: req.url,
      message: 'Invalid Token'
    }))
  }
}

module.exports = {
  generateToken,
  verifyToken,
  auth
}