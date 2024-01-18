const jwt = require('jsonwebtoken');
const expect = require('chai').expect
const assert = require('assert');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');

const storeAssociateAuthMiddleware = require('../middleware/isStoreAssociateAuth');

describe('Store Associate Authentication Middleware', function () {
  it('should return error if no authorization header present', async function() {
    const req = {
      header: function(headerName){ return null; }
    }
    const res = httpMocks.createResponse();
    await storeAssociateAuthMiddleware( req, res, () => {} )
    const responseData = await res._getJSONData();
    assert.equal(res.statusCode, 422);
    expect(responseData).to.eql({ error: 'Authorization key missing in header' });
  });

  it('should return unauthorized if invalid token', async function() {
    const req = httpMocks.createRequest({ headers: { 'Authorization': 'Bearer abvgfjjjjk' } })
    const res = httpMocks.createResponse();
    await storeAssociateAuthMiddleware( req, res, () => {} )
    const responseData = await res._getJSONData();
    assert.equal(res.statusCode, 422);
    expect(responseData).to.eql({ error: 'unauthorized' });
  });

  it('should continue request with valid token', async function() {
    const req = httpMocks.createRequest({ headers: { 'Authorization': 'Bearer abvgfjjjjk' } })
    const res = httpMocks.createResponse();
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ id: 1 })
    await storeAssociateAuthMiddleware( req, res, () => {} )
    // Write the expectation that next method is called
    jwt.verify.restore();
  });
});