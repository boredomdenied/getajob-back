const jwt = require('jsonwebtoken')

require('dotenv').config()

const setCookie = (res, id, firstname, username) => {
  const expiration = process.env.NODE_ENV === 'production' ? '604800000' : '100'
  const token = jwt.sign({ id, firstname, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.NODE_ENV === 'production' ? '7d' : '1d',
  })
  return res.cookie('token', token, {
    sameSite: 'Lax',
    expires: new Date(Date.now() + expiration),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  })
}
module.exports = setCookie
