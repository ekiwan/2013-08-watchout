


var gameOptions = {
  height: 450,
  width: 700,
  numberOfEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('.board').append('svg:svg')
.attr('width', gameOptions.width)
.attr('height', gameOptions.height);

var createEnemies = function(){
  var enemiesArray = [];
  for(var i = 0; i < gameOptions.numberOfEnemies; i++){
    enemiesArray[i] = {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  }
  return enemiesArray;
};

var render = function(enemyData){
  var enemies;
  enemies = gameBoard.selectAll('circle.enemy').data(enemyData, function(d) {
    return d.id;
  });
  enemies.enter().append('svg:circle').attr('class', 'enemy')
  .attr('cx', function(enemy){
    return axes.x(enemy.x);
  })
  .attr('cy', function(enemy){
    return axes.y(enemy.y);
  })
  .attr('r', 10);
  enemies.exit().remove();
};

var newEnemies = createEnemies();
render(newEnemies);