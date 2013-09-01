var mongoose = require('mongoose');
var pollsdb = require('../models/db');

mongoose.connect('mongodb://localhost/pollsdb');

var conn = mongoose.connection
conn.on('error', console.error.bind(console, 'Database connection error:'));
conn.once('open', function callback () { console.log("Hey handsome. Database connected.") })

var Poll = conn.model("Poll", pollsdb.pollSchema)


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.pollIndex = function(req, res, next) {
  Poll.find().sort('-pubDate').limit(5).exec(function(err, polls) {
    if (err)
      next("Uh oh! Something went wrong when fetching polls from the database.");
    else {
      var questions = new Array();
      for (var i = 0; i < polls.length; i++) {
        questions.push(polls[i].question);
      }
      // Make a comma-separated string of questions
      result = questions.join(", ");
      //res.send(result);
      res.render('pollIndex', { title: "Latest Polls", latest_poll_list: polls });
    }
  }); 
}

exports.detail = function(req, res, next) {
  var poll_id = req.params.poll_id;
  // Check if the ID provided is an ObjectID used by MongoDB (used by default).
  // Could also do this matching in the routes specification.
  // Refer to: http://stackoverflow.com/a/14942113/977931
  if (poll_id.match(/^[0-9a-fA-F]{24}$/)) {
    // findById() is akin to Django's get(pk=poll_id)
    Poll.findById(poll_id).exec(function(err, poll) { 
      if (err) {
        console.log(err);
        // Return a 500 Internal Server Error
        next("Uh oh! Something went wrong when fetching a poll from the database.");
      }
      else if (poll) {
        res.render('pollDetail', { poll: poll });
      }
      else {
        // Pass it along, nothing found (should deliver a 404)
        next();
      }
    });
  }
  else
    // Pass it along, nothing found (should deliver a 404)
    next();
}

exports.results = function(req, res) {
    poll_id = req.params.poll_id
    res.send("You're looking at the results of poll " + poll_id);
}

exports.vote = function(req, res) {
    poll_id = req.params.poll_id
    res.send("You're voting on poll " +  poll_id);
}
