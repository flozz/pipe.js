# Pipe.js

![Pipe](http://pix.toile-libre.org/upload/original/1396295604.png)

Simply queue asynchrone jobs.


## Simple Example

```javascript
// New pipe
var p = new Pipe(

        // On Success
        function(result) {
            console.log("result", result);
        },

        // On error
        function() {
            console.log("Oops!");
        }

        // On progress
        function(progress) {
            console.log("Progress: " + Math.round(progress*100) + "%");
        }

);

// Job 1
p.add(function(pipe, value) {
    console.log("Job 1");
    // Async stuff
    setTimeout(function() {
        pipe.next(value + 42);
    }, 1000);
});

// Job 2
p.add(function(pipe, value) {
    console.log("Job 2");
    // Async stuff
    setTimeout(function() {
        pipe.next(value + 48);
    }, 500);
});

// Let's go!
p.run(10);
```
