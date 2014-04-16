/*
 * Copyright (c) 2014, Fabien LOISON <http://www.flozz.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of the author nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


var Pipe = (function() {

    /**
     * Asynchronous job queue.
     *
     * @class Pipe
     * @constructor
     * @param {Function} successCallback Called when everything is done successfully
     *                                   (optional).
     * @param {Function} errorCallback Called when something goes wrong (optional).
     * @param {Function} progressCallback Called each time a task is done (optional,
     *                                    callback: `function(progress){}` where
     *                                    progress is a number between 0 and 1).
     */
    var Pipe = function(successCallback, errorCallback, progressCallback) {
        this._jobs = [];
        this.successCallback = successCallback || function(){};
        this.errorCallback = errorCallback || function(){};
        this.progressCallback = progressCallback || function(){};
        this._stopped = true;
    };

    /**
     * Add a job to the pipe.
     *
     * Job callback:
     *
     *     function(pipe, [optional arg]) {}
     *
     * @method add
     * @param {Function} job The job callback.
     * @param arg An optional arg that will be passed as second argument of
     *            the job function.
     */
    Pipe.prototype.add = function(job, arg) {
        this._jobs.push({});
        var jobId = this._jobs.length - 1;

        this._jobs[jobId].job = job;
        this._jobs[jobId].error = this._error.bind(this);
        this._jobs[jobId].done = this._next.bind(this, jobId);
        this._jobs[jobId].args = (arg !== undefined) ? [arg] : [];
    };

    /**
     * Add a job for each item of the argument list.
     *
     * Job callback:
     *
     *     function(pipe, arg) {}
     *
     * @method addAll
     * @param {Function} job The job callback.
     * @param {Array} argList Argument list (each item of the list will be passed
     *                        as second argument of the job function).
     */
    Pipe.prototype.addAll = function(job, argList) {
        for (var i=0 ; i<argList.length ; i++) {
            this.add(job, argList[i]);
        }
    };

    /**
     * Run the pipe.
     *
     * @method run
     * @param * Any argument passed to this function will be passed to
     *          the first job function.
     */
    Pipe.prototype.run = function() {
        this._stopped = false;
        var args = [-1];
        if (arguments.length > 0) {
            for (var i=0 ; i<arguments.length ; i++) {
                args.push(arguments[i]);
            }
        }
        this._next.apply(this, args);
    };

    /**
     * Must be called if any error append in a job.
     *
     * @method _error
     * @private
     * @param * Any argument passed to this function will be passed to the
     *          errorCallback function.
     */
    Pipe.prototype._error = function() {
        this._stopped = true;
        this.errorCallback.apply(this, arguments);
    };

    /**
     * Must be called by each jobs when they are finished.
     *
     * @method _next
     * @private
     * @param jobId The id of the job.
     * @param * Any additional argument passed to this function will be passed to the next
     *          job function or to the successCallback function if it is the last job.
     */
    Pipe.prototype._next = function(jobId) {
        if (this._stopped) {
            return;
        }
        // Progress
        this.progressCallback((jobId+1) / (this._jobs.length));
        // All done
        if (jobId == this._jobs.length -1) {
            var args = [];
            if (arguments.length > 1) {
                for (var i=1 ; i<arguments.length ; i++) {
                    args.push(arguments[i]);
                }
            }
            this._stopped = true;
            this.successCallback.apply(this, args);
            return;
        }
        // Next Job
        jobId++;
        var args = [this._jobs[jobId]].concat(this._jobs[jobId].args);
        if (arguments.length > 1) {
            for (var i=1 ; i<arguments.length ; i++) {
                args.push(arguments[i]);
            }
        }
        try {
            this._jobs[jobId].job.apply(this, args);
        }
        catch (error) {
            this._error(error);
        }
    };

    return Pipe;


    // == Doc for pipe object ==

    /**
     * pipe object that is passed as first parameter of each job function.
     *
     * @Class Jobs pipe object
     */
    /**
     * Must be called by the job when it was sucessfully finished.
     *
     * @method done
     * @static
     * @param * Any argument passed to this function will be passed to the next
     *          job function or to the successCallback function if it is the last job.
     */
    /**
     * Must be called by the job when an error occure (that will
     * stop the pipe and call the errorCallback function).
     *
     * @method error
     * @static
     * @param * Any argument passed to this function will be passed to the
     *          errorCallback function.
     */
})();
