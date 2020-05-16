var Docker = require('dockerode')
const jwt = require('jsonwebtoken')
const tar = require('tar-fs')
const fs = require('fs')

function dockerRun(Users, Containers) {
  return async (req, res) => {
    try {
      const token = req.cookies.token
      const { id } = jwt.verify(token, process.env.JWT_SECRET)
      const user = await Users.findOne({ _id: id }).exec()
      user || res.status(403).send({ message: 'User must be logged in' })
      if (user && user.container) {
        fs.writeFile('./test/test.js', req.body.code, (err) => {
          err && res.status(403).send({ message: 'unable to write file' })
        })
        const archive = tar.pack('./test', {
          // entries: ['robots.txt'],
        })
        var docker = new Docker({ socketPath: '/var/run/docker.sock' })
        const container = docker.getContainer(user.container)
        container.putArchive(
          archive,
          { path: '/usr/src/app/pages' },
          (error, response) => {
            error && console.log({ message: error })
          }
        )
        res.status(200).send({ message: `has container ${container}` })
      } else {
        res.status(403).send({ message: 'has no container' })
      }
    } catch (error) {
      res.status(500).send({ error: 'something went wrong' })
    }
  }
}
exports.default = dockerRun
