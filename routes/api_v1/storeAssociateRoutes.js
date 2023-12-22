const express = require('express');
const router = express.Router();
const isStoreAssociateAuth = require('../../middleware/isStoreAssociateAuth');
const qrCodeScannerController = require('../../controllers/api/v1/qrCodeScannerController');
const authenticationController = require('../../controllers/api/v1/authenticationController');
const accessLogController = require('../../controllers/api/v1/accessLogController');
const towersController = require('../../controllers/api/v1/towersController');
const lockersController = require('../../controllers/api/v1/lockersController');
const activityHistoriesController = require('../../controllers/api/v1/activityHistoriesController');

// const lockersController = require('../controllers/lockersController');


// --------------------------- QrCodeScanner routes ---------------------------
// api/v1/qr-code-scanner?tower_id=1&locker_id=1 => GET
router.get('/qr-code-scanner', qrCodeScannerController.getNewDoorOpenRequest);

// api/v1/qr-code-scanner => POST
router.post('/qr-code-scanner', qrCodeScannerController.postCreateDoorOpenRequest);

// --------------------------- Authentication routes ---------------------------

// api/v1/lovalidate_usergin => POST
router.post('/validate_user', authenticationController.postValidateLogin);

// api/v1/login => POST
router.post('/login', authenticationController.postLogin);

// --------------------------- Access Log routes ---------------------------
// /admin/door_requests => GET
router.get('/door_requests', isStoreAssociateAuth, accessLogController.getAccessLogs);

// /admin/door_requests => POST
router.post('/door_requests', isStoreAssociateAuth, accessLogController.postCreateAccessLog);

// door_requests/:id/assign_user => PUT
router.put('/door_requests/:id/assign_user', isStoreAssociateAuth, accessLogController.putAssignStoreAssociate);

// door_requests/:id/complete => PUT
router.put('/door_requests/:id/complete', isStoreAssociateAuth, accessLogController.putCompleteAccessLog);

// --------------------------- Towers routes ---------------------------
// api/v1/stores/:store_id/towers => GET
router.get('/stores/:store_id/towers', isStoreAssociateAuth, towersController.getTowers);

// --------------------------- Locker routes ---------------------------
// api/v1/towers/:tower_id/lockers => GET
router.get('/towers/:tower_id/lockers', isStoreAssociateAuth, lockersController.getLockers);

// --------------------------- Activity Histories routes ---------------------------
// api/v1/activity_histories => GET
router.get('/activity_histories', isStoreAssociateAuth, activityHistoriesController.getActivityHistories);

// api/v1/activity_histories => POST
router.post('/activity_histories', isStoreAssociateAuth, activityHistoriesController.postCreateActivityHistory);

module.exports = router;
