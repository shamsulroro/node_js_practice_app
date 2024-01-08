exports.formatErrorMessagesByKey = (validationErrors) => {
  validationErrors = validationErrors ? validationErrors.errors : [];
  if(validationErrors.length == 0) return [];
  
  const errorKeyWithMessages = validationErrors.reduce((errorHash, currentValue) => {
    let key = currentValue.path;
    (errorHash[key] = errorHash[key] || []).push(currentValue.msg);
    return errorHash;
  }, {});

  const formattedErrorMessages = [];
  for (const key in errorKeyWithMessages) {
    let errorObject = validationErrors.find( (error) => error.path === key );
    formattedErrorMessages.push({ path: key, msg: errorKeyWithMessages[key].join(', '), value: errorObject.value })
  }
  return formattedErrorMessages;
};
