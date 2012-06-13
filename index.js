/*!
 * Express - Contrib - messages
 * Original Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 * Bootstrap adaptation Copyright(c) 2012 David Murdoch <bootstrap-messages@davidmurdoch.com>
 */

var http = require('http');

var oldFlash = http.IncomingMessage.prototype.flash;

http.IncomingMessage.prototype.flash = function(type, msg){
  var old = oldFlash.apply(this, arguments);

  if (type && msg) {
    if( msg.text ){
      var old = oldFlash.call(this)[type]
        , oldmsg = old.pop()
        , header = msg.header
        , text = msg.text;
        old.push(msg);
      }
      return old;
    }
    return old;
  };

module.exports = function(req, res){

  return function(){
    var buf = []
      , messages = req.flash()
      , types = Object.keys(messages)
      , len = types.length;
    if (!len) return '';
    buf.push('<div class="alerts">');
    for (var i = 0; i < len; ++i) {
      var type = types[i]
        , msgs = messages[type];
      if (msgs) {
        for (var j = 0, l = msgs.length; j < l; ++j) {
          var msg = msgs[j]
            , heading = msg.heading
            , text = heading ? (msg.text || "") : msg;
          buf.push('  <div class="alert alert-' + type + (heading ? ' alert-block' : '') + '">');
          if(heading){
            buf.push('    <h4 class="alert-heading">' + heading + '</h4>');
          }
          buf.push('    <button type="button" class="close" data-dismiss="alert">×</button>');
          buf.push('    ' + text);
          buf.push('  </div>');
        }
      }
    }
    buf.push('</div>');
    return buf.join('\n');
  }
};