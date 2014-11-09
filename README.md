# Benchmarker
## A benchmarking tool with it's own configuration file.  

### Usage

```
    Usage: benchmarker [options]

    Options:

      -h, --help                        output usage information
      -b, --benchfile [file]            path to a Benchfile
      -q, --quiet                       quiet mode only shows results
      -v, --verbose                     verbose mode says what is happening
      -d, --debug                       debug mode keeps run information in output
      -s, --sort                        sort mode sorts results by fastest total time
      -f, --format [json|csv|tsv|xml]   specify the output format
      -o, --output [file]               save results to output file
      -r, --runs [int]                  how many runs to perform
```

### Try it out

```shell
git clone git@github.com:montanaflynn/benchmarker.git
cd benchmarker
npm install
./benchmarker -b example/Benchfile
```

__Protip:__ Use [jq](http://stedolan.github.io/jq/) to fine-tune the returned json data. Here's an example:

```shell
# Be sure to use --quiet or -q so benchmarker only outputs JSON
benchmarker --quiet | jq '[.[] | {name: .name, total: .results.total}]'
```

## Readme Driven Development
### Thar be dragons below; things may not work or be accurate.

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

### Todos

I'd like to see charts, outliers, sorting, csv, plugins, etc...
