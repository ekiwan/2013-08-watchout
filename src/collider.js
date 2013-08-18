var makeGame = function() {
  var game = {};
  var player = {};

  game.gameOptions = {
    height: 450,
    width: 700,
    numberOfEnemies: 30,
    padding: 20
  };

  player.shape = [{
    x: 0,
    y: 0
  }];

  game.stats = {
    score: 0,
    bestScore: 0
  };

  game.axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, game.gameOptions.width]),
    y: d3.scale.linear().domain([0, 100]).range([0, game.gameOptions.height])
  };

  game.board = d3.select('.board').append('svg:svg')
  .attr('width', game.gameOptions.width)
  .attr('height', game.gameOptions.height);

  game.updateScore = function() {
    return d3.select('#current-score').text(gameStats.score.toString());
  };

  game.updateBestScore = function() {
    gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
    return d3.select('#best-score').text(gameStats.bestScore.toString());
  };


  game.createEnemies = function(){
    var enemiesArray = [];
    for(var i = 0; i < game.gameOptions.numberOfEnemies; i++){
      enemiesArray[i] = {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      };
    }
    return enemiesArray;
  };

  player.getX = function () {
    return this.x;
  };

  player.setX = function (x) {
    var maxX, minX;
    minX = game.gameOptions.padding;
    maxX = game.gameOptions.width - game.gameOptions.padding;
    if (x <= minX) x = minX;
    if (x >= maxX) x = maxX;
    player.x = x;
    return player.x;
  };

  player.getY = function () {
    return player.y;
  };

  player.setY = function (y) {
    var maxY, minY;
    minY = game.gameOptions.padding;
    maxY = game.gameOptions.height - game.gameOptions.padding;
    if (y <= minY) y = minY;
    if (y >= maxY) y = maxY;
    player.y = y;
    return player.y;
  };

  player.transform = function(opts) {
    var hero = game.board.selectAll('circle.player');
    player.setX(opts.x || hero.x);
    player.setY(opts.y || hero.y);
    return hero.attr('transform', ("translate(" + (player.getX()) + "," + (player.getY()) + ")"));
    };

  player.moveAbsolute = function (x, y) {
    return player.transform({
      x: x,
      y: y
    });
  };

  player.moveRelative = function(dx, dy) {
    return player.transform({
      x: player.getX() + dx,
      y: player.getY() + dy
    });
  };

  player.setupDragging = function() {
    var dragBehavior, dragMove,
      hero = game.board.selectAll('circle.player');
    dragMove = function() {
      return player.moveRelative(d3.event.dx, d3.event.dy);
    };
    dragBehavior = d3.behavior.drag().on('drag', dragMove);
    return hero.call(dragBehavior);
  };



  player.render = function(playerData){
    var hero;
    hero = game.board.selectAll('circle.player').data(playerData);
    hero.enter().append('svg:circle').attr('class', 'player')
      .attr('r', 10)
      .attr('fill', 'red');
    player.transform({
      x: game.gameOptions.width * 0.5,
      y: game.gameOptions.height * 0.5
    });
    player.setupDragging();
  };

  game.render = function(enemyData){
    var enemies, checkCollision, onCollision, tweenWithCollisionDetection;
    enemies = game.board.selectAll('circle.enemy').data(enemyData, function(d) {
      return d.id;
    });
    enemies.enter().append('svg:circle').attr('class', 'enemy')
      .attr('cx', function(enemy){
        return game.axes.x(enemy.x);
      })
      .attr('cy', function(enemy){
        return game.axes.y(enemy.y);
      })
      .attr('r', 0);
    enemies.exit().remove();
    enemies.transition().duration(500).attr('r', 10).transition().duration(1000)
      .attr('cx', function(enemy){
        return game.axes.x(enemy.x);
      })
      .attr('cy', function(enemy){
        return game.axes.y(enemy.y);
      });
  };

  game.play = function() {
    var moveEnemies;
    player.render(player.shape);
    moveEnemies = function() {
      var newEnemyPositions;
      newEnemyPositions = game.createEnemies();
      return game.render(newEnemyPositions);
    };
    moveEnemies();
    setInterval(moveEnemies, 1000);
  };
  return game;
};

var newGame = makeGame();
newGame.play();
