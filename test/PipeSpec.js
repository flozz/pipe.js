describe("Pipe asynchronous jobs without error", function() {

    var p = new Pipe();

    p.add(function(pipe, value) {
        setTimeout(function() {
            pipe.next(value + 1);
        }, 10);
    });

    p.add(function(pipe, value) {
        setTimeout(function() {
            pipe.next(value + 2);
        }, 10);
    });

    //

    beforeEach(function() {
        spyOn(p, "endCallback");
        spyOn(p, "stopCallback");
        spyOn(p, "progressCallback");
    });

    it("tracks callbacks", function(done) {
        p.run();
        setTimeout(function() {
            expect(p.endCallback).toHaveBeenCalled();
            expect(p.stopCallback).not.toHaveBeenCalled();
            expect(p.progressCallback).toHaveBeenCalled();
            done();
        }, 100);
    });

    it("checks result with input=0", function(done) {
        p.run(0);
        setTimeout(function() {
            expect(p.endCallback).toHaveBeenCalledWith(3);
            done();
        }, 100);
    });

    it("checks result with input=10", function(done) {
        p.run(10);
        setTimeout(function() {
            expect(p.endCallback).toHaveBeenCalledWith(13);
            done();
        }, 100);
    });

});


describe("Pipe asynchronous jobs with error", function() {

    var p = new Pipe();

    p.add(function(pipe) {
        setTimeout(function() {
            pipe.next();
        }, 10);
    });

    p.add(function(pipe) {
        setTimeout(function() {
            pipe.stop("Error!");
        }, 10);
    });

    //

    beforeEach(function() {
        spyOn(p, "endCallback");
        spyOn(p, "stopCallback");
        spyOn(p, "progressCallback");
        p.run();
    });

    it("tracks callbacks", function(done) {
        setTimeout(function() {
            expect(p.endCallback).not.toHaveBeenCalled();
            expect(p.stopCallback).toHaveBeenCalled();
            expect(p.progressCallback).toHaveBeenCalled();
            done();
        }, 100);
    });

    it("checks error", function(done) {
        setTimeout(function() {
            expect(p.stopCallback).toHaveBeenCalledWith("Error!");
            done();
        }, 100);
    });

});


describe("Pipe asynchronous jobs with a list of value (.addAll())", function() {

    var p = new Pipe();

    p.addAll(function(pipe, value, input) {
        setTimeout(function() {
            pipe.next(input + value);
        }, 10);
    }, [1, 2, 4, 8]);

    //

    beforeEach(function() {
        spyOn(p, "endCallback");
        spyOn(p, "stopCallback");
        spyOn(p, "progressCallback");
    });

    it("tracks callbacks", function(done) {
        p.run();
        setTimeout(function() {
            expect(p.endCallback).toHaveBeenCalled();
            expect(p.stopCallback).not.toHaveBeenCalled();
            expect(p.progressCallback).toHaveBeenCalled();
            done();
        }, 100);
    });

    it("checks result with input=0", function(done) {
        p.run(0);
        setTimeout(function() {
            expect(p.endCallback).toHaveBeenCalledWith(15);
            done();
        }, 100);
    });

    it("checks result with input=10", function(done) {
        p.run(10);
        setTimeout(function() {
            expect(p.endCallback).toHaveBeenCalledWith(25);
            done();
        }, 100);
    });

});
