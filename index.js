#!/usr/bin/env node
var program = require('commander')
var benchmarker = require('./benchmarker.js')

var options = {}

program
  .version('0.1.0')
  .option('-q, --quiet', 'Quiet mode only shows results')
  .option('-v, --verbose', 'Verbose mode says what is happening')
  .option('-d, --debug', 'Debug mode keeps run information in output')
  .option('-s, --sort', 'Sort mode sorts results by fastest total time')
  .option('-r, --runs [int]', 'How many runs to perform [int]', '10')
  .parse(process.argv)

var arg = program.args[0]
var file = arg ? process.cwd() + "/" + arg : process.cwd() + "/benchmark.json"

try {
  var file = require(file)
} catch(e) {
  console.log("Benchfile could not be found or parsed!")
  console.log("Docs: https://github.com/montanaflynn/benchmarker")
  console.log("Error Message:")
  console.log(e)
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

benchmarker(file, options)
