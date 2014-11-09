var subshell = require('child_process')
  
module.exports = function(files, options) {

  // Option defaults
  options = options || {}
  options.runs = parseInt(options.runs) || 10

  // Show progress or keep quiet
  showProgress = (!options.verbose && !options.quiet) ? true : false

  // Build list of programs to test and data structure
  var list = [], data = {}
  for (var i = 0; i < files.length; i++) {
    var file = files[i]
    var language = file.language
    var command = file.command
    list.push(language)
    data[language] = {
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
      analyze(data)

    // otherwise keep moving forward
    } else {

      // Get the language data from the list
      var language = list[0]
      var item = data[language]

      // If we have no more runs to go for this language
      if (item.runs.length == options.runs) {
        delete item.execute
        list.shift()
        run(list, data)

      // On to the next run
      } else {

        // Execute the program
        var command = item.execute
        execute(command, function(code, output, time){

          // Wha happen?
          var outcome = code ? "error" : "success"

          // Be loud
          if (options.verbose){
            var runNums = " run #" + item.runs.length + 1
            var outcomeStr = " outcome: " + outcome + " ("+time+"ms)"
            console.log(language + runNums + outcomeStr)
          }

          // Keep score
          item.runs.push({
            time: time,
            code: code,
            output: output,
            outputlines: (output.split("\n").length - 1),
            outputlength: output.length
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

  // Execute the code
  function execute(command, callback) {

    // For benchmarking processing time
    var time = process.hrtime()

    // Run it!
    var ls = subshell.exec(command)

    // Get all stdout
    var stdout = ""
    ls.stdout.on('data', function (data) {
      stdout += data
    })
     
    // process is done
    ls.on('exit', function (code) {

      // How long it took
      var diff = process.hrtime(time)
      var processingTime = diff[0] * 1e9 + diff[1]
      processingTime = Math.ceil(processingTime / 1000000)

      // Send the metrics back to our runner
      callback(code, stdout, processingTime)
    })
  }

  // Analyze the results
  function analyze(data) {

    for (lang in data) {
      var language = data[lang]
      var runs = language.runs
      var results = language.results

      // Get errors
      results.error = runs.reduce(function(sum, run){
        if (run.code != 0) sum++
        return sum
      }, 0)

      // Get successes
      results.success = runs.reduce(function(sum, run){
        if (run.code == 0) sum++
        return sum
      }, 0)

      // Get fastest
      results.min = Math.min.apply(Math, runs.map(function(run) { 
        return run.time; 
      }))

      // Get slowest
      results.max = Math.max.apply(Math, runs.map(function(run) { 
        return run.time; 
      }))

      // Get total
      results.total = runs.reduce(function(sum, run){
        return sum + run.time;
      }, 0)
       
      // Get average
      results.average = parseInt((results.total / runs.length).toFixed(2))


      // Get Standard deviation
      var diffs = runs.map(function(run){
        var diff = run.time - results.average;
        return diff;
      })

      var squareDiffs = runs.map(function(run){
        var diff = run.time - results.average;
        var sqr = diff * diff;
        return sqr;
      })

      var avgSquareDiff = average(squareDiffs)

      results.stdDev = parseInt(Math.sqrt(avgSquareDiff).toFixed(2))

      // Get percentiles
      results.percentile = {
        "90th" : percentile(runs, .90),
        "75th" : percentile(runs, .75),
        "50th" : percentile(runs, .50),
        "25th" : percentile(runs, .25),
        "10th" : percentile(runs, .10),
      }

      if (!options.debug)
        delete language.runs

    }

    output(data)

  }

  function average(data){
    var sum = data.reduce(function(sum, value){
      return sum + value
    }, 0)
   
    var avg = sum / data.length
    return avg
  }

  function percentile(runs, ptile) {
    vals = runs.map(function(run) { 
      return run.time; 
    })
    if (vals.length === 0 || ptile == null || ptile < 0) return NaN
    if (ptile > 1) ptile = 1
    vals = vals.sort(function (a, b) { return a - b })
    var i = (vals.length * ptile) - 0.5
    if ((i | 0) === i) return vals[i]
    var int_part = i | 0
    var fract = i - int_part
    return (1 - fract) * vals[int_part] + fract * vals[int_part + 1]
  }

  // Wrap it up and ship it out
  function output(data) {
    var arr = [];

    for (var item in data) {
      arr.push({
        name: item,
        results: data[item].results
      })
    }

    if (options.sort) {
      arr.sort(function(a, b) {return a.results.total - b.results.total})
    }

    console.log(JSON.stringify(arr,null,2))
  } 

} 
