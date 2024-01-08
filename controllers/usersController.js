const User = require("../models/user");
const bcrypt = require('bcryptjs');
const Store = require('../models/store');
const { validationResult } = require('express-validator');
const { formatErrorMessagesByKey } = require('../models/validations/formatErrorMessage');

exports.getUsers = async (req, res, next) => {
  const currentUser = req.session.user;
  const successFlashMessage = req.flash('notice');
  const errorFlashMessage = req.flash('alert');
  const flashMessage = successFlashMessage[0] || errorFlashMessage[0];
  const isSuccessFlashMessage = (successFlashMessage.length > 0) ? true : false;
  const store_id = req.query.store_id;
  let users;
  let store;
  let nestedData = false;
  // Poplate users with their corresponding store
  try {
    let userSearchOptions;
    if(currentUser.role == 1){
      userSearchOptions = { role: [ 1, 2 ] }
    }
    else {
      userSearchOptions = { role: [ 2, 3 ] }
    }
    let path = '/admin/users';
    if(store_id){
      path = '/admin/store/users';
      nestedData = true;
      store = await Store.findById(store_id);
      users = await User.find({store: { _id: store_id }}).where(userSearchOptions).populate({path: 'store', select: 'name'}).exec()
    }
    else {
      users = await User.find(userSearchOptions).populate({path: 'store', select: 'name'}).exec()
    }
    res.render('users/index',{
      pageTitle: 'Users',
      path: path,
      users: users,
      flashMessage: flashMessage,
      isSuccessFlashMessage: isSuccessFlashMessage,
      currentUser: currentUser,
      isAuthenticated: req.session.isLoggedIn,
      nestedData: nestedData,
      store: store
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAddUser = async (req, res, next) => {
  try {
    let stores = [];
    let store;
    const store_id = req.query.store_id;
    const currentUser = req.session.user
    let roleOptions;
    let nestedData = false;
    if(currentUser.role == 1){
      roleOptions = store_id ? [["Admin",  2]] : [["Super Admin", 1 ], ["Admin",  2]];
    } 
    else if(currentUser.role == 2) {
      roleOptions = [["Admin", 2], ["Store Associate", 3]]
    }
    let path = '/admin/users';
    if(store_id){
      path = '/admin/store/users';
      nestedData = true;
      store = await Store.findById(store_id);
    }
    else{
      stores = await Store.find();
    }

    res.render('users/edit-user',{
      pageTitle: 'Add User',
      path: path,
      editing: false,
      stores: stores,
      store: store,
      currentUser: currentUser,
      nestedData: nestedData,
      isAuthenticated: req.session.isLoggedIn,
      roleOptions: roleOptions,
      validationErrors: [],
      user: null
    })
  } catch (error) {
    console.log(error);
  }
};

exports.postAddUser = async (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const role = +req.body.role;
  const password = req.body.password;
  const username = req.body.username;
  const login_pin = req.body.login_pin;
  const store_id = req.body.store;
  const is_nested_data = req.body.is_nested_data == 'true';

  let hashedPassword;
  let hashedLoginPin;
  try {
    if (role == 3) {
      hashedPassword = null
      if(login_pin) hashedLoginPin = await bcrypt.hash(login_pin, 12);
    }
    else{
      if (password) hashedPassword = await bcrypt.hash(password, 12);
      hashedLoginPin = null
    }  
    const user = new User({
      first_name: first_name, last_name: last_name, email: email, role: role, password: hashedPassword,
      username: username, login_pin: hashedLoginPin, store: store_id
    });

    let validationErrors = formatErrorMessagesByKey(validationResult(req));
    if(validationErrors.length > 0){
      let stores = [];
      let store;
      const currentUser = req.session.user
      let roleOptions;
      let nestedData = false;
      if(currentUser.role == 1){
        roleOptions = store_id ? [["Admin",  2]] : [["Super Admin", 1 ], ["Admin",  2]];
      } 
      else if(currentUser.role == 2) {
        roleOptions = [["Admin", 2], ["Store Associate", 3]]
      }
      let path = '/admin/users';
      if(is_nested_data && store_id){
        path = '/admin/store/users';
        nestedData = true;
        store = await Store.findById(store_id);
      }
      else{
        stores = await Store.find();
      }
    
      res.render('users/edit-user',{
        pageTitle: 'Add User',
        path: path,
        editing: false,
        stores: stores,
        store: store,
        currentUser: currentUser,
        nestedData: nestedData,
        isAuthenticated: req.session.isLoggedIn,
        roleOptions: roleOptions,
        validationErrors: validationErrors,
        user: user
      })
    }
    else {
      user.save();
      req.flash('notice', 'User was Successfully Created')
      if(is_nested_data && store_id) res.redirect(`/admin/users?store_id=${store_id}`);
      else res.redirect('/admin/users');
    }
  } catch (error) {
    console.log(error)
  }
};

exports.getEditUser = async (req, res, next) => {
  const currentUser = req.session.user
  let roleOptions;
  if(currentUser.role == 1){
    roleOptions = [["Super Admin", 1 ], ["Admin",  2]];
  } 
  else if(currentUser.role == 2) {
    roleOptions = [["Admin", 2], ["Store Associate", 3]]
  }
  let store;
  let nestedData = false;
  const store_id = req.query.store_id;
  let path = '/admin/users';
  if(store_id){
    path = '/admin/store/users';
    nestedData = true;
    store = await Store.findById(store_id);
  }

  const user_id = req.params.user_id
  const stores = await Store.find();
  User.findById(user_id).populate({path: 'store', select: '_id'}).exec()
  .then(user  => {
    res.render('users/edit-user', {
      pageTitle: 'Users',
      path: '/admin/users',
      user: user,
      editing: true,
      stores: stores,
      store: store,
      nestedData: nestedData,
      currentUser: currentUser,
      isAuthenticated: req.session.isLoggedIn,
      roleOptions: roleOptions,
      validationErrors: []
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postEditUser = async (req, res, next) => {
  try {
    const password = req.body.password;
    const login_pin = req.body.login_pin;
    const store_id = req.body.store;
    const role =  +req.body.role;
    const user = await User.findById(req.body.user_id);
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.role = role;
    user.username = req.body.username;
    const is_nested_data = req.body.is_nested_data == 'true';
    if(store_id) { 
      user.store = store_id
    } else {
      user.store = null;
    }
    if (role == 3 && login_pin) {
      user.password = null
      user.login_pin = await bcrypt.hash(login_pin, 12)
    }
    if (role != 3 && password) {
      user.password = await bcrypt.hash(password, 12)
      user.login_pin = null
    }
    let validationErrors = formatErrorMessagesByKey(validationResult(req));
    if(validationErrors.length > 0){
      console.log('validationErrors', validationErrors);
      const currentUser = req.session.user
      let roleOptions;
      if(currentUser.role == 1){
        roleOptions = [["Super Admin", 1 ], ["Admin",  2]];
      } 
      else if(currentUser.role == 2) {
        roleOptions = [["Admin", 2], ["Store Associate", 3]]
      }
      let store;
      let stores;
      if(is_nested_data && store_id){
        store = await Store.findById(store_id);
      }
      else{
        stores = await Store.find();
      }
      res.render('users/edit-user', {
        pageTitle: 'Users',
        path: '/admin/users',
        user: user,
        editing: true,
        stores: stores,
        store: store,
        nestedData: is_nested_data,
        currentUser: currentUser,
        isAuthenticated: req.session.isLoggedIn,
        roleOptions: roleOptions,
        validationErrors: validationErrors
      });
    }
    else {
      await user.save();
      req.flash('notice', 'User was Successfully Updated')
      if(is_nested_data && store_id) res.redirect(`/admin/users?store_id=${store_id}`);
      else res.redirect('/admin/users');
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteUser = (req, res, next) => {
  const user_id = req.body.user_id
  const store_id = req.body.store_id
  User.deleteOne({_id: user_id})
  .then(result => {
    console.log('Deleted Successfully');
    req.flash('notice', 'Product was Successfully Deleted')
    if(store_id) {
      res.redirect(`/admin/users?store_id=${store_id}`)
    }
    else {
      res.redirect('/admin/users');
    }
  })
  .catch(err => {
    console.log(err);
  })
};
