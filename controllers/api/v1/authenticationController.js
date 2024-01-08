const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');

exports.postValidateLogin = async (req,res, next) => {
  try {
    const username = req.body.username;
    const user =  await User.findOne({ username: username });
    if (user) {
      res.json({ });
    }
    else {
      res.status(422).json({error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({error: "User not found" });
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    const username = req.body.username;
    const login_pin = req.body.login_pin;
    const user =  await User.findOne({ username: username });
    if (!user) {
      res.status(422).json({ error: 'unauthorized' });
    }
    else{
      const doMatch = await bcrypt.compare(login_pin, user.login_pin);
      if(doMatch) {
        const full_name = `${user.first_name}  ${user.last_name}`;

        const payload = {
          id: user._id,
          username: user.username
        };
        const secret = 'your-secret-key';
        const options = { expiresIn: '84h' };
        token = jwt.sign(payload, secret, options);
        req.session.user = user;
        req.session.save();
        res.json({ token: token, store_id: user.store, full_name: full_name });
      }
      else {
        res.status(422).json({ error: 'unauthorized' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: 'unauthorized' });
  }
};
