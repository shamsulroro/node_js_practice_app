const Tower = require('../../../models/tower');
const Locker = require('../../../models/locker');
const AccessLog = require('../../../models/access_log');
const ActivityHistory = require('../../../models/activity_history');

exports.getNewDoorOpenRequest = async (req, res, next) => {
  try {
    const tower_id = req.query.tower_id;
    const locker_id = req.query.locker_id;
    const tower = await Tower.findById(tower_id).populate({path: 'category'});
    const locker = await Locker.findOne({ _id: locker_id, tower: tower_id });
  
    res.render('api/v1/qr_code_scanners/door-open-request',{
      pageTitle: 'Door open Request',
      tower: tower,
      locker: locker
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCreateDoorOpenRequest = async (req, res, next) => {
  try {
    const locker_id = req.body.locker_id;
    const tower_id = req.body.tower_id;
    const tower = await Tower.findById(tower_id);
    const locker = await Locker.findOne({ _id: locker_id, tower: tower_id });
    const access_log = new AccessLog({ store: tower.store, locker: locker._id, tower: tower._id,
      harbor_towerid: tower.harbor_towerid, harbor_lockerid: locker.harbor_lockerid, 
      status: 'requested', internal: false  });
    await access_log.save()
    const activity_history = new ActivityHistory({ tower: tower._id, locker: locker._id, store: tower.store,
      access_log: access_log._id, harbor_towerid: tower.harbor_towerid, harbor_lockerid: locker.harbor_lockerid,
      activity: 'Request Received', status: 'success' });
    await activity_history.save();
    
    res.json({ success: "Door open request was sent successfully" });
  } catch (error) {
    res.json({ error: error, errorMessage: "Invalid Qrcode. Please contact a store associate" });
  }
};
