const Store = require('../models/store');
const Category = require('../models/category');
const { validationResult } = require('express-validator');
const { formatErrorMessagesByKey } = require('../models/validations/formatErrorMessage');

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
      category: null,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: store,
      validationErrors: []
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCreateCategory = async (req, res, next) => {
  const name = req.body.name;
  const store_id = req.body.store;

  try {
    let validationErrors = formatErrorMessagesByKey(validationResult(req));
    const category = new Category({ name: name, store: store_id });
    if(validationErrors.length > 0){
      const store = await Store.findById(store_id);
      res.render('categories/edit-category',{
        pageTitle: 'Add Category',
        path: '/admin/categories',
        editing: false,
        category: category,
        isAuthenticated: req.session.isLoggedIn,
        currentUser: req.session.user,
        nestedData: true,
        store: store,
        validationErrors: validationErrors
      });
    }
    else {
      await category.save()
      console.log('Category Created');
      req.flash('notice', 'Category was Successfully Created')
      res.redirect(`/admin/categories?store_id=${store_id}`);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getEditCategory = async (req, res, next) => {
  try {
    const store_id = req.query.store_id;
    const store = await Store.findById(store_id);
    const category_id = req.params.category_id;
    const category = await Category.findById(category_id);
    res.render('categories/edit-category', {
      pageTitle: 'Edit Category',
      path: '/admin/categories',
      category: category,
      editing: true,
      nestedData: true,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      store: store,
      validationErrors: []
    }) 
  } catch (error) {
    console.log(error)
  }
};

exports.postUpdateCategory = async (req, res, next) => {
  const updated_name = req.body.name;
  const category_id = req.body.category_id;

  try {
    const category = await Category.findById(category_id).populate({ path: 'store' });
    const store = category.store;
    category.name = updated_name;

    let validationErrors = formatErrorMessagesByKey(validationResult(req));
    if(validationErrors.length > 0){
      res.render('categories/edit-category', {
        pageTitle: 'Edit Category',
        path: '/admin/categories',
        category: category,
        editing: true,
        nestedData: true,
        isAuthenticated: req.session.isLoggedIn,
        currentUser: req.session.user,
        store: store,
        validationErrors: validationErrors
      }) 
    } 
    else{
      await category.save();
      req.flash('notice', 'Category was Successfully Updated')
      res.redirect(`/admin/categories?store_id=${store._id}`);
    }
  } catch (error) {
    console.log(error);
  }
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
