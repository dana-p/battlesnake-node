var config  = require('../config.json');
var express = require('express');
var router  = express.Router();
var game;
var matrix;
var snakes;
var our_snake_id = '73bca580-105c-4c12-a352-f4fcb85c699f';
var our_snake;
var priority = {
  "empty" : 0,
  "food" : 100,
  "snake" : -100,
  "wall" : -100
};

// Handle GET request to '/'
router.get(config.routes.info, function (req, res) {
  // Response data
  var data = {
    color: config.snake.color,
    head_url: config.snake.head_url
  };

  return res.json(data);
});

// Handle POST request to '/start'
router.post(config.routes.start, function (req, res) {
  // Do something here to start the game
  game = req.body;
  //console.log(game);
  matrix = new Array(game.height);
  for (var i = 0; i < game.height; i++) {
    matrix[i] = new Array(game.width);
    for(var j = 0; j < game.width; j++){
      matrix[i][j] = priority.empty;
    }
  }

  snakes = game.snakes;

  our_snake = snakes.filter(function(snake) {
    return snake.id == our_snake_id;
  })[0];

  for(var i = 0; i < snakes.length; i++){
    for(var j = 0; j < snakes[i].coords.length; j++){
      matrix[snakes[i].coords[j][0]][snakes[i].coords[j][1]] = priority.snake;
    }
  }

  for(var i = 0; i < matrix.length; i++){
    console.log("" + matrix[i]);
  }
  // Response data
  var data = {
    taunt: config.snake.taunt.start
  };

  return res.json(data);
});

// Handle POST request to '/move'
router.post(config.routes.move, function (req, res) {
  // Do something here to generate your move



  // Response data
  var data = {
    move: 'north', // one of: ["north", "east", "south", "west"]
    taunt: 'What?!' || config.snake.taunt.move
  };

  return res.json(data);
});

// Handle POST request to '/end'
router.post(config.routes.end, function (req, res) {
  // Do something here to end your snake's session

  // We don't need a response so just send back a 200
  res.status(200);
  return res.json({end:'end'});
    //res.end();
});


module.exports = router;
