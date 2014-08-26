'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash');


function Goal(o, userId){
  this.name   = o.name;
  this.due    = new Date(o.due);
  this.tags   = o.tags.split(',');
  this.userId = userId;
  this.tasks  = [];
}

Object.defineProperty(Goal, 'collection', {
  get: function(){return global.mongodb.collection('goals');}
});

Goal.create = function(o, userId, cb){
  var goal = new Goal(o, userId);
  Goal.collection.save(goal, cb);
};

Goal.findAllByUserId = function(userId, cb){
  Goal.collection.find({userId:userId}).toArray(cb);
};

Goal.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Goal.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(Goal.prototype, obj));
  });
};
module.exports = Goal;

