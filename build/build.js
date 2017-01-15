const webpack = require('webpack')

let builds = require('./config').getAllBuilds()

build(builds)

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    let config = builds[built]
    webpack(config, () => {
      console.log(`building ${config.output.filename}`)
      built++
      if (built < total) {
        next()
      } else {
        console.log('End of the building.')
      }
    })
  }

  next()
}
