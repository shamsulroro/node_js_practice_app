const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const secret = 'your-secret-key';
    console.log("req.header", req)
    const authorizationToken = req.header('Authorization');
    let token = '';
    console.log("authorizationToken", authorizationToken)
    if(authorizationToken){
      token = authorizationToken.split(' ')[1];
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    req.session.user = user;
    next();
  } catch (error) {
    console.log(error)
    return res.status(422).json({ error: 'unauthorized' });
  }
}
