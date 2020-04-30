const util = require('util')



function logoutUser (User) {
  return async (req, res) => {
    try {
      if(req.session.user) {
        // delete req.session.user
        res.set({'Clear-Site-Data': 'cookies'})
        req.session.destroy(function(err){
          console.log(err)
          res.send('User successfully logged out')
        })
      } else {
        res.status(403).send('User doesn\'t exist')
      }
    } catch (err) {
      res.status(403).send('Something went wrong')
      console.log(err)
    }
  }
}

exports.default = logoutUser
