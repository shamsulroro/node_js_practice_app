const expect = require('chai').expect
const sinon = require('sinon');
const Store = require('../models/store');
const User = require('../models/user');
const AuthenticationController = require('../controllers/api/v1/authenticationController');
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const assert = require('assert');
var user;

describe('Authentication controller', function(){
  before(function(done) {
    mongoose
      .connect(
        'mongodb+srv://shamsulhaque:POF0e3YWrFnf6n63@cluster0.28cbquj.mongodb.net/test-shop?retryWrites=true&w=majority'
      )
      .then(result => {
        const store = new Store({
          _id: '65a526045fce514662df3226', name: 'Test Store', address1: 'Test', city: 'Test', state: 'Test', country: 'US', zip: 12345
        });
        return store.save();
      })
      .then(store => {
        user = new User({
          first_name: 'Store', last_name: 'Associate', email: 'store_associate@test.com', 
          role: 3, password: 'Password123#',
          username: 'store_associate', login_pin: '1234', store: store._id
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  afterEach(function() {});

  it('should return unauthorized with status code 422 if accessing the database fails', function(done) {
    const req = httpMocks.createRequest({ body: { 'username': 'store_associate', 'login_pin': '1234' } })
    const res = httpMocks.createResponse();
    sinon.stub(User, 'findOne')
    User.findOne(() => {
      throw new Error('Could not connect to database');
    });

    AuthenticationController.postLogin(req, res, () => {}).then(() => {
      const responseData = res._getJSONData();
      assert.equal(res.statusCode, 422);
      expect(responseData).to.eql({ error: 'unauthorized' });
    }).then(done, done);

    User.findOne.restore();
  });

  describe('postValidateLogin', function(){
    it('should return user not found with status code 422', function(done) {
      const req = httpMocks.createRequest( { body: { 'username': 'store_associate1' } })
      const res = httpMocks.createResponse();

      AuthenticationController.postValidateLogin(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        assert.equal(res.statusCode, 422);
        expect(responseData).to.eql(
          { error: "User not found" }
        );
      }).then(done, done);
    });

    it('should send a response with a valid user status for an existing user', function(done) {
      const req = httpMocks.createRequest( { body: { 'username': 'store_associate' } })
      const res = httpMocks.createResponse();

      AuthenticationController.postValidateLogin(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        assert.equal(res.statusCode, 200);
      }).then(done, done);
    });
  });

  describe('postLogin', function(){
    it('should send a response with a valid user status for an existing user', function(done) {
      const req = httpMocks.createRequest( { session: {save() {}} ,  body: { 'username': 'store_associate', 'login_pin': '1234' } })
      const res = httpMocks.createResponse();
      bcrypt.compare(() => { return true });
      sinon.stub(bcrypt, "compare");
      bcrypt.compare.returns(true)
      sinon.stub(jwt, "sign");
      jwt.sign.returns('abcdefg12345')

      AuthenticationController.postLogin(req, res, () => {}).then(() => {
        const responseData = res._getJSONData();
        assert.equal(res.statusCode, 200);
        expect(responseData).to.eql(
          { "full_name": "Store  Associate", "store_id": "65a526045fce514662df3226", "token": "abcdefg12345" }
        );
      }).then(done, done);
    });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return Store.deleteMany({})
      })
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
