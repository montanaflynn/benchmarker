// Analyze the results
module.exports = function analyze(data, callback) {

  for (lang in data) {
    var name = data[lang]
    var runs = name.runs
    var results = name.results

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
      return run.time 
    }))

    // Get slowest
    results.max = Math.max.apply(Math, runs.map(function(run) { 
      return run.time 
    }))

    // Get total
    results.total = runs.reduce(function(sum, run){
      return sum + run.time
    }, 0)
     
    // Get average
    results.average = parseInt((results.total / runs.length).toFixed(2))

    // Get Standard deviation
    results.stdDev = standardDev(runs, results)


    // Get percentiles
    results.percentile = {
      "99th" : percentile(runs, .99),
      "95th" : percentile(runs, .95),
      "75th" : percentile(runs, .75),
      "50th" : percentile(runs, .50),
      "25th" : percentile(runs, .25),
      "5th"  : percentile(runs, .05),
      "1st"  : percentile(runs, .01),
    }

  }

  callback(data)

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
    return run.time 
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

function standardDev(data, results) {
    var squareDiffs = data.map(function(datum){
      var diff = datum.time - results.average
      var sqr = diff * diff
      return sqr
    })

    var avgSquareDiff = average(squareDiffs)

    return parseInt(Math.sqrt(avgSquareDiff).toFixed(2))
}