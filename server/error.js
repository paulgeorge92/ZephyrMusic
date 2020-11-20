const error = function (status, message, stack) {
  this.status = status;
  this.message = message;
  this.stack = stack;
};

exports.module = error;
