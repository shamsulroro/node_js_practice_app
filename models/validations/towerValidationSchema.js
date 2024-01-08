const Tower = require("../tower");

exports.createTowerValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) => 
      Tower.find({name: value, store: req.body.store }) 
      .then((result) => {
        if (result.length > 0) return Promise.reject('already taken');
      })
    }
  },
  harbor_towerid: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) => 
      Tower.find({harbor_towerid: value }) 
      .then((result) => {
        if (result.length > 0) return Promise.reject('harbor tower ID already taken');
      })
    }
  },
  category: {
    notEmpty: {
      errorMessage: 'must be a selected',
    }
  },
  store: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}

exports.updateTowerValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) =>
      Tower.findById(req.body.tower_id)
      .then((existingTower) => {
        if(existingTower.name != value){
          return Tower.findOne({name: value, store: req.body.store }) 
          .then((result) => {
            if (result) return Promise.reject('already taken');
          })
        }
      })
    }
  },
  harbor_towerid: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) => 
      Tower.findById(req.body.tower_id ) 
      .then((existingTower) => {
        if ( existingTower.harbor_towerid != value ) {
          return Tower.find({harbor_towerid: value }) 
          .then((result) => {
            if (result.length > 0) return Promise.reject('harbor tower ID already taken');
          })
        }
      })
    }
  },
  category: {
    notEmpty: {
      errorMessage: 'must be a selected',
    }
  },
  store: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}
