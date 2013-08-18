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
    x: game.gameOptions.width * 0.5,
    y: game.gameOptions.height * 0.5
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

  player.render = function(playerData){
    var hero;
    hero = game.board.selectAll('circle.player').data(playerData);

    var dragMove = function(){
      var newX = parseInt(d3.event.dx, 10) + parseInt(d3.select(this).attr('cx'),10);
      var newY = parseInt(d3.event.dy, 10) + parseInt(d3.select(this).attr('cy'),10);

      return  hero.attr('cx', function(){ return newX; })
                  .attr('cy', function(){ return newY; })
                  .transition();
    };
    var dragBehavior = d3.behavior.drag().on('drag', dragMove);
    hero.call(dragBehavior);

    hero.enter().append('svg:circle').attr('class', 'player')
      .attr('cx', function(hero){
        return hero.x;
      })
      .attr('cy', function(hero){
        return hero.y;
      })
      .attr('r', 10)
      .attr('fill', 'red');
  };

  game.render = function(enemyData){
    var enemies;
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
    moveEnemies = function() {
      var newEnemyPositions;
      newEnemyPositions = game.createEnemies();
      player.render(player.shape);
      return game.render(newEnemyPositions);
    };
    moveEnemies();
    setInterval(moveEnemies, 1000);
  };
  return game;
};

var newGame = makeGame();
newGame.play();
