const Store = require("../models/store");

exports.getStores = (req, res, next) => {
  const successFlashMessage = req.flash('notice');
  const errorFlashMessage = req.flash('alert');
  const flashMessage = successFlashMessage[0] || errorFlashMessage[0]
  const isSuccessFlashMessage = (successFlashMessage.length > 0) ? true : false;

  Store.find()
  .then(stores  => {
    res.render('stores/index',{
      pageTitle: 'Stores',
      path: '/admin/stores',
      stores: stores,
      flashMessage: flashMessage,
      isSuccessFlashMessage: isSuccessFlashMessage,
      currentUser: req.session.user,
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getNewStore = (req, res, next) => {
  res.render('stores/edit-store',{
    pageTitle: 'Add Store',
    path: '/admin/new-store',
    editing: false,
    currentUser: req.session.user,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postCreateStore = (req, res, next) => {
  const name = req.body.name;
  const address1 = req.body.address1;
  const address2 = req.body.address2;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;
  const zip = req.body.zip;

  const store = new Store({
    name: name, address1: address1, address2: address2, city: city, state: state, country: country, zip: +zip
  });

  store.save()
  .then(result => {
    console.log('Store Created');
    req.flash('notice', 'Store was Successfully Created')
    res.redirect('/admin/stores');
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getEditStore = (req, res, next) => {
  const store_id = req.params.store_id
  Store.findById(store_id)
  .then(store  => {
    res.render('stores/edit-store', {
      pageTitle: 'Edit Store',
      path: '/admin/edit-store',
      store: store,
      editing: true,
      currentUser: req.session.user,
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postUpdateStore = (req, res, next) => {
  const updated_name = req.body.name;
  const updated_address1 = req.body.address1;
  const updated_address2 = req.body.address2;
  const updated_city = req.body.city;
  const updated_state = req.body.state;
  const updated_country = req.body.country;
  const updated_zip = req.body.zip;
  const store_id = req.body.store_id

  Store.findById(store_id)
  .then(store  => {
    store.name = updated_name;
    store.address1 = updated_address1;
    store.address2 = updated_address2;
    store.city = updated_city;
    store.state = updated_state;
    store.country = updated_country;
    store.zip = updated_zip;
    return store.save();
  })
  .then(result => {
    console.log('Updated Successfully');
    req.flash('notice', 'Store was Successfully Updated')
    res.redirect('/admin/stores');
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postDeleteStore = (req, res, next) => {
  const store_id = req.body.store_id
  Store.deleteOne({_id: store_id})
  .then(result => {
    console.log('Deleted Successfully');
    req.flash('notice', 'Store was Successfully Deleted')
    res.redirect('/admin/stores');
  })
  .catch(err => {
    console.log(err);
  })
};
