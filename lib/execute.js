var subshell = require('child_process')

// Execute the code
module.exports = function execute(command, callback) {

  // For benchmarking processing time
  var time = process.hrtime()

  // Run it!
  var ls = subshell.exec(command)

  // Get all stdout
  var stdout = ""
  ls.stdout.on('data', function (data) {
    stdout += data
  })

  // Get all stderr
  var stderr = ""
  ls.stderr.on('data', function (data) {
    stderr += data
  })

  // process is done
  ls.on('exit', function (code) {

    // How long it took
    var diff = process.hrtime(time)
    var processingTime = diff[0] * 1e9 + diff[1]
    processingTime = Math.ceil(processingTime / 1000000)

    // Collected for debug mode
    var output = {
      stdout: stdout,
      stderr: stderr
    }

    // Send the metrics back to our runner
    callback(code, output, processingTime)
  })
}