# Benchmarker

A benchmarking tool with it's own configuration file.  

### Try it out

```
git clone git@github.com:montanaflynn/benchmarker.git
cd benchmarker
npm install
./benchmarker -b example/Benchfile
```

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

**Notes**
- If you are in a directory with a benchfile.json you don't need to include it. 
- Command line options override benchfile options.

### Results

For now output is JSON of this structure:

```json
{
    "options": {
        "runs": 100,
        "debug": true,
        "unit": "ms"
    },
    "benchmarks": [
        {
            "name": "Rust",
            "success": 100,
            "error": 0,
            "runs": [
                {
                    "exit": 0,
                    "time": 32,
                    "stdout": "yay it worked",
                    "stdoutlines": 1,
                    "stdoutlength": 13,
                    "stderr": null,
                    "stderrlines": null,
                    "stderrlength": null
                }
            ],
            "results": {
                "min": 32,
                "max": 55,
                "total": 3391,
                "average": 33.91,
                "stdDev": 2.7,
                "percentile": {
                    "95th": 38,
                    "75th": 34,
                    "50th": 33,
                    "25th": 32,
                    "5th": 33
                }
            }
        }
    ]
}
```

**Notes**

- The debug flag adds includes the runs object.
- Benchmarks are sorted by performance.
- [Example output](https://github.com/montanaflynn/palindromes#more-advanced-benchmarks) from palindrome finding program written in different languages. 

### Todos

I'd like to see charts, outliers, sorting, csv, plugins, etc...
