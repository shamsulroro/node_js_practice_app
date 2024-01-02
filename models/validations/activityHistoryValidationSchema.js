exports.createActivityHistoryValidationSchema = {
  access_log: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  status: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  activity: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}
