const express = require('express');
const router = express.Router();

router.get('/datapick', function(req, res) {
  res.render('./forms/datapick.art', {
    url: {
      controller: 'forms',
      action: 'datapick'
    },
    bread: {
      h1: 'Forms',
      small: 'DatePicker',
      breadcrumb: ['Forms', 'DatePicker'],
      url: {
        controller: 'forms',
        action: 'datapick'
      }
    }
  });
});

module.exports = router;