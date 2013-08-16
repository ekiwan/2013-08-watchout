var createEnemies = function(numberOfEnemies){
  var enemiesArray = [];
  for(var i = 0; i < numberOfEnemies; i++){
    enemiesArray[i] = {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  }
  return enemiesArray;
};