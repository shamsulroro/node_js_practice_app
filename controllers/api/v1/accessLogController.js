const AccessLog = require('../../../models/access_log');
const Tower = require('../../../models/tower');
const Locker = require('../../../models/locker');
const ActivityHistory = require('../../../models/activity_history');
const { validationResult } = require('express-validator');
const { formatErrorMessagesByKey } = require('../../../models/validations/formatErrorMessage');

exports.getAccessLogs = async (req, res, next) => {
  try {
    const user = req.session.user;
    const time = Date.now() - (10*60000)
    const access_logs = await AccessLog.find({
      store: user.store, internal: false, status: 'requested',
      createdAt: { $gt: time },
    })
    .populate({ path: 'tower', populate: { path: 'category' }})
    .populate({ path: 'locker' })
    .sort({ createdAt: 'desc'});

    formattedJsonData = access_logs.map( access_log => {
      return {
        "id": access_log._id,
        "tower_id": access_log.tower._id,
        "harbor_lockerid": access_log.harbor_lockerid,
        "harbor_towerid": access_log.harbor_towerid,
        "created_at": access_log.createdAt,
        "tower_name": access_log.tower.name,
        "locker_name": access_log.locker.name,
        "tower_category_name": access_log.tower.category.name
      }
    })

    return res.json(formattedJsonData);
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error });
  }
};

exports.postCreateAccessLog = async (req, res, next) => {
  try {
    const currentUser = req.session.user;
    const tower_id = req.body.tower_id;
    const locker_id = req.body.locker_id;
    const tower = await Tower.findOne({ _id: tower_id, store: currentUser.store })
                             .populate({ path: 'category' });
    const locker = await Locker.findOne({ _id: locker_id, store: currentUser.store });
    
    if(tower && locker ){
      const access_log = new AccessLog({
        user: currentUser._id, store: currentUser.store, internal: true, status: 'progressed', 
        tower: tower_id, locker: locker_id, 
        harbor_towerid: tower.harbor_towerid, harbor_lockerid: locker.harbor_lockerid
      });
      
      let validationErrors = formatErrorMessagesByKey(validationResult(req));
      if(validationErrors.length > 0) {
        await access_log.save();
        const activity_history = new ActivityHistory({ tower: tower._id, locker: locker._id, store: tower.store,
          access_log: access_log._id, harbor_towerid: tower.harbor_towerid, harbor_lockerid: locker.harbor_lockerid,
          activity: 'Associate attempted to open', status: 'success', user: currentUser._id });
        await activity_history.save();

        return res.json({
          "id": access_log._id,
          "tower_id": tower._id,
          "harbor_lockerid": access_log.harbor_lockerid,
          "harbor_towerid": access_log.harbor_towerid,
          "created_at": access_log.createdAt,
          "tower_name": tower.name,
          "locker_name": locker.name,
          "tower_category_name": tower.category.name
        });
      }
      else {
        return res.status(422).json(validationErrors);
      }
    }
    else {
      return res.status(403).json({
        error: 'You are not authorized to perform this action. Please contact admin'
      })
    }
  } catch (error) {
    return res.status(422).json({ error: error });
  } 
};

exports.putAssignStoreAssociate = async (req, res, next) => {
  try {
    const currentUser = req.session.user;
    const access_log = await AccessLog.findById({ _id: req.params.id });
    if(!access_log.user){
      access_log.user = currentUser._id;
      access_log.status = 'progressed';
      await access_log.save();
      await ActivityHistory.updateMany({  access_log: access_log._id }, { user: currentUser._id });
      return res.json(access_log);
    }
    else if(access_log.user.toString() === currentUser._id.toString ){
      return res.json({ message: 'You are already assigned' });
    }
    else{
      return res.status(422).json({  error: 'Associate is already assigned' });
    }
  } catch (error) {
    return res.status(422).json({  error: error });
  }
};

exports.putCompleteAccessLog = async (req, res, next) => {
  try {
    const currentUser = req.session.user;
    const access_log = await AccessLog.findById({ _id: req.params.id });
    access_log.user = currentUser._id;
    access_log.status = 'completed';
    await access_log.save();
    const activity_history = new ActivityHistory({ tower: access_log.tower, locker: access_log.locker, 
      store: access_log.store, access_log: access_log._id, harbor_towerid: access_log.harbor_towerid,
      harbor_lockerid: access_log.harbor_lockerid,
      activity: 'Door opened', status: 'success', user: currentUser._id });
    await activity_history.save();
    return res.json(access_log); 
  } catch (error) {
    return res.status(422).json({ error: error }); 
  }
};
