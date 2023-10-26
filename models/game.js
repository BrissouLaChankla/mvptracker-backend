
const mongoose = require('mongoose');


const valueSchema = mongoose.Schema({
    name:String,
    score:Number
});

const gameSchema = mongoose.Schema({
 date: Date,
 op_link: String,
 values: [valueSchema],
});

const Game = mongoose.model('games', gameSchema);

module.exports = Game;