function provisionDockerContainer(Users, Containers) {
  return async (req, res) => {
    try {
      var Docker = require('dockerode')
      var docker = new Docker({ socketPath: '/var/run/docker.sock' })
      // if (Users.findOne)
      docker.createContainer(
        {
          Image: 'next',
          Cmd: ['npm', 'run', 'dev'],
          HostConfig: {
            Privileged: true,
          },
        },
        function (container) {
          container.attach( 
            {
              stream: true,
              stdout: true,
              stderr: true,
              tty: true,
            },
            function (error, stream) {
              if (error) {
                console.error(error)
                res.status(403).send({ message: error })
              }
              stream.pipe(process.stdout)
              container.start(function (error, data) {
                if (error) {
                  console.error(error)
                  res.status(403).send({ message: error })
                } else if (data) {
                  console.log(data)
                  res.send({
                    message: 'Container has been successfully provisioned',
                  })
                } else {
                  console.error(error)
                  res.status(500).send({ message: error })
                }
              })
            }
          )
        }
      )
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: error })
    }
  }
}

exports.default = provisionDockerContainer
