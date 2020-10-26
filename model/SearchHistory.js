var mongoose = require('mongoose')
var SearchHistorySchema = new mongoose.Schema({
    keyword: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    category: String,
    searchedBy: [{
        email: String,
        dateSearched: Date
    }],
    dateCreated: Date,
    dateModified: Date
});
mongoose.model('SearchHistory', SearchHistorySchema);
module.exports = mongoose.model('SearchHistory');
