import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: 'email is required' })
  }
  if (!req.body.password) {
    return res.status(400).send({ message: 'password is required' })
  }
  const { email, password } = req.body

  const record = await User.findOne({ email }).exec()
  if (record) {
    return res
      .status(400)
      .json({ status: 'failed', error: 'User already exists' })
  }

  const user = await User.create({ email, password })
  const token = newToken(user)

  return res.status(201).send({ token })
}

export const signin = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: 'email is required' })
  }
  if (!req.body.password) {
    return res.status(400).send({ message: 'password is required' })
  }
  const { email, password } = req.body

  const user = await User.findOne({ email }).exec()
  if (!user) {
    return res.status(401).send({ message: 'this user does not exist' })
  }

  const isMatch = await user.checkPassword(password)
  if (!isMatch) {
    return res.status(401).send({
      message: 'email and password combination do not match'
    })
  }

  const token = newToken(user)

  return res.status(201).send({ token })
}

export const protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).end()
    }

    const bearerToken = req.headers.authorization
    const splitToken = bearerToken.split(' ')
    if (splitToken[0] !== 'Bearer') {
      return res.status(401).end()
    }
    const jwt = splitToken[1]
    const payload = await verifyToken(jwt)
    if (!payload) {
      return res.status(401).end()
    }
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    if (!user) {
      return res.status(401).end()
    }

    req.user = user
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).end()
  }
}
