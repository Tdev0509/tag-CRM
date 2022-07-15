require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var cron = require('node-cron');

var statsRouter = require('./routes/stats');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tagsRouter = require('./routes/tags');
var templatesRouter = require('./routes/templates');
var v1Router = require('./routes/v1');
var companyRouter = require('./routes/companies');

//Cron Job Function
var cronLyonStatSchedule = require('./routes/stats/cronJobs/lyon-stat-cronjob');
var cronPerionStatSchedule = require('./routes/stats/cronJobs/perion-stat-cronjob');
var cronRubiStatSchedule = require('./routes/stats/cronJobs/rubi-stat-cronjob');

//update Cron Job
var cronLyonSplitSchedule = require('./routes/stats/cronJobs/lyon-split');
var cronPerionSplitSchedule = require('./routes/stats/cronJobs/perion-split');
var cronRubiSplitSchedule = require('./routes/stats/cronJobs/rubi-split');

const { auth } = require('./middlewares/auth');
const { cors } = require('./middlewares/cors');

var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', express.static(path.join(__dirname, '/nextsys')));

app.use(cors);

// app.use('/', indexRouter);
app.get('/', function (req, res, next) {

  res.status(200).send({
    "status": 1,
    "response": "Server is in running state"
  });
  res.end();
})
app.use('/users', usersRouter);
app.use('/tags', tagsRouter);
app.use('/companies', companyRouter);
app.use('/templates', templatesRouter);

//STATS
app.use('/stats', statsRouter);

app.use('/v1', auth, v1Router);

// Schedule tasks to be run on the server.
//00 00 12 * * 0-6 */1 * * * *
cron.schedule(
  '0 3 * * *', 
  cronLyonStatSchedule.lyonStatCronJob, 
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  }
);
cron.schedule(
  '0 3 * * *', 
  cronPerionStatSchedule.perionStatCronJob, 
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  }
);
cron.schedule(
  '0 3 * * *', 
  cronRubiStatSchedule.rubiStatCronJob, 
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  }
);

//update split cron job
cron.schedule(
  '5 3 * * *', 
  cronLyonSplitSchedule.lyonSplitUpdateCronJob, 
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  }
);

cron.schedule(
  '5 3 * * *', 
  cronPerionSplitSchedule.perionSplitUpdateCronJob, 
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  }
);

cron.schedule(
  '5 3 * * *', 
  cronRubiSplitSchedule.rubiSplitUpdateCronJob, 
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  }
);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   // res.render('error');

//   //FIX API Issue
//   res.render('error');
//   res.json({ error: err })
// });

// app.use((req, res, next) => {
//   res.sendFile(__dirname, '/nextsys/index.html')
// });

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);

console.log('Lets check http://localhost:' + port);

module.exports = app;
