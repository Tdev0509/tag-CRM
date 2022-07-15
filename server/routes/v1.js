var express = require('express');
var router = express.Router();
const { auth } = require('../middlewares/auth')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/test', auth, async function(req, res, next) {
  console.log(req.body)
  return res.send(req.user);
});

module.exports = router;
