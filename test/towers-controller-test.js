const expect = require('chai').expect
const should = require('chai').should()
const sinon = require('sinon');
const Store = require('../models/store');
const User = require('../models/user');
const Category = require('../models/category');
const Tower = require('../models/tower');
const Locker = require('../models/locker');
const AccessLog = require('../models/access_log');
const ActivityHistory = require('../models/activity_history')
const TowersController = require('../controllers/api/v1/towersController');
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const assert = require('assert');
var user;
var store;
var tower;
var category;
var locker;

describe('Towers controller', function(){
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
        }
        return setup();
      })
      .then(done, done);
  });

  describe('getTowers', function(){
    it('should return towers with status code 200', function(done) {
      const req = httpMocks.createRequest({ session: { user: user }, params: { tower_id: tower._id } })
      const res = httpMocks.createResponse();
      TowersController.getTowers(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        expect(responseData).to.equal([
          {
            id: tower._id.toString(),
            name: tower.name,
            harbor_towerid: tower.harbor_towerid
          }
        ]);
        assert.equal(responseData, 200);
        assert.equal(res.statusCode, 200);
      }).then(done());
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
