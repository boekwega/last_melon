var mongoose = require('mongoose');
var QuoteSchema = new mongoose.Schema({
  quotation: String,
  source: String
});
mongoose.model('Quote', QuoteSchema);