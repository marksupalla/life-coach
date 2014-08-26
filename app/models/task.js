'use strict';

function Task(t){
  this.name        = t.name;
  this.description = t.description;
  this.difficulty  = t.difficulty;
  this.rank        = t.rank;
  this.isComplete  = t.isComplete;
}

Object.defineProperty(Task, 'collection', {
  get: function(){return global.mongodb.collection('tasks');}
});

Task.all = function(cb){
  Task.collection.find().toArray(cb);
};


module.exports = Task;
