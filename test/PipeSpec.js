describe("Pipe asynchronous jobs without error", function() {

    var p = new Pipe();

    p.add(function(pipe, value) {
        setTimeout(function() {
            pipe.done(value + 1);
        }, 10);
    });

    p.add(function(pipe, value) {
        setTimeout(function() {
            pipe.done(value + 2);
        }, 10);
    });

    //

    beforeEach(function() {
        spyOn(p, "successCallback");
        spyOn(p, "errorCallback");
        spyOn(p, "progressCallback");
    });

    it("tracks callbacks", function(done) {
        p.run();
        setTimeout(function() {
            expect(p.successCallback).toHaveBeenCalled();
            expect(p.errorCallback).not.toHaveBeenCalled();
            expect(p.progressCallback).toHaveBeenCalled();
            done();
        }, 100);
    });

    it("checks result for input=0", function(done) {
        p.run(0);
        setTimeout(function() {
            expect(p.successCallback).toHaveBeenCalledWith(3);
            done();
        }, 100);
    });

    it("checks result for input=10", function(done) {
        p.run(10);
        setTimeout(function() {
            expect(p.successCallback).toHaveBeenCalledWith(13);
            done();
        }, 100);
    });

    it("checks progress", function(done) {
        p.run(10);
        setTimeout(function() {
            expect(p.progressCallback).toHaveBeenCalledWith(0);
            expect(p.progressCallback).toHaveBeenCalledWith(.5);
            expect(p.progressCallback).toHaveBeenCalledWith(1);
            done();
        }, 100);
    });

});


describe("Pipe asynchronous jobs with error", function() {

    var p = new Pipe();

    p.add(function(pipe) {
        setTimeout(function() {
            pipe.done();
        }, 10);
    });

    p.add(function(pipe) {
        setTimeout(function() {
            pipe.error("Error!");
        }, 10);
    });

    //

    beforeEach(function() {
        spyOn(p, "successCallback");
        spyOn(p, "errorCallback");
        spyOn(p, "progressCallback");
        p.run();
    });

    it("tracks callbacks", function(done) {
        setTimeout(function() {
            expect(p.successCallback).not.toHaveBeenCalled();
            expect(p.errorCallback).toHaveBeenCalled();
            expect(p.progressCallback).toHaveBeenCalled();
            done();
        }, 100);
    });

    it("checks error", function(done) {
        setTimeout(function() {
            expect(p.errorCallback).toHaveBeenCalledWith("Error!");
            done();
        }, 100);
    });

    it("checks progress", function(done) {
        p.run(10);
        setTimeout(function() {
            expect(p.progressCallback).toHaveBeenCalledWith(0);
            expect(p.progressCallback).toHaveBeenCalledWith(.5);
            done();
        }, 100);
    });

});


describe("Pipe asynchronous jobs with a list of value (.addAll())", function() {

    var p = new Pipe();

    p.addAll(function(pipe, value, input) {
        setTimeout(function() {
            pipe.done(input + value);
        }, 10);
    }, [1, 2, 4, 8]);

    //

    beforeEach(function() {
        spyOn(p, "successCallback");
        spyOn(p, "errorCallback");
        spyOn(p, "progressCallback");
    });

    it("tracks callbacks", function(done) {
        p.run();
        setTimeout(function() {
            expect(p.successCallback).toHaveBeenCalled();
            expect(p.errorCallback).not.toHaveBeenCalled();
            expect(p.progressCallback).toHaveBeenCalled();
            done();
        }, 100);
    });

    it("checks result for input=0", function(done) {
        p.run(0);
        setTimeout(function() {
            expect(p.successCallback).toHaveBeenCalledWith(15);
            done();
        }, 200);
    });

    it("checks result for input=10", function(done) {
        p.run(10);
        setTimeout(function() {
            expect(p.successCallback).toHaveBeenCalledWith(25);
            done();
        }, 200);
    });

    it("checks progress", function(done) {
        p.run();
        setTimeout(function() {
            expect(p.progressCallback).toHaveBeenCalledWith(0);
            expect(p.progressCallback).toHaveBeenCalledWith(.25);
            expect(p.progressCallback).toHaveBeenCalledWith(.5);
            expect(p.progressCallback).toHaveBeenCalledWith(.75);
            expect(p.progressCallback).toHaveBeenCalledWith(1);
            done();
        }, 200);
    });

});
