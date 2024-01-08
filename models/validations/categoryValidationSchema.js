const Category = require("../category");

exports.createCategoryValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) => 
    Category.find({name: value, store: req.body.store }) 
      .then((result) => {
        if (result.length > 0) return Promise.reject('already taken');
      })
    }
  },
  store: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}

exports.updateCategoryValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'must be a present',
    },
    custom: { options: (value, { req }) =>
    Category.findById(req.body.category_id)
      .then((existingCategory) => {
        if(existingCategory.name != value){
          return Category.find({name: value, store: req.body.store }) 
          .then((result) => {
            if (result.length > 0) return Promise.reject('already taken');
          })
        }
      })
    }
  },
  store: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}
