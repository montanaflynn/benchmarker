var execute = require('./execute')
var analyze = require('./analyze')
var output = require('./output')

module.exports = function(benchfile, options, callback) {

  // Option defaults
  options = options || {}
  options.runs = parseInt(options.runs) || 10

  // Show progress or keep quiet
  showProgress = (!options.verbose && !options.quiet) ? true : false

  // Build list of programs to test and data structure
  var list = [], data = {}
  for (var i = 0; i < benchfile.length; i++) {
    var file = benchfile[i]
    var name = file.name
    var command = file.command
    list.push(name)
    data[name] = {
      execute:  command,
      runs: [],
      results: {
        runs: options.runs,
        success: {},
        error: {}
      }
    }
  }

  if (showProgress) {
    // Show progress bar
    var ProgressBar = require('progress')
    var len = list.length * options.runs

    var bar = new ProgressBar('  Benchmarking [:bar] :percent ', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: len
    });
  }

  // Run until done!
  (function run(list, data) {

    // If we're done with all the languages analyze the results
    if (!list.length) {

      // Once we have results send them to output
      analyze(data, function(results){
        output(results, options, callback)
      })

    // otherwise keep moving forward
    } else {

      // Get the data from the list
      var name = list[0]
      var item = data[name]

      // If we have no more runs to go move on
      if (item.runs.length == options.runs) {
        delete item.execute
        list.shift()
        run(list, data)

      // On to the next run
      } else {

        // Execute the program
        var command = item.execute
        execute(command, function(code, output, time){

          // What happened
          var outcome = code ? "error" : "success"

          // Be loud
          if (options.verbose){
            var runNums = " run #" + (item.runs.length + 1)
            var outcomeStr = " outcome: " + outcome + " ("+time+"ms)"
            console.log(name + runNums + outcomeStr)
          }

          // Keep score
          item.runs.push({
            time: time,
            code: code,
            stdout: output.stdout,
            stdoutLines: (output.stdout.split("\n").length - 1),
            stdoutLength: output.stdout.length,
            stderr: output.stderr,
            stderrLines: (output.stderr.split("\n").length - 1),
            stderrLength: output.stderr.length
          })

          // Update progress bar
          if (showProgress)
            bar.tick(1)

          // On to the next run
          run(list, data)
        })
      }
    }
  })(list,data)
}
