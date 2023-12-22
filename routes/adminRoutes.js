const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const usersController = require('../controllers/usersController');
const storesController = require('../controllers/storesController');
const towersController = require('../controllers/towersController');
const categoriesController = require('../controllers/categoriesController');
const lockersController = require('../controllers/lockersController');
const activityHistoriesController = require('../controllers/activityHistoriesController');

// --------------------------- Store routes ---------------------------
// /admin/stores => GET
router.get('/stores', isAuth, storesController.getStores);

// /admin/new-store => GET
router.get('/new-store', isAuth, storesController.getNewStore);

// /admin/create-store => POST
router.post('/create-store', isAuth, storesController.postCreateStore);

// /admin/edit-store/:store_id => GET
router.get('/edit-store/:store_id', isAuth, storesController.getEditStore);

// /admin/update-store => POST
router.post('/update-store', isAuth, storesController.postUpdateStore);

// /admin/delete-store/ => POST
router.post('/delete-store', isAuth, storesController.postDeleteStore);

// --------------------------- Users routes ---------------------------
// /admin/users =>  GET
router.get('/users', isAuth, usersController.getUsers);

// /admin/new-user => GET
router.get('/new-user', isAuth, usersController.getAddUser);

// /admin/add-user => POST
router.post('/add-user', isAuth, usersController.postAddUser);

// /admin/edit-product/:product_id => GET
router.get('/edit-user/:user_id', isAuth, usersController.getEditUser);

// /admin/update-user/ => POST
router.post('/update-user', isAuth, usersController.postEditUser);

// /admin/delete-user/ => POST
router.post('/delete-user', isAuth, usersController.postDeleteUser);

// --------------------------- Towers routes ---------------------------
// /admin/towers => GET
router.get('/towers', isAuth, towersController.getTowers);

// /admin/new-tower => GET
router.get('/new-tower', isAuth, towersController.getNewTower);

// /admin/create-tower => POST
router.post('/create-tower', isAuth, towersController.postCreateTower);

// /admin/edit-tower/:tower_id => GET
router.get('/edit-tower/:tower_id', isAuth, towersController.getEditTower);

// /admin/update-tower => POST
router.post('/update-tower', isAuth, towersController.postUpdateTower);

// /admin/delete-tower/ => POST
router.post('/delete-tower', isAuth, towersController.postDeleteTower);

// --------------------------- Categories routes ---------------------------
// /admin/categories => GET
router.get('/categories', isAuth, categoriesController.getCategories);

// // /admin/new-category => GET
router.get('/new-category', isAuth, categoriesController.getNewCategory);

// /admin/create-category => POST
router.post('/create-category', isAuth, categoriesController.postCreateCategory);

// /admin/edit-tower/:category_id => GET
router.get('/edit-category/:category_id', isAuth, categoriesController.getEditCategory);

// /admin/update-category => POST
router.post('/update-category', isAuth, categoriesController.postUpdateCategory);

// /admin/delete-category/ => POST
router.post('/delete-category', isAuth, categoriesController.postDeleteCategory);

// --------------------------- Locker routes ---------------------------
// /admin/lockers => GET
router.get('/lockers', isAuth, lockersController.getLockers);

// /admin/new-locker => GET
router.get('/new-locker', isAuth, lockersController.getNewLocker);

// /admin/create-locker => POST
router.post('/create-locker', isAuth, lockersController.postCreateLocker);

// /admin/edit-locker/:locker_id => GET
router.get('/edit-locker/:locker_id', isAuth, lockersController.getEditLocker);

// /admin/update-locker => POST
router.post('/update-locker', isAuth, lockersController.postUpdateLocker);

// /admin/delete-locker/ => POST
router.post('/delete-locker', isAuth, lockersController.postDeleteLocker);

// /admin/lockers/all => GET
router.get('/lockers/all', lockersController.getLockersForSelectedTower);


// --------------------------- Activity Histories routes ---------------------------
// /admin/lockers => GET
router.get('/activity-histories', isAuth, activityHistoriesController.getActivityHistories);


module.exports = router;
