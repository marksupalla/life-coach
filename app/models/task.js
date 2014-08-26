'use strict';

function Task(t){
  this.name        = t.name;
  this.description = t.description;
  this.difficulty  = t.difficulty;
  this.rank        = t.rank * 1;
  this.isComplete  = false;
}


module.exports = Task;
