var express = require('express');
var router = express.Router();
const { auth } = require('../middlewares/auth');


//Additional Stat Routes
var perionRouter = require('./stats/admin/perion');
var lyonRouter = require('./stats/admin/lyon');
var manualUpdateRouter = require('./stats/admin/manual-update');
var rubiRouter = require('./stats/admin/rubi');
// var publisherStatRouter = require('./routes/users');

router.use(auth);

//ADMIN STATS
router.use('/admin/perion', perionRouter);
router.use('/admin/lyon', lyonRouter);
router.use('/admin/manual-update', manualUpdateRouter);
router.use('/admin/rubi', rubiRouter);


//PUBLISHER STATS ROUTE
// router.use('/publisher/perion', adminStatRouter);

module.exports = router;

