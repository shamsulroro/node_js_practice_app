const Tower = require("../models/tower");
const Locker = require('../models/locker');

exports.getLockers = async (req, res, next) => {
  const successFlashMessage = req.flash('notice');
  const errorFlashMessage = req.flash('alert');
  const flashMessage = successFlashMessage[0] || errorFlashMessage[0]
  const isSuccessFlashMessage = (successFlashMessage.length > 0) ? true : false;
  const tower_id = req.query.tower_id;
  try {
    const tower = await Tower.findById(tower_id).populate({path: 'store'});
    const lockers = await Locker.find({ tower: { _id: tower_id }});
    res.render('lockers/index',{
      pageTitle: 'Locker',
      path: '/admin/towers',
      lockers: lockers,
      flashMessage: flashMessage,
      isSuccessFlashMessage: isSuccessFlashMessage,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: tower.store,
      tower: tower
    });
  } catch (error) {
    console.log(err);
  }
};

exports.getNewLocker = async (req, res, next) => {
  try {
    const tower_id = req.query.tower_id;
    const tower = await Tower.findById(tower_id).populate({path: 'store'});
   
    res.render('lockers/edit-locker',{
      pageTitle: 'Add Locker',
      path: '/admin/towers',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      tower: tower,
      store: tower.store
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCreateLocker = async (req, res, next) => {
  try {
    const name = req.body.name;
    const harbor_lockerid = req.body.harbor_lockerid;
    const tower = req.body.tower;
    const store = req.body.store;
    const lockers_count = await Locker.find({tower: { _id: tower }}).countDocuments();
    const towerObj = await Tower.findById(tower);
    const locker = new Locker({
      name: name, harbor_lockerid: harbor_lockerid, tower: tower, store: store
    });
    await locker.save();
    towerObj.lockers_count = lockers_count + 1;
    await towerObj.save();
    req.flash('notice', 'Locker was Successfully Created')
    res.redirect(`/admin/lockers?tower_id=${tower}`);
  } catch (error) {
    console.log(error);
  }
};

exports.getEditLocker = async (req, res, next) => {
  const locker_id = req.params.locker_id;
  const tower_id = req.params.tower_id
  Locker.findById(locker_id)
  .then(locker  => {
    console.log('locker', locker)
    res.render('lockers/edit-locker', {
      pageTitle: 'Edit Locker',
      path: '/admin/towers',
      editing: true,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      locker: locker,
      tower: locker.tower,
      store: locker.store
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postUpdateLocker = (req, res, next) => {
  const name = req.body.name;
  const harbor_lockerid = req.body.harbor_lockerid;
  const tower = req.body.tower;
  const locker_id = req.body.locker_id

  Locker.findById(locker_id)
  .then(locker  => {
    locker.name = name;
    locker.harbor_lockerid = harbor_lockerid;
    return locker.save();
  })
  .then(result => {
    console.log('Updated Successfully');
    req.flash('notice', 'Tower was Successfully Updated')
    res.redirect(`/admin/lockers?tower_id=${tower}`);
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postDeleteLocker = (req, res, next) => {
  const tower_id = req.body.tower_id
  const store_id = req.body.store_id
  Tower.deleteOne({_id: tower_id})
  .then(result => {
    console.log('Deleted Successfully');
    req.flash('notice', 'Tower was Successfully Deleted')
    res.redirect(`/admin/lockers?store_id=${store_id}`);
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getLockersForSelectedTower = async (req, res, next) => {
  const tower_id = req.query.tower_id;
  try {
    const lockers = await Locker.find({ tower: tower_id});
    return res.json(lockers);
  } catch (error) {
    return res.json({error: error });
  }
};