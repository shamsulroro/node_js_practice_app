const Store = require('../models/store');
const Category = require('../models/category');
const category = require('../models/category');

exports.getCategories = async (req, res, next) => {
  const successFlashMessage = req.flash('notice');
  const errorFlashMessage = req.flash('alert');
  const flashMessage = successFlashMessage[0] || errorFlashMessage[0]
  const isSuccessFlashMessage = (successFlashMessage.length > 0) ? true : false;
  let categories;
  let store;
  try {
    store = await Store.findById(req.query.store_id);
    categories = await Category.find({ store: store._id });
    res.render('categories/index',{
      pageTitle: 'category',
      path: '/admin/categories',
      categories: categories,
      flashMessage: flashMessage,
      isSuccessFlashMessage: isSuccessFlashMessage,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: store
    });
  } catch (error) {
    console.log(err);
  }
};

exports.getNewCategory = async (req, res, next) => {
  try {
    const store_id = req.query.store_id;
    const store = await Store.findById(store_id);
    res.render('categories/edit-category',{
      pageTitle: 'Add Category',
      path: '/admin/categories',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: store
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCreateCategory = (req, res, next) => {
  const name = req.body.name;
  const store = req.body.store;
  const category = new Category({ name: name, store: store });

  category.save()
  .then(result => {
    console.log('Category Created');
    req.flash('notice', 'Category was Successfully Created')
    res.redirect(`/admin/categories?store_id=${store}`);
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getEditCategory = async (req, res, next) => {
  try {
    const store_id = req.query.store_id;
    const store = await Store.findById(store_id);
    const category_id = req.params.category_id;
    const category = await Category.findById(category_id);
    res.render('categories/edit-category', {
      pageTitle: 'Edit Category',
      path: '/admin/edit-category',
      category: category,
      editing: true,
      nestedData: true,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      store: store
    }) 
  } catch (error) {
    console.log(error)
  }
};

exports.postUpdateCategory = (req, res, next) => {
  const updated_name = req.body.name;
  const category_id = req.body.category_id;
  Category.findById(category_id)
  .then(category  => {
    category.name = updated_name;
    return category.save();
  })
  .then(result => {
    console.log('Updated Successfully');
    req.flash('notice', 'Category was Successfully Updated')
    res.redirect(`/admin/categories?store_id=${result.store._id}`);
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postDeleteCategory = (req, res, next) => {
  const category_id = req.body.category_id
  const store_id = req.body.store_id
  Category.deleteOne({_id: category_id})
  .then(result => {
    console.log('Deleted Successfully');
    req.flash('notice', 'Category was Successfully Deleted')
    res.redirect(`/admin/categories?store_id=${store_id}`);
  })
  .catch(err => {
    console.log(err);
  })
};
