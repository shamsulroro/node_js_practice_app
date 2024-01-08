const Locker = require('../../../models/locker');

exports.getLockers = async (req, res, next) => {
  const user = req.session.user;
  try {
    const lockers = await Locker.find({ store: user.store, tower: req.params.tower_id }).sort({ name: 'asc'});
    const formattedJsonData = lockers.map(locker => {
      return {
        id: locker.id,
        name: locker.name,
        harbor_lockerid: locker.harbor_lockerid
      }
    })
   
    return res.json(formattedJsonData);
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};
