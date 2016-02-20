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
  "wall" : -100
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
  game = req.body;
  updateMap();

  // Response data
  var data = {
    taunt: config.snake.taunt.start
  };

  return res.json(data);
});

// Handle POST request to '/move'
router.post(config.routes.move, function (req, res) {
  // Do something here to generate your move

  var nextMove = nextMove();

  // Response data
  var data = {
    move: nextMove, // one of: ["north", "east", "south", "west"]
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

function updateMap() {
  matrix = new Array(game.height);
  for (var i = 0; i < game.height; i++) {
    matrix[i] = new Array(game.width);
    for(var j = 0; j < game.width; j++){
      matrix[i][j] = priority.empty;
    }
  }
  pMatrix = new Array(game.height);
  for (var i = 0; i < game.height; i++) {
    pMatrix[i] = new Array(game.width);
    for(var j = 0; j < game.width; j++){
      pMatrix[i][j] = priority.empty;
    }
  }
  snakes = game.snakes;

  our_snake = snakes.filter(function(snake) {
    return snake.id == our_snake_id;
  })[0];

  // Enter priority multiplier
  pMatrix = fillPriority(our_snake, pMatrix);

  // Enter food
  for(var i = 0; i < game.food.length; i++){
    //console.log(matrix[game.food[i][0]][game.food[i][1]]);
    var p = pMatrix[game.food[i][0]][game.food[i][1]];
    matrix[game.food[i][0]][game.food[i][1]] = priority.food * p;
  }

  // Enter walls
  for(var i = 0; i < game.walls.length; i++){
    var p =  pMatrix[game.walls[i][0]][game.walls[i][1]];
    matrix[game.walls[i][0]][game.walls[i][1]] = priority.wall * p;
  }

  // Enter snakes
  for(var i = 0; i < snakes.length; i++){
    for(var j = 0; j < snakes[i].coords.length; j++){
      var p = pMatrix[snakes[i].coords[j][0]][snakes[i].coords[j][1]];
      matrix[snakes[i].coords[j][0]][snakes[i].coords[j][1]] = priority.snake * p;
    }
  }

  matrix = math.add(matrix, pMatrix);
  prettyPrint(pMatrix);
  console.log('\n');
  prettyPrint(matrix);
}

function nextMove() {
  updateMap();

  var max = 0;
  var values = [];

  var head = our_snake.coords[0];
  var headx = head[0];
  var heady = head[1];

  var directionValue = [];

  try{directionValue.push({"value" : matrix[headx-1][heady], "direction" : "north"})} catch (TypeError) {}
  try{directionValue.push({"value" : matrix[headx][heady+1], "direction" : "east"})} catch (TypeError) {}
  try{directionValue.push({"value" : matrix[headx+1][heady], "direction" : "south"})} catch (TypeError) {}
  try{directionValue.push({"value" : matrix[headx][heady-1], "direction" : "west"})} catch (TypeError) {}

  dirValues = directionValue.map(function (d) {return d.value});
  max = Math.max.apply(Math, dirValues)

  availableDirections = directionValue.filter(function(d){return d.value == max });
  console.log(availableDirections);

  var dir = availableDirections[Math.floor(Math.random()*availableDirections.length)];
  console.log(dir)
  return dir.direction;
}

module.exports = router;
