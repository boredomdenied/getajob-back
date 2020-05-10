function sendVerifyEmail (User) { 
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: User.email,
      from: 'noreply@byreference.engineer',
      subject: 'Verify your email with byreference.engineer',
      text: '',
      html: '<p>Hello `${User.firstname}`. Thank you for signing up with byreference.engineer. Please visit the following link to activate your account</p><a href=https://byreference.engineer/api/user/verify/`${User.email_uuid}`',
    };

    (async () => {
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body)
        }
        return 403
      }
      return 200
    })();
  }

exports.default = sendVerifyEmail
