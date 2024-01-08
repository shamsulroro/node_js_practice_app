const Store = require('../store');

exports.createStoreValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    isLength: {
      options: { min: 5 },
      errorMessage: 'should be at least 5 characters',
    },
    custom: { options: (value, { req }) => 
      Store.findOne({name: value }) 
      .then((result) => {
        if (result) return Promise.reject('already taken');
      })
    }
  },
  address1: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  city: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  state: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  country: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  zip: {
    notEmpty: {
      errorMessage: 'must  be a present',
    }
  }
}

exports.UpdateStoreValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    isLength: {
      options: { min: 5 },
      errorMessage: 'should be at least 5 characters',
    },
    custom: { options: (value, { req }) =>
      Store.findById(req.body.store_id)
      .then((existingStore) => {
        if(existingStore.name != value){
          return Store.findOne({name: value }) 
          .then((result) => {
            if (result) return Promise.reject('already taken');
          })
        }
      })
    }
  },
  address1: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  city: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  state: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  country: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  zip: {
    notEmpty: {
      errorMessage: 'must  be a present',
    }
  }
}
