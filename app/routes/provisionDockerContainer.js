function provisionDockerContainer(Users) {
  return async (req, res) => {
    try {
      var Docker = require('dockerode');
      var docker = new Docker({socketPath: '/var/run/docker.sock'});

      // docker.buildImage('./Dockerfile.tar', {
      //   t: 'chrome'
      // }, function(err, stream) {
      //   if (err) return;

      //   stream.pipe(process.stdout, {
      //     end: true
      //   });

      //   stream.on('end', function() {
      //     done();
      //   });
      // });
      docker.createContainer(
        {
          Image: 'next',
          Cmd: ['npm', 'run', 'dev'],
          HostConfig: {
            Privileged: true,
          },
        },
        function (err, container) {
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
                res.status(403).send({ message: 'Something went wrong'})
              }
              stream.pipe(process.stdout)
              container.start(function (err, data) {
                if (err) {
                  console.error(err)
                  res.status(403).send({ message: 'Something went wrong'})

                } else if (data) {
                  console.log(data)
                  res.send({message: 'Container has been successfully provisioned'})

                } else {
                  console.error('ZERO')
                  res.status(403).send({message: 'something went wrong?'})
                }
              })
            }
          )
        }
      )
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: 'Something went wrong'})
    }
  }
}

exports.default = provisionDockerContainer
