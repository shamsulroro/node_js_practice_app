const Store = require('../models/store');
const Tower = require("../models/tower");
const Category = require('../models/category');

exports.getTowers = async (req, res, next) => {
  const successFlashMessage = req.flash('notice');
  const errorFlashMessage = req.flash('alert');
  const flashMessage = successFlashMessage[0] || errorFlashMessage[0]
  const isSuccessFlashMessage = (successFlashMessage.length > 0) ? true : false;
  let towers;
  let store;
  try {
    store = await Store.findById(req.query.store_id);
    towers = await Tower.find().populate({path: 'lockers'})
                               .populate({path: 'category', select: 'name'}).exec();
    res.render('towers/index',{
      pageTitle: 'Towers',
      path: '/admin/towers',
      towers: towers,
      flashMessage: flashMessage,
      isSuccessFlashMessage: isSuccessFlashMessage,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: store
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getNewTower = async (req, res, next) => {
  try {
    const store_id = req.query.store_id;
    const categories = await Category.find({store: { _id: store_id }})
    const store = await Store.findById(store_id);
    res.render('towers/edit-tower',{
      pageTitle: 'Add Tower',
      path: '/admin/towers',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: store,
      categories: categories
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCreateTower = async (req, res, next) => {
  const name = req.body.name;
  const harbor_towerid = req.body.harbor_towerid;
  const store = req.body.store;
  const category = req.body.category;
  const tower = new Tower({
    name: name, harbor_towerid: harbor_towerid, store: store, category: category, lockers_count: 0
  });

  tower.save()
  .then(result => {
    console.log('Tower Created');
    req.flash('notice', 'Tower was Successfully Created')
    res.redirect(`/admin/towers?store_id=${store}`);
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getEditTower = async (req, res, next) => {
  const store_id = req.query.store_id;
  const store = await Store.findById(store_id);
  const categories = await Category.find({store: { _id: store_id }});
  const tower_id = req.params.tower_id
  Tower.findById(tower_id)
  .then(tower  => {
    res.render('towers/edit-tower', {
      pageTitle: 'Edit Tower',
      path: '/admin/edit-tower',
      tower: tower,
      editing: true,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: store,
      categories: categories
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postUpdateTower = async (req, res, next) => {
  const name = req.body.name;
  const harbor_towerid = req.body.harbor_towerid;
  const store = req.body.store;
  const category = req.body.category;
  const tower_id = req.body.tower_id

  Tower.findById(tower_id)
  .then(tower  => {
    tower.name = name;
    tower.harbor_towerid = harbor_towerid;
    tower.category = category;
    return tower.save();
  })
  .then(result => {
    console.log('Updated Successfully');
    req.flash('notice', 'Tower was Successfully Updated')
    res.redirect(`/admin/towers?store_id=${store}`);
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postDeleteTower = (req, res, next) => {
  const tower_id = req.body.tower_id
  const store_id = req.body.store_id
  Tower.deleteOne({_id: tower_id})
  .then(result => {
    console.log('Deleted Successfully');
    req.flash('notice', 'Tower was Successfully Deleted')
    res.redirect(`/admin/towers?store_id=${store_id}`);
  })
  .catch(err => {
    console.log(err);
  })
};
