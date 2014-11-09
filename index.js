#!/usr/bin/env node
var fs = require('fs')
var program = require('commander')
var benchmarker = require('./benchmarker.js')

var options = {}

program
  .option('-b, --benchfile [file]', 'Benchfile to use otherwise use `./benchmark.json`')
  .option('-q, --quiet', 'Quiet mode only shows results')
  .option('-v, --verbose', 'Verbose mode says what is happening')
  .option('-d, --debug', 'Debug mode keeps run information in output')
  .option('-s, --sort', 'Sort mode sorts results by fastest total time')
  .option('-o, --output [file]', 'Save results to output file')
  .option('-r, --runs [int]', 'How many runs to perform', '10')
  .parse(process.argv)

var file = program.benchfile
var currentDir = process.cwd()

file = file ? currentDir + "/" + file : currentDir + "/benchmark.json"

if (program.output === true) {
  console.log("Output file must be specified!")
  console.log("Usage: benchmarker -h")
  process.exit(1) 
}

try {
  var file = require(file)
} catch(e) {
  console.log("Benchfile could not be found or parsed!")
  console.log("Usage: benchmarker -h")
  process.exit(1) 
}

options.quiet = program.quiet || false
options.verbose = program.verbose || false
options.debug = program.debug || false
options.sort = program.sort || false
options.runs = program.runs || 10

if (options.verbose) {
  console.log("Benchmarking with the following options")
  for (option in options) 
    console.log(option + ": " + options[option])
}

benchmarker(file, options, function(results){

  var resultJSON = JSON.stringify(results,null,2)

  if (program.output) {
    fs.writeFile(program.output, resultJSON, function (err) {
      if (err) throw err;
      console.log('Results saved to ' + program.output);
    })
  } else {
    console.log(resultJSON)
  }

})
