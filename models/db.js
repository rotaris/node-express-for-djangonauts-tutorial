var mongoose = require('mongoose')

var pollSchema = new mongoose.Schema({
  question: {type: String, required: true},
  pubDate: {type: Date, required: true},
  // Can have subdocuments (data not normalised into separate table/collection in this case)
  choices: [{choiceText: String, votes: {type: Number, required: true, default: 0}}]
}, {
  // Set the MongoDB collection name
  // See note on: http://mongoosejs.com/docs/api.html#index_Mongoose-model
  // See option 'collection' on: http://mongoosejs.com/docs/api.html#index_Mongoose-Schema
  collection: 'poll'
})

// We can easily add methods to models
pollSchema.methods.wasPublishedRecently = function() {
  var now = new Date()
  var delta = Math.abs(now.getTime() - this.pubDate.getTime())
  // If the difference is less than 
  // the number of milliseconds in a day
  return delta <= (60*60*24*1000)
}

exports.pollSchema = pollSchema

// Register the model
// Optional third argument specifies collection
// See: http://stackoverflow.com/a/7997403/977931
// And see note on: http://mongoosejs.com/docs/api.html#index_Mongoose-model
mongoose.model('Poll', pollSchema)
