var config  = require('../config.json');
var express = require('express');
var math = require('mathjs');
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
  "wall" : -100,
  "gold" : 200
};
var pMatrix;

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
  console.log(req.body);
  updateMap(req);

  // Response data
  var data = {
    taunt: config.snake.taunt.start
  };

  return res.json(data);
});

// Handle POST request to '/move'
router.post(config.routes.move, function (req, res) {
  // Do something here to generate your move
  console.log(req.body);
  var next = nextMove(req);
  console.log(next);
  // Response data
  var data = {
    move: next, // one of: ["north", "east", "south", "west"]
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

function prettyPrint(matrix){
  for (var i = 0; i < matrix.length; i++){
    mystring = "";
    for (var j = 0; j < matrix[i].length; j++){
      whitespace = "";
      if (matrix[i][j] >= 0 && matrix[i][j] < 100)
        whitespace = "   ";
      if (matrix[i][j] >= 100)
        whitespace = " ";
      mystring = mystring + whitespace + matrix[i][j] + ",";
    }
    console.log("["+mystring+"]");
  }
}

function fillPriority(s, m){
  var head = s.coords[0];
  firstval = head[0];
  secondval = head[1];

  try{
    m[firstval-1][secondval] = 3;
  } catch (TypeError) {};

  try{ m[firstval+1][secondval] = 3; } catch (TypeError) {}
  try{ m[firstval][secondval-1] = 3; } catch (TypeError) {}
  try{ m[firstval][secondval+1] = 3; } catch (TypeError) {}

  try{ m[firstval-2][secondval] = 2; } catch (TypeError) {}
  try{ m[firstval+2][secondval] = 2; } catch (TypeError) {}
  try{ m[firstval][secondval-2] = 2; } catch (TypeError) {}
  try{ m[firstval][secondval+2] = 2; } catch (TypeError) {}
  try{ m[firstval-1][secondval-1] = 2; } catch (TypeError) {}
  try{ m[firstval+1][secondval+1] = 2; } catch (TypeError) {}
  try{ m[firstval+1][secondval-1] = 2; } catch (TypeError) {}
  try{ m[firstval-1][secondval+1] = 2; } catch (TypeError) {}

  try{ m[firstval-3][secondval] = 1; } catch (TypeError) {}
  try{ m[firstval+3][secondval] = 1; } catch (TypeError) {}
  try{ m[firstval][secondval-3] = 1; } catch (TypeError) {}
  try{ m[firstval][secondval+3] = 1; } catch (TypeError) {}

  try{ m[firstval-2][secondval+1] = 1; } catch (TypeError) {}
  try{ m[firstval-2][secondval-1] = 1; } catch (TypeError) {}
  try{ m[firstval+2][secondval+1] = 1; } catch (TypeError) {}
  try{ m[firstval+2][secondval-1] = 1; } catch (TypeError) {}

  try{ m[firstval-1][secondval+2] = 1; } catch (TypeError) {}
  try{ m[firstval+1][secondval+2] = 1; } catch (TypeError) {}
  try{ m[firstval-1][secondval-2] = 1; } catch (TypeError) {}
  try{ m[firstval+1][secondval-2] = 1; } catch (TypeError) {}

  return m;
}

function updateMap(req) {
  game = req.body;

  matrix = new Array(game.width);
  for (var i = 0; i < game.width; i++) {
    matrix[i] = new Array(game.height);
    for(var j = 0; j < game.height; j++){
      matrix[i][j] = priority.empty;
    }
  }

  pMatrix = new Array(game.width);
  for (var i = 0; i < game.width; i++) {
    pMatrix[i] = new Array(game.height);
    for(var j = 0; j < game.height; j++){
      pMatrix[i][j] = priority.empty;
    }
  }
  try {
    snakes = game.snakes;
  } catch(err) {}
  try{
    our_snake = snakes.filter(function(snake) {
      return snake.id == our_snake_id;
    })[0];
  } catch(err) {}

  // Enter priority multiplier
  try {
    pMatrix = fillPriority(our_snake, pMatrix);
  } catch(err) {}

  // Enter food
  try {
    for (var i = 0; i < game.food.length; i++) {
      var p = pMatrix[game.food[i][0]][game.food[i][1]];
      matrix[game.food[i][0]][game.food[i][1]] = priority.food * p;
    }
  } catch(err) {}

  // Enter walls
  try {
    for (var i = 0; i < game.walls.length; i++) {
      var p = pMatrix[game.walls[i][0]][game.walls[i][1]];
      matrix[game.walls[i][0]][game.walls[i][1]] = priority.wall * p;
    }
  } catch(err) {}

  // Enter gold
  try {
    for (var i = 0; i < game.gold.length; i++) {
      var p = pMatrix[game.gold[i][0]][game.gold[i][1]];
      matrix[game.gold[i][0]][game.gold[i][1]] = priority.gold * p;
    }
  } catch(err) {}

  // Enter snakes
  try{
    for(var i = 0; i < snakes.length; i++){
      for(var j = 0; j < snakes[i].coords.length; j++){
        var p = pMatrix[snakes[i].coords[j][0]][snakes[i].coords[j][1]];
        matrix[snakes[i].coords[j][0]][snakes[i].coords[j][1]] = priority.snake * p;
      }
    }
  } catch(err) {}

  matrix = math.add(matrix, pMatrix);
  prettyPrint(matrix);
}

function nextMove(req) {

  updateMap(req);
  console.log("coordinates: " + our_snake.coords);
  var max = 0;
  var values = [];
  var head = our_snake.coords[0];
  var headx = head[0];
  var heady = head[1];

  var directionValue = [];
  /*
  try{directionValue.push({"value" : matrix[headx-1][heady], "direction" : "north"})} catch (TypeError) {} //north
  try{directionValue.push({"value" : matrix[headx][heady+1], "direction" : "east"})} catch (TypeError) {} //east
  try{directionValue.push({"value" : matrix[headx+1][heady], "direction" : "south"})} catch (TypeError) {} //south
  try{directionValue.push({"value" : matrix[headx][heady-1], "direction" : "west"})} catch (TypeError) {} //west
*/
  try{directionValue.push({"value" : matrix[headx-1][heady], "direction" : "west"})} catch (TypeError) {} //north
  try{directionValue.push({"value" : matrix[headx][heady+1], "direction" : "north"})} catch (TypeError) {} //east
  try{directionValue.push({"value" : matrix[headx+1][heady], "direction" : "east"})} catch (TypeError) {} //south
  try{directionValue.push({"value" : matrix[headx][heady-1], "direction" : "south"})} catch (TypeError) {} //west

  dirValues = directionValue.map(function (d) {return d.value});
  max = Math.max.apply(Math, dirValues);

  availableDirections = directionValue.filter(function(d){return d.value == max });

  var dir = availableDirections[Math.floor(Math.random()*availableDirections.length)];

  return dir.direction;
}

module.exports = router;
