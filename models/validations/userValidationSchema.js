const User = require('../user');

exports.createUserValidationSchema = {
  first_name: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  last_name: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  role: {
    notEmpty: {
      errorMessage: 'must be a selected',
    }
  },
  email: { 
    notEmpty: {
      errorMessage: 'must be a present',
    },
    isEmail: true,
    custom: { options: (value, { req }) =>
      User.findOne({email: value }) 
      .then((result) => {
        if (result) return Promise.reject('already taken');
      })
    }
  },
  password: {
    custom: { options: (value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role != '3') { 
            if(!value)
              return 'must be a present'
            else if(value.length < 6)
              return 'must be a at least 6 characters'
          }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  },
  store: {
    custom: { options: (value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role != '1'){ 
            if(!value) return 'must be a selected'
          }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  } ,
  username: {
    custom: { options: async(value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role && req.body.role == '3')
            if(!value) return 'must be a present'
            else {
              const user = User.findOne({username: value });
              if (user) return 'already taken';
            }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  },
  login_pin: {
    custom: { options: (value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role && req.body.role == '3'){ 
            if(!value) return 'must be a present'
            else if(value.length !== 4) return 'should be equal to 4 digits'
            else if(value !== `${+value}`) return 'numbers are only allowed'
          }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  },
}

exports.updateUserValidationSchema = {
  first_name: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  last_name: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  role: {
    notEmpty: {
      errorMessage: 'must be a selected',
    }
  },
  email: { 
    notEmpty: {
      errorMessage: 'must be a present',
    },
    isEmail: true,
    custom: { options: (value, { req }) =>
      User.findById(req.body.user_id)
      .then((existingUser) => {
        if(existingUser.email != value){
          return User.findOne({email: value }) 
          .then((result) => {
            if (result) return Promise.reject('already taken');
          })
        }
      })
    }
  },
  password: {
    custom: { options: (value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role != '3'){ 
            if(!value)
              return 'must be a present'
            else if(value.length < 6)
              return 'must be a at least 6 characters'
          }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  },
  store: {
    custom: { options: (value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role != '1'){ 
            if(!value) return 'must be a selected'
          }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  } ,
  username: {
    custom: { options: (value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role && req.body.role == '3')
            if(!value) return 'must be a present'
            else {
              User.findById(req.body.user_id)
              .then(existingUser => {
                if(existingUser.username != value) {
                  return User.findOne({username: value })
                  .then(user => {
                    if(user) return 'already taken';
                  })
                }
              })
            }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  },
  login_pin: {
    custom: { options: (value, { req }) =>
      Promise.any([
        () => {
          if( req.body.role && req.body.role == '3'){ 
            if(!value) return 'must be a present'
            else if(value.length !== 4) return 'should be equal to 4 digits'
            else if(value !== `${+value}`) return 'numbers are only allowed'
          }
        },
      ])
      .then((result) => {
        error_message = result();
        if (error_message) return Promise.reject(error_message);
      })
    }
  },
}

