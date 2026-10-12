const clean = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      clean(obj[key]);
    }
  }
};

module.exports = (req, res, next) => {
  clean(req.body);
  clean(req.params);
  clean(req.query);
  next();
};