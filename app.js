
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , mongoose = require('mongoose')
  , pollsdb = require('./models/db')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// Error Handling
// As per "How do you handle 404s?" on http://expressjs.com/faq.html
app.use(function(req, res){
  res.status(404).render('404');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// A couple of example routes that were
// created when the app skeleton was created
app.get('/', routes.index);
app.get('/users', user.list);

// Our routes
app.get('/polls', routes.pollIndex);
app.get('/polls/:poll_id', routes.detail);
app.get('/polls/:poll_id/results', routes.results);
app.get('/polls/:poll_id/vote', routes.vote);
app.post('/polls/:poll_id/vote', routes.vote);

// Example regex route
// Show shoes between certain sizes
// Example valid URL 1: /items/shoes/sizes/8-13
// Example valid URL 2: /items/shoes/sizes/10-13
app.get(/^\/items\/shoes\/sizes\/(\d{0,2})-(\d{1,2})$/, function(req, res){
  var min_size = req.params[0];
  var max_size = req.params[1];
  res.send('Showing shoes between sizes ' + min_size + ' to ' + max_size);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
