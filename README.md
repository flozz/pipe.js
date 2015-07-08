# Pipe.js

[ ![Build Status](https://api.travis-ci.org/flozz/pipe.js.svg?branch=master) ](https://travis-ci.org/flozz/pipe.js)
[ ![NPM Version](http://img.shields.io/npm/v/flozz-pipejs.svg?style=flat) ](https://www.npmjs.com/package/flozz-pipejs)
[ ![License](http://img.shields.io/npm/l/flozz-pipejs.svg?style=flat) ](https://www.npmjs.com/package/flozz-pipejs)

![Pipe](http://pix.toile-libre.org/upload/original/1396295604.png)

Simply queue asynchrone jobs.



## Create a Pipe

### New Pipe

```javascript
var p = new Pipe(
    function() {},         // Success Callback
    function() {},         // Error Callback
    function(progress) {}  // Progress callback
);
```

### Add a job

Simple job:

```javascript
p.add(function(pipe) {
    // Job code here...
});
```

Job with an argument:

```javascript
p.add(function(pipe, arg) {
    // Job code here...
}, "argument");
```

### Add multiple job in one round

You can add multiple jobs whose share the same code but that will receive different arguments:

```javascript
p.addAll(function(pipe, arg) {
    // Job code here...
}, ["arg1", "arg2", "arg3"]);
```

This add 3 jobs and is equivalent to:

```javascript
p.add(function(pipe, arg) {
    // Job code here...
}, "arg1");

p.add(function(pipe, arg) {
    // Job code here...
}, "arg2");

p.add(function(pipe, arg) {
    // Job code here...
}, "arg3");
```

### Run the pipe

Once all jobs are in the Pipe, you can run it:

```javascript
p.run()
```

**NOTE:** Any argument passed to the `run()` method will be forwarded to the first job.


## About jobs and pipe object

Jobs are just Javascript functions. Each job receive a `pipe` object as first parameter.

The `pipe` object provides two useful functions:

  * `pipe.done()`: must be called when the job is done (this will start the next job).
     Any argument passed to this function will be forwarded to the next job or to the `successCallback`
     function if it is the last job.

  * `pipe.error()`: must be called if an error occurred (this will stop the Pipe and call the `errorCallback`).
     Any argument passed to this function will be forwarded to the `errorCallback` function.

**Example of Job:**

```javascipt
function job(pipe, url) {
    var img = new Image();
    img.onload = function() {
        pipe.done(img);
    }
    img.onerror = function(error) {
        pipe.error(error);
    }
    img.src = url;
}
```
