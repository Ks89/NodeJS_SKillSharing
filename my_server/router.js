/**
 * Created by Stefano Cappa on 15/07/15.
 */

/**
 The MIT License (MIT)

 Copyright (c) 2014 Marijn Haverbeke
 Copyright (c) 2015 Stefano Cappa

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */


//export the Router constructor. A router object allows new handlers to
//be registered with the add method and can resolve requests with its resolve method
var Router = module.exports = function () {
    this.routes = [];
};

//add a new element to routes array like this:
//method, url and handler in a JSON format
Router.prototype.add = function (method, url, handler) {
    this.routes.push({
        method: method,
        url: url,
        handler: handler
    });
};


//to resolve requests. It returns true if a handler was found.
//handler functions are called with request and the response objects.
Router.prototype.resolve = function (request, response) {
    //get the path from the request
    var path = require("url").parse(request.url).pathname;

    //some method on the array of router will try yhe routes one at a time (in the order
    //in which they were defined) and stop, returning, true, when a matching one is found
    return this.routes.some(function (route) {
        var match = route.url.exec(path);
        if (!match || route.method != request.method)
            return false;

        //the string must be url-decoded because contains %20-style codes.

        //when the regular expression that matches the url contains any groups, the strings
        //that match are passed to the handler as extra arguments.
        var urlParts = match.slice(1).map(decodeURIComponent);
        route.handler.apply(null, [request, response]
            .concat(urlParts));
        return true;
    });
};
