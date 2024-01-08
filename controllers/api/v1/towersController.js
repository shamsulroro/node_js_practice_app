const Tower = require('../../../models/tower');

exports.getTowers = async (req, res, next) => {
  try {
    const user = req.session.user;
    const towers = await Tower.find({ store: user.store })
                              .populate({ path: 'category' })
                              .sort({ name: 'asc'});

    formattedJsonData = towers.map( tower => {
      return {
        "id": tower.id,
        "name": tower.name,
        "harbor_towerid": tower.harbor_towerid,
        "tower_category_name": tower.category.name
      }
    })
    return res.json(formattedJsonData);
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};
