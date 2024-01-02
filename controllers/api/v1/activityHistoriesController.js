const AccessLog = require('../../../models/access_log');
const ActivityHistory = require('../../../models/activity_history');
const { validationResult } = require('express-validator');
const { formatErrorMessagesByKey } = require('../../../models/validations/formatErrorMessage');

exports.getActivityHistories = async (req, res, next) => {
  try {
    const limit = 25;
    const user = req.session.user;
    const page = req.body.page ? +req.body.page : 1;

    const paginateOptions = { page: page, limit: limit, sort: { createdAt: 'desc' }, select: 'access_log' };
    var queryOptions = { user: user._id.toString(),  tower: req.body.tower_id, locker: req.body.locker_id };
    const access_log_ids = await ActivityHistory.paginate(queryOptions, paginateOptions, function (err, result) {
      return result.docs.map(activity_history => { 
        return activity_history.access_log.toString() 
      });
    });
  
    const activity_histories = await ActivityHistory.find({
      access_log: access_log_ids
    }).sort({ createdAt: 'desc'});

    const grouped_activity_histories = activity_histories.reduce((result, currentValue) => {
      let key = `${currentValue.access_log} - ${currentValue.createdAt.toDateString()}`;
      (result[key] = result[key] || []).push(currentValue);
      return result;
    }, {});

    let formattedJsonData = [];
    for (const access_log_with_date in grouped_activity_histories) {
      let access_log_with_date_array = access_log_with_date.split(' - ');
      let activity_histories_hash = grouped_activity_histories[access_log_with_date].map(activity_history_record => {
        return {
          id: activity_history_record._id,
          access_log_id: activity_history_record.access_log,
          status: activity_history_record.status,
          activity: activity_history_record.activity,
          created_at: activity_history_record.createdAt
        };
      });
      formattedJsonData.push({
        date: access_log_with_date_array[1],
        activity_histories: {
          access_log_id: access_log_with_date_array[0],
          activity_histories: activity_histories_hash
        }
      })
    }

    return res.json(formattedJsonData);
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error });
  }
};

exports.postCreateActivityHistory = async (req, res, next) => {
  try {
    const currentUser = req.session.user;
    const access_log_id = req.body.access_log;
    const status = req.body.status;
    const activity = req.body.activity;
    const access_log = await AccessLog.findById(access_log_id).populate({ path: 'tower' }).populate({ path: 'locker' })
    
    if(access_log && access_log.store.toString() === currentUser.store.toString() ){
      let validationErrors = formatErrorMessagesByKey(validationResult(req));
      if(validationErrors.length > 0) {
        return res.status(422).json(validationErrors);
      }
      else{
        const activity_history = new ActivityHistory({ tower: access_log.tower._id, locker: access_log.locker._id, 
          store: access_log.store, access_log: access_log._id, harbor_towerid: access_log.tower.harbor_towerid,
          harbor_lockerid: access_log.locker.harbor_lockerid,
          activity: activity, status: status, user: currentUser._id });
        await activity_history.save();
        return res.json(activity_history);
      }
    }
    else {
      return res.status(403).json({
        error: 'You are not authorized to perform this action. Please contact admin'
      });
    }
  } catch (error) {
    return res.status(422).json({ error: error });
  } 
};
