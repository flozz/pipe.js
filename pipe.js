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

    var Pipe = function(endCallback, stopCallback, progressCallback) {
        this._jobs = [];
        this.endCallback = endCallback || function(){};
        this.stopCallback = stopCallback || function(){};
        this.progressCallback = progressCallback || function(){};
        this._stopped = true;
    };

    Pipe.prototype.add = function(job, arg) {
        this._jobs.push({});
        var jobId = this._jobs.length - 1;

        this._jobs[jobId].job = job;
        this._jobs[jobId].stop = this.stop.bind(this);
        this._jobs[jobId].next = this._next.bind(this, jobId);
        this._jobs[jobId].args = (arg !== undefined) ? [arg] : [];
    };

    Pipe.prototype.addAll = function(job, argList) {
        for (var i=0 ; i<argList.length ; i++) {
            this.add(job, argList[i]);
        }
    };

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

    Pipe.prototype.stop = function() {
        this._stopped = true;
        this.stopCallback.apply(this, arguments);
    };

    Pipe.prototype._next = function(jobId) {
        if (this._stopped) {
            return;
        }
        // Progress
        this.progressCallback(jobId / (this._jobs.length - 1));
        // All done
        if (jobId == this._jobs.length -1) {
            var args = [];
            if (arguments.length > 1) {
                for (var i=1 ; i<arguments.length ; i++) {
                    args.push(arguments[i]);
                }
            }
            this._stopped = true;
            this.endCallback.apply(this, args);
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
            this.stop(error);
        }
    };

    return Pipe;
})();
