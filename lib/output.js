// Wrap it up and ship it out
module.exports = function output(data, options, callback) {
  var arr = [];

  for (var item in data) {
    var obj = {
      name: item,
      results: data[item].results
    }

    if (options.debug) {
      obj["runs"] = data[item].runs
    }

    arr.push(obj)
  }

  if (options.sort) {
    arr.sort(function(a, b) {return a.results.total - b.results.total})
  }

  return callback(arr)

} 