const express = require('express');
const router = express.Router();

router.get('/simple', function(req, res) {
  res.render('./table/simple.art', {
    url: {
      controller: 'table',
      action: 'simple'
    },
    bread: {
      h1: 'Table',
      small: 'simple',
      breadcrumb: ['Table', 'simple'],
      url: {
        controller: 'table',
        action: 'simple'
      }
    }
  });
});

router.get('/data', function(req, res) {
  res.render('./table/data.art', {
    url: {
      controller: 'table',
      action: 'data'
    },
    bread: {
      h1: 'Table',
      small: 'data',
      breadcrumb: ['Table', 'data'],
      url: {
        controller: 'table',
        action: 'data'
      }
    }
  });
});

module.exports = router;