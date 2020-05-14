const checkContainers = (Containers) => {
  let changed = false
  Containers.find({})
    .stream()
    .on('data', function (doc) {
      if (
        Math.abs(new Date() - doc.created + (new Date() - doc.last_modified)) >
          1080000 || // If container is older than 3hrs or inactive longer than 30mins
        Math.abs(new Date() - doc.last_modified) > 180000
      )
      {
        console.log('changed state')
        changed = true
      }
    })
    .on('error', function (err) {
      console.error(err)
    })
    .on('end', function () {
      Containers.estimatedDocumentCount({}, (error, result) => {
        var d = new Date()
        var datestring =
          d.getDate() +
          '-' +
          (d.getMonth() + 1) +
          '-' +
          d.getFullYear() +
          ' ' +
          d.getHours() +
          ':' +
          ('0' + d.getMinutes()).slice(-2) +
          ':' +
          ('0' + d.getSeconds()).slice(-2)
        if (error) console.error(error) // Give the container count active every 5 minutes
        changed && console.log(`${result} containers are active at: ${datestring}`)
      })
    })
}

exports.default = checkContainers
