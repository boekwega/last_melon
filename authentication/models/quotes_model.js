var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var QuoteSchema = new mongoose.Schema({
  quotation: String,
  source: String
});
mongoose.model('Quote', QuoteSchema);