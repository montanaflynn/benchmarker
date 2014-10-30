# Benchmarker (Unstable)

An experimental benchmarker with it's own configuration file format which uses nodejs to run software and collect performance metrics. 

### Usage

Create a `benchmark.json` file with an array of objects representing the software you want to benchmark. Each object must have a name and path with an optional command. 

	[
		{
			"name":"Node MD5",
			"path":"./md5.js",
			"command":"node",
		}, {
			"name":"Python MD5",
			"path":"./md5.py",
			"command":"python",
		}, {
			"name":"GO MD5",
			"path":"./gomd5"
		}
	]

### Results

Here's the output from benchmarking a [simple palindrome finding program](https://github.com/montanaflynn/palindromes) in many different languages:

	{
	  "C": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 32,
	    "max": 55,
	    "total": 3391,
	    "average": "33.91",
	    "stdDev": "2.70",
	    "percentile": {
	      "95th": 38,
	      "75th": 34,
	      "50th": 33,
	      "25th": 32,
	      "5th": 33
	    }
	  },
	  "Go": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 111,
	    "max": 123,
	    "total": 11382,
	    "average": "113.82",
	    "stdDev": "2.20",
	    "percentile": {
	      "95th": 117,
	      "75th": 115,
	      "50th": 113,
	      "25th": 112,
	      "5th": 113
	    }
	  },
	  "Haskell": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 198,
	    "max": 239,
	    "total": 20884,
	    "average": "208.84",
	    "stdDev": "7.49",
	    "percentile": {
	      "95th": 226,
	      "75th": 212,
	      "50th": 207,
	      "25th": 204,
	      "5th": 207
	    }
	  },
	  "Java": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 244,
	    "max": 262,
	    "total": 25028,
	    "average": "250.28",
	    "stdDev": "3.14",
	    "percentile": {
	      "95th": 256,
	      "75th": 252,
	      "50th": 250,
	      "25th": 248,
	      "5th": 250
	    }
	  },
	  "JavaScript": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 197,
	    "max": 226,
	    "total": 20401,
	    "average": "204.01",
	    "stdDev": "4.04",
	    "percentile": {
	      "95th": 210.5,
	      "75th": 206,
	      "50th": 203,
	      "25th": 202,
	      "5th": 203
	    }
	  },
	  "Python": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 221,
	    "max": 238,
	    "total": 22663,
	    "average": "226.63",
	    "stdDev": "3.57",
	    "percentile": {
	      "95th": 233.5,
	      "75th": 229,
	      "50th": 226,
	      "25th": 224,
	      "5th": 226
	    }
	  },
	  "Ruby": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 143,
	    "max": 168,
	    "total": 14911,
	    "average": "149.11",
	    "stdDev": "5.20",
	    "percentile": {
	      "95th": 160,
	      "75th": 151,
	      "50th": 148,
	      "25th": 145,
	      "5th": 148
	    }
	  },
	  "Rust": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 35,
	    "max": 39,
	    "total": 3608,
	    "average": "36.08",
	    "stdDev": "0.63",
	    "percentile": {
	      "95th": 37,
	      "75th": 36,
	      "50th": 36,
	      "25th": 36,
	      "5th": 36
	    }
	  },
	  "Scala": {
	    "runs": "100",
	    "success": 100,
	    "error": 0,
	    "min": 495,
	    "max": 537,
	    "total": 50913,
	    "average": "509.13",
	    "stdDev": "9.07",
	    "percentile": {
	      "95th": 528.5,
	      "75th": 514.5,
	      "50th": 507,
	      "25th": 502,
	      "5th": 507
	    }
	  }
	}