const express = require('express');
const router = express.Router();

router.use('/public', require('./public'));

router.use('/forms', require('./forms'));

router.get('*', function(req, res) {
  res.render('./public/error.art', {  
      status: 404 
  });  
});

module.exports = router;