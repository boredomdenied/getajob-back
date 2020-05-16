const jwt = require('jsonwebtoken')
const { exec } = require('child_process')
const fs = require('fs')
const nginxTemplate = require('../nginxTemplate').default

function provisionDockerContainer(Users) {
  return async (req, res) => {
    try {
      // Check user has JWT
      const token = req.cookies.token
      if (!token) {
        const error = 'User must be logged in'
        console.error(error)
        return res.status(403).send({ error })
      }
      // User has JWT, check if they have a running container
      const { id, username } = jwt.verify(token, process.env.JWT_SECRET)
      const user = await Users.findOne({ _id: id }).exec()
      if (user.verified && user.container == null) {
        var Docker = require('dockerode')
        var docker = new Docker({ socketPath: '/var/run/docker.sock' })
        // Find open port
        const portfinder = require('portfinder')
        portfinder.getPort(function (err, port) {
          if (err) res.status(403).send({ message: 'failed to allocate port' })
          // Write nginx conf file
          const conf = nginxTemplate(username, port)
          fs.writeFile(
            `/home/bore/nginx/conf/${port}.conf`,
            conf,
            (err, res) => {
              err &&
                res.status(403).send({ message: 'failed to write conf file' })
              console.log('created conf file')
            }
          )
          exec(
            'sudo /usr/sbin/service nginx reload',
            (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`)
                res.status(403).send({ message: 'failed to reload nginx' })
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`)
                res.status(403).send({ message: 'failed to reload nginx' })
              }
              console.log(`stdout: ${stdout}`)
            }
          )
          // All checks passed, create container
          docker.createContainer(
            {
              Image: 'next:latest',
              Cmd: ['npm', 'run', 'dev'],
              HostConfig: {
                Privileged: true,
                PortBindings: { '3000/tcp': [{ HostPort: `${port}` }] },
                CpuPeriod: 100000,
                CpuQuota: 200000,
                Memory: 209715200,
                MemorySwap: 629145600,
              },
            },
            function (err, container) {
              if (err) res.status(403).send({ message: err })
              else console.log(container.id)
              container.attach(
                {
                  stream: true,
                  stdout: true,
                  stderr: true,
                  tty: true,
                },
                function (err, stream) {
                  if (err) {
                    console.error(err)
                    res.status(403).send({ error: 'Something went wrong' })
                  }
                  stream.pipe(process.stdout)
                  container.start(async function (err, data) {
                    if (err) {
                      console.error(err)
                      res.status(403).send({ error: 'Something went wrong' })
                    } else if (data) {
                      console.log(data)
                      await Users.findOneAndUpdate(
                        { _id: id },
                        { container: container.id, port: `${port}` }
                      ).exec()
                      res.send({
                        message: `Your instance is available at ${username}.launchsite.tech`,
                      })
                    } else {
                      console.error('ZERO')
                      res.status(403).send({ error: 'something went wrong?' })
                    }
                  })
                }
              )
            }
          )
        })
      } else {
        console.error('User already has a running container')
        res.status(403).send({ error: 'User already has a running container' })
      }
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: 'Something went wrong' })
    }
  }
}

exports.default = provisionDockerContainer
