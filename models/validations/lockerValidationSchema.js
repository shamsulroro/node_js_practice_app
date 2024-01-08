const Locker = require("../locker");

exports.createLockerValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) => 
      Locker.find({name: value, tower: req.body.tower }) 
      .then((result) => {
        if (result.length > 0) return Promise.reject('already taken');
      })
    }
  },
  harbor_lockerid: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) => 
      Locker.find({harbor_lockerid: value }) 
      .then((result) => {
        if (result.length > 0) return Promise.reject('harbor locker ID already taken');
      })
    }
  },
  tower: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  store: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}

exports.updateLockerValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) =>
      Locker.findById(req.body.locker_id)
      .then((existingLocker) => {
        if(existingLocker.name != value){
          return Locker.findOne({name: value, tower: req.body.tower }) 
          .then((result) => {
            if (result) return Promise.reject('already taken');
          })
        }
      })
    }
  },
  harbor_lockerid: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) => 
      Locker.findById(req.body.locker_id ) 
      .then((existingLocker) => {
        if ( existingLocker.harbor_lockerid != value ) {
          return Locker.findOne({harbor_lockerid: value }) 
          .then((result) => {
            if (result) return Promise.reject('harbor tower ID already taken');
          })
        }
      })
    }
  },
  tower: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  store: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}
