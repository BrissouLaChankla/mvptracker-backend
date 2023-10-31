const mongoose = require('mongoose');

const updateSchema = mongoose.Schema({
 lastUpdate: Date,
});

const Update = mongoose.model('updates', updateSchema);

module.exports = Update;