
            (function(modules){
                function require(filename){
                    var fn = modules[filename]
                    var module = { exports :{}}
                    fn(require,module,module.exports)
                    return module.exports
                }
                require('C:\Users\DotW\Desktop\simplepack\src\index.js')
            })({'C:\Users\DotW\Desktop\simplepack\src\index.js':function(){"use strict";

var _greeting = require("./greeting.js");

document.write((0, _greeting.greeting)('qjw'));},'./greeting.js':function(){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;
function greeting(name) {
  return 'hello' + name;
}},})
        
        