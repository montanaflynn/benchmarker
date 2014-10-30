# Benchmarker (Unstable)

An experimental benchmarker with it's own configuration file format which uses nodejs to run software and collect performance metrics. 

### Usage

Create a `benchmark.json` file with an array of objects representing the software you want to benchmark. Each object must have a name and path with an optional command. You can also send options in an options object.

```json
{
    "options": {
        "verbose": false,
        "debug": false,
        "runs": 5
    },
    "software": [
        {
            "name": "Node MD5",
            "path": "./md5.js",
            "command": "node"
        },
        {
            "name": "Python MD5",
            "path": "./md5.py",
            "command": "python"
        },
        {
            "name": "GO MD5",
            "path": "./gomd5"
        }
    ]
}
```

Once you have a benchfile you can run the index.js as an executable with these commands:

    Usage: ./index [./benchfile.json] [options]

    Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -v, --verbose     Verbose mode says what is happening [false]
    -d, --debug       Debug mode keeps run information in output [false]
    -r, --runs [int]  How many runs to perform [10]

If you are in a directory with a benchfile.json you don't need to include it. Command line options over-ride benchfile options.

### Results

For now output is JSON in this struct:

```json
{
    "name" : {
        "runs": 100,
        "success": 100,
        "error": 0,
        "min": 32,
        "max": 55,
        "total": 3391,
        "average": 33.91,
        "stdDev": 2.70,
        "percentile": {
          "95th": 38,
          "75th": 34,
          "50th": 33,
          "25th": 32,
          "5th": 33
        }
    }
}
```

Take a look at the output from benchmarking a [simple palindrome finding program](https://github.com/montanaflynn/palindromes) in different languages and think about the possibilities. I'd like to see charts, outliers, sorting, csv, etc...
