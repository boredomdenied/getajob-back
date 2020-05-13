require('dotenv').config()

let web_url = ''
process.env.NODE_ENV === 'production'
  ? (web_url = 'https://api.byreference.engineer')
  : (web_url = 'http://localhost:5001')

async function sendResetPassword(User, uuid) {
  let isSuccess = 500
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: `${User.email}`,
    from: 'noreply@byreference.engineer',
    subject: 'Verify your email with byreference.engineer',
    text: `Hello ${User.firstname}. Someone has requested to reset their password at byreference.engineer. If this was you, please visit the following link ${web_url}/api/user/reset/${uuid}`,
    html: `<p>Hello ${User.firstname}. Someone has requested to reset their password at byreference.engineer. If this was you, please visit the following link ${web_url}/api/user/reset/${uuid}</p>`,
  }
  const result = await sgMail.send(msg).catch((error) => {
    console.error(error)
    if (error.response) {
      console.error(error.response.body)
    }
    return isSuccess
  })
  isSuccess = result[0].statusCode
  return isSuccess
}

exports.default = sendResetPassword
