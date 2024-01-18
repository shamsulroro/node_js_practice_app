const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const secret = 'your-secret-key';
    const authorizationToken = req.header('Authorization');
    let token = '';
    if(authorizationToken){
      token = authorizationToken.split(' ')[1];
    }
    else {
      return res.status(422).json({ error: 'Authorization key missing in header' });
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    req.session.user = user;
    next();
  } catch (error) {
    // console.log(error)
    return res.status(422).json({ error: 'unauthorized' });
  }
}
