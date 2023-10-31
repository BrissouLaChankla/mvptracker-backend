var express = require('express');
var router = express.Router();

const Game = require('../models/game');
const Update = require('../models/update');

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


      Update.findOne({}).then(data => {
        Update.updateOne({ _id: data._id }, { lastUpdate: new Date() }).then(() => {
          console.log("lastUpdate mis à jour")
        });
      })
    }

  })

});

router.get('/fetchGames', function (req, res) {
  Game.find().then(data => {
    res.json({ result: true, data: data });
  });
});

router.get('/getLastUpdate', function (req, res) {
  Update.findOne({}).then(data => {
    res.json({ result: true, lastUpdate: data.lastUpdate });
  });
});






module.exports = router;
