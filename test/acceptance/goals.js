/* global describe, before, beforeEach, it */

'use strict';

process.env.DB = 'life-coach-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('goals', function(){
  this.timeout(10000);
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /', function(){
    it('should fetch the home page', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Home');
        done();
      });
    });
  });
  describe('get /goals/new', function(){
    it('should fetch the goals page', function(done){
      request(app)
      .get('/goals/new')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Name');
        expect(res.text).to.include('Due');
        expect(res.text).to.include('Tags');
        done();
      });
    });
  });
  describe('post /goals', function(){
    it('should create a new goal', function(done){
      request(app)
      .post('/goals')
      .set('cookie', cookie)
      .send('name=become+a+nurse&due=2014-08-28&tags=nurse')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
  describe('get /goals', function(){
    it('should show the new goals page', function(done){
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .send('name=become+a+nurse&due=2014-08-28&tags=nurse')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('doctor');
        expect(res.text).to.include('marathon');
        done();
      });
    });
  });
  describe('get /goals/3', function(){
    it('should show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('marathon');
        done();
      });
    });
    it('should show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000003')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
  describe('post /goals/3/tasks', function(){
    it('should create a task for a goal', function(done){
      request(app)
      .post('/goals/a00000000000000000000001/tasks')
      .set('cookie', cookie)
      .send('name=Get+Shoes&description=Buy+Shoes&difficulty=Hard&rank=1')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});
