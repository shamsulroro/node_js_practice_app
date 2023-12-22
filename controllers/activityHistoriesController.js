const Store = require('../models/store');
const User = require('../models/user');
const Tower = require('../models/tower');
const Locker = require('../models/locker');
const ActivityHistory = require('../models/activity_history');

exports.getActivityHistories = async (req, res, next) => {
  const successFlashMessage = req.flash('notice');
  const errorFlashMessage = req.flash('alert');
  const flashMessage = successFlashMessage[0] || errorFlashMessage[0]
  const isSuccessFlashMessage = (successFlashMessage.length > 0) ? true : false;
  let lockers = [];
  try {
    if(!req.query.store_id){
      return res.status(422).json({ error: "Store id is missing" });
    }
    const buildQuery = { store: req.query.store_id };
    const searchedQuery = req.query;

    if(searchedQuery.user && searchedQuery.user != ''){
      buildQuery.user = searchedQuery.user
    }
    if(searchedQuery.tower && searchedQuery.tower != ''){
      buildQuery.tower = searchedQuery.tower
      lockers = await Locker.find({ tower: searchedQuery.tower });
    }
    if(searchedQuery.locker && searchedQuery.locker != ''){
      buildQuery.locker = searchedQuery.locker
    }
    if(searchedQuery.status && searchedQuery.status != ''){
      buildQuery.status = searchedQuery.status
    }
    const store = await Store.findById(req.query.store_id);
    const storeAssociates = await User.find({ store: store._id, role: 3 });
    const towers = await Tower.find({ store: store._id });

    let currentPage = req.query.page ? +req.query.page : 1;
    const paginateOptions = { 
      page: currentPage, limit: 3, sort: { createdAt: 'desc' },
      populate: [{ path: 'user' }, { path: 'tower', populate: { path: 'category' }}, { path: 'locker' }]
    };
    const result = await ActivityHistory.paginate(buildQuery, paginateOptions, function (err, result) {
      return result
    });
    const activity_histories = result.docs;


    // const activity_histories = await ActivityHistory.find(buildQuery)
    //                                                 .populate({ path: 'user' })
    //                                                 .populate({ path: 'tower', populate: { path: 'category' }})
    //                                                 .populate({ path: 'locker' })
    //                                                 .sort({ createdAt: 'desc'});



    let onSides = 3;
    let pages = [];
    // Loop through
    let last_page = result.totalPages == result.page;
    for (let i = 1; i <= result.totalPages; i++) {
      // Define offset
      let offset = (i == result.page || last_page) ? onSides + 1 : onSides;
      // If added
      if (i == 1 || (result.page - offset <= i && result.page + offset >= i) || 
        i == result.page || i == last_page) {
        pages.push(i);
      } else if (i == result.page - (offset + 1) || i == result.page + (offset + 1)) {
        pages.push('...');
      }
    }

    res.render('activity_histories/index',{
      pageTitle: 'Activity Histories',
      path: '/admin/activity-histories',
      result: result,
      activity_histories: activity_histories,
      flashMessage: flashMessage,
      isSuccessFlashMessage: isSuccessFlashMessage,
      isAuthenticated: req.session.isLoggedIn,
      currentUser: req.session.user,
      nestedData: true,
      store: store,
      storeAssociates: storeAssociates,
      towers: towers,
      lockers: lockers,
      searchedQuery: searchedQuery,
      pages: pages
    });
  } catch (error) {
    console.log(error);
  }
};
