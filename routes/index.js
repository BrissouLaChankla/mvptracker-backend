var express = require('express');
var router = express.Router();

const Game = require('../models/game');

router.post('/storeGames', function (req, res) {

  const { date, op_link, values } = req.body

  Game.findOne({ op_link }).then(game => {
    if (game) {
      res.json({ result: false, message: "Game déjà existante" });
     
    } else {
      const newGame = new Game({
        date,
        op_link,
        values
      });

      newGame.save().then(() => {
        res.json({ result: true, message: "Nouvelle game ajoutée en BDD !" });
      })
    }

  })

});

router.get('/fetchGames', function (req, res) {
  Game.find().then(data => {
    res.json({ result: true, data: data });
  });
});

module.exports = router;
