const expect = require('chai').expect
const sinon = require('sinon');
const Store = require('../models/store');
const User = require('../models/user');
const Category = require('../models/category');
const Tower = require('../models/tower');
const Locker = require('../models/locker');
const AccessLog = require('../models/access_log');
const ActivityHistory = require('../models/activity_history')
const AccessLogController = require('../controllers/api/v1/accessLogController');
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const assert = require('assert');
var user;
var store;
var access_log;
var access_log2;
var tower;
var category;
var locker;
var activity_history;

describe('AccessLog controller', function(){
  before(function(done) {
    mongoose
      .connect(
        'mongodb+srv://shamsulhaque:POF0e3YWrFnf6n63@cluster0.28cbquj.mongodb.net/test-shop?retryWrites=true&w=majority'
      )
      .then(result => {
        async function setup(){
          store = new Store({
            name: 'Test Store', address1: 'Test', 
            city: 'Test', state: 'Test', country: 'US', zip: 12345
          });
          await store.save();
          user = new User({
            first_name: 'Store', last_name: 'Associate', email: 'store_associate@test.com', 
            role: 3, password: 'Password123#',
            username: 'store_associate', login_pin: '1234', store: store._id
          });
          await user.save();
          category = new Category({ name: 'Health', store: store._id });
          await category.save();
          tower = new Tower({
            name: 'Tower 1', harbor_towerid: '1', store: store._id, category: category._id, lockers_count: 1
          });
          await tower.save();
          locker = new Locker({
            name: 'Locker 1', harbor_lockerid: '1', tower: tower._id, store: store._id
          });
          await locker.save();
          access_log = new AccessLog({
            store: store._id, internal: false, status: 'requested', 
            tower: tower._id, locker: locker._id, 
            harbor_towerid: tower.harbor_towerid, harbor_lockerid: locker.harbor_lockerid
          });
          await access_log.save();
          activity_history = new ActivityHistory({ tower: tower._id, locker: locker._id, store: tower.store,
            access_log: access_log._id, harbor_towerid: tower.harbor_towerid, harbor_lockerid: locker.harbor_lockerid,
            activity: 'Request Received', status: 'success' });
          await activity_history.save();
        }
        return setup();
      })
      .then(done, done);
  });

  describe('getAccessLogs', function(){
    it('should return access logs with status code 200', function(done) {
      const req = httpMocks.createRequest({ session: { user: user } })
      const res = httpMocks.createResponse();
      AccessLogController.getAccessLogs(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        expect(responseData).to.equal([
          {
            id: access_log._id,
            tower_id: tower._id,
            harbor_lockerid: locker.harbor_lockerid,
            harbor_towerid: tower.harbor_towerid,
            created_at: access_log.createdAt,
            tower_name: tower.name,
            locker_name: locker.name,
            tower_category_name: category.name
          }
        ]);
        assert.equal(res.statusCode, 200);
      }).then(done());
    });
  });
    
  describe('postCreateAccessLog', function(){
    it('should return created access log with status code 200', function(done) {
      const req = httpMocks.createRequest({ session: { user: user }, 
        body: { 'tower_id': tower._id, 'locker_id': locker._id } })
      const res = httpMocks.createResponse();
      AccessLogController.postCreateAccessLog(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        expect(responseData).to.have.property('id')
        expect(responseData).to.have.property('tower_id').with.equal(tower._id.toString())
        assert.equal(res.statusCode, 200);
      }).then(done, done);
    });

    it('should return error if tower or locker not passed in request with status code 403', function(done) {
      const req = httpMocks.createRequest({ session: { user: user }, 
        body: { 'tower_id': tower._id,  } })
      const res = httpMocks.createResponse();
      AccessLogController.postCreateAccessLog(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        expect(responseData).to.eql(
          { error: 'You are not authorized to perform this action. Please contact admin' }
        )
        assert.equal(res.statusCode, 403);
      }).then(done, done);
    });
  });

  describe('putAssignStoreAssociate', function(){
    it('should assign store associate to access log with status code 200', function(done) {
      const req = httpMocks.createRequest({ 
        session: { user: user }, 
        params: { 'id': access_log._id } 
      })
      const res = httpMocks.createResponse();
      AccessLogController.putAssignStoreAssociate(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        assert.equal(res.statusCode, 200);
        assert.equal(responseData.user, user._id.toString());
      }).then(done, done);
    });

    beforeEach(function(done) {
      access_log2 = new AccessLog({
        store: store._id, internal: false, status: 'requested', 
        tower: tower._id, locker: locker._id, 
        harbor_towerid: tower.harbor_towerid, harbor_lockerid: locker.harbor_lockerid,
        user: user._id
      });
      access_log2.save()
      .then(done());
    });
    afterEach(function() {});

    it('should return error if user was already assigned with status code 403', function(done) {
      const req = httpMocks.createRequest({ 
        session: { user: user }, 
        params: { 'id': access_log2._id } 
      })
      const res = httpMocks.createResponse();
      AccessLogController.putAssignStoreAssociate(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        assert.equal(res.statusCode, 422);
        assert.equal(responseData.error, 'Associate is already assigned');
      }).then(done, done);
    });
  });


  describe('putCompleteAccessLog', function(){
    it('should complte access log with status code 200', function(done) {
      const req = httpMocks.createRequest({ 
        session: { user: user }, 
        params: { 'id': access_log._id } 
      })
      const res = httpMocks.createResponse();
      AccessLogController.putCompleteAccessLog(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        assert.equal(res.statusCode, 200);
        assert.equal(responseData.status, 'completed');
      }).then(done, done);
    });
  });

  after(function(done) {
    async function deleteData() {
      await User.deleteMany({})
      await Store.deleteMany({})
      await Locker.deleteMany({})
      await Category.deleteMany({})
      await Tower.deleteMany({})
      await AccessLog.deleteMany({})
      await ActivityHistory.deleteMany({})
    }
    deleteData()
    .then(() => {
      return mongoose.disconnect();
    })
    .then(() => {
      done();
    });
  });
});
