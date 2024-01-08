const Tower = require("../access_log");

exports.createAccessLogValidationSchema = {
  tower: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  },
  locker: {
    notEmpty: {
      errorMessage: 'must be a present',
    }
  }
}
