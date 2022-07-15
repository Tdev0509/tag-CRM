var express = require('express');
var router = express.Router();
const { auth } = require('../../../middlewares/auth');
const { LyonReports, db, Tags } = require('../../../services/arango');
const lyonsFunctions = require('../helpers/lyon-scraper');
var axios = require('axios');
var moment = require('moment');

router.use(auth);

//Gets summary row for lyon stats
router.get('/summary_metrics', async (req, res, next) => {
    console.log('Summary Metrics Route')
    //console.log(req.query)
    const { company } = req.query;
    //Gets the starting day of the month UTC MS Timestamp
    let startOfCurrentMonth = moment().utc().startOf('month').toDate().getTime();

    //Gets the end of month day of the month UTC MS Timestamp
    let endOfCurrentMonth = moment().utc().endOf('month').toDate().getTime();
    let dayInCurrentMonth = moment(startOfCurrentMonth).daysInMonth();

    let startOfBeforeMonth = moment().subtract(1, 'months').utc().startOf('month').toDate().getTime();

    let endOfBeforeMonth = moment().subtract(1, 'months').utc().endOf('month').toDate().getTime();
    let dayInBeforeMonth = moment(startOfBeforeMonth).daysInMonth();
    let startOfTwoBeforeMonth = moment().subtract(2, 'months').utc().startOf('month').toDate().getTime();
    let endOfTwoBeforeMonth = moment().subtract(2, 'months').utc().endOf('month').toDate().getTime();
    let dayInTwoBeforeMonth = moment(startOfTwoBeforeMonth).daysInMonth();
    try {
      let aql = `
        LET summaryMetrics = (
          FOR t IN lyon_stat_reports
            FILTER t.rptDate >= ${startOfCurrentMonth} && t.rptDate <= ${endOfCurrentMonth}
            RETURN t
          )
        LET  lastMonthStat = (
          FOR l IN lyon_stat_reports
            FILTER l.rptDate >= ${startOfBeforeMonth} && l.rptDate <= ${endOfBeforeMonth}
            RETURN l
          )
        LET  twoLastMonthStat = (
          FOR l IN lyon_stat_reports
            FILTER l.rptDate >= ${startOfTwoBeforeMonth} && l.rptDate <= ${endOfTwoBeforeMonth}
            RETURN l
          )
        RETURN { summaryMetrics, lastMonthStat,twoLastMonthStat, dayInCurrentMonth : ${dayInCurrentMonth}, dayInBeforeMonth: ${dayInBeforeMonth}, dayInTwoBeforeMonth: ${dayInTwoBeforeMonth} }
      `
      const cursor = await db.query(aql)
      let result = await cursor.all()
      return res.status(200).send(result);
    } catch(err) {
      res.status(500).send(err)
    }
});
  
//Gets summary row for lyon stats
router.get('/chart_metrics', async (req, res, next) => {
    console.log('Chart Metrics')
    const { company } = req.query;
    const { startDate } = req.query;
    const { endDate } = req.query;
    let summary = await lyonsFunctions.getChartMetrics(company, startDate, endDate);
    if (summary) {
      res.status(200).send({ revenuePerDay: summary.revenuePerDay, datesOfRevenue: summary.datesOfRevenue, searchesPerDay: summary.searchesPerDay })
    }
});

//GET All Lyons Stats
//Route: /stats/admin/lyons/all
//Params:
//startDate (required): MM-YYYY-DD
//endDate (required): MM-YYYY-DD
//companyCredentials (required):
// router.get('/all', async (req, res, next) => {
//     console.log(req.query)
//     const { company, startDate, endDate } = req.query;
//     try {
//       let stats = await lyonsFunctions.getStats(company, startDate, endDate);
//       res.status(200).send({ stats: stats })
//     } catch(err) {
//       res.status(500).send(err)
//     }
    
// });

//Updates All Lyon Stats
//Route: /stats/admin/update/lyon/all
//Params:
//startDate (required): MM-YYYY-DD
//endDate (required): MM-YYYY-DD
//companyCredentials (required):
router.put('/', async (req, res, next) => {
    //console.log(req.params);
    console.log('/stats/admin/lyon/ UPDATING...')
    let stats = await lyonsFunctions.getRawLyonStats();
    console.log('Got Lyon Stats!')
    let completedDocs = await lyonsFunctions.updateDocuments('lyon', stats);
    console.log('Completed UPSERT!')
    res.status(200).send({ stats: completedDocs });
});

router.get('/test-all', async (req, res, next) => {
  try {
    let aql = `FOR doc IN lyon_stat_reports RETURN doc`
    const cursor = await db.query(aql)
    let result = await cursor.all()
    return res.status(200).send(result);
  } catch(err) {
    res.status(500).send(err)
  }
  
});

router.post('/one-month-by-one-month', async (req, res, next) => {
  const { start_date, end_date } = req.body
  let cron_start_date = moment(start_date).utc().format("YYYY-MM-DD");
  let cron_end_date = moment(end_date).utc().format("YYYY-MM-DD");
  var config = {
    method: 'get',
    url: `http://rt.api.imageadvantage.net/PublisherAPIReports/?StartDate=${cron_start_date}&EndDate=${cron_end_date}&Key=8rand(KK&ReportType=3`,
    headers: { }
  };
  axios(config)
    .then(function (response) {
      var respond_data = response.data.split(/\r?\n/);
      for (var i=1; i < respond_data.length -1; i++ ) {
          var subdata = respond_data[i].split(',');
          var rptDate = moment(subdata[0], "YYYY-MM-DD").utc().startOf('day').toDate().getTime();
          var ma = subdata[1]
          var subid = subdata[2];
          var market = subdata[3];
          var userCountry = subdata[4];
          var currencyCode = subdata[5];
          var searches = subdata[6];
          var biddedSearches = subdata[7];
          var clicks = subdata[8];
          var biddedCTR = subdata[9];
          var ctr = subdata[10];
          var split_num = 0;
          var revenue = subdata[11];
          try {
              var aql = `INSERT { rptDate: ${rptDate}, ma: "${ma}", subid: "${subid}", market: "${market}", userCountry: "${userCountry}", currencyCode: "${currencyCode}", searches:${searches}, biddedSearches:${biddedSearches}, clicks: ${clicks}, biddedCTR: "${biddedCTR}", split: ${split_num}, ctr: "${ctr}",  revenue: "${revenue}" } INTO lyon_stat_reports RETURN NEW`;
              db.query(aql);
          
          } catch(err) {
            return res.status(500).send('Error adding Lyon Stat: ' + err)
          }
          
      }
      return res.status(200).send("ok");
    })
    .catch(function (error) {
      return res.status(500).send('Error adding Lyon Stat: ' + error)
    });
  
});

router.delete('/all-delete', async (req, res, next) => {
  try {
    let aql = `FOR doc IN lyon_stat_reports REMOVE doc IN lyon_stat_reports`
    const cursor = await db.query(aql)
    let result = await cursor.all()
    return res.status(200).send(result);
  } catch(err) {
    res.status(500).send(err)
  }
  
});

router.get("/all", async (req, res, next) => {
  let { startDate, endDate } = req.query;
  startDate = moment(startDate, "MM-DD-YYYY").utc().startOf('day').toDate().getTime();
  endDate = moment(endDate, "MM-DD-YYYY").utc().endOf('day').toDate().getTime();
  let aql = `FOR t IN lyon_stat_reports FILTER t.rptDate >= ${startDate} && t.rptDate <= ${endDate} SORT t.rptDate DESC RETURN t`
  
  const cursor = await db.query(aql)
  let result = await cursor.all()
  return res.status(200).send(result)
});

router.get("/all-stat", async (req, res, next) => {
  //Gets the starting day of the month UTC MS Timestamp
  let startOfCurrentMonth = moment().utc().subtract(30, 'days').startOf('day').toDate().getTime();
  //Gets the end of month day of the month UTC MS Timestamp
  let endOfCurrentMonth = moment().utc().endOf('day').toDate().getTime();
  let startOfBeforeMonth = moment().utc().subtract(60, 'days').startOf('day').toDate().getTime();
  let endOfBeforeMonth = moment().utc().subtract(30, 'days').endOf('day').toDate().getTime();

  let aql = `LET currentStat = (FOR r IN lyon_stat_reports FILTER r.rptDate >= ${startOfCurrentMonth} && r.rptDate <= ${endOfCurrentMonth} COLLECT rptDate = r.rptDate AGGREGATE revenue = SUM(TO_NUMBER(r.revenue)) RETURN {rptDate, revenue }) LET beforeStat = (FOR r IN lyon_stat_reports FILTER r.rptDate >= ${startOfBeforeMonth} && r.rptDate <= ${endOfBeforeMonth} COLLECT rptDate = r.rptDate AGGREGATE revenue = SUM(TO_NUMBER(r.revenue)) RETURN {rptDate, revenue }) RETURN {currentStat, beforeStat}`
  
  const cursor = await db.query(aql)
  let result = await cursor.all()
  return res.status(200).send(result)
});

module.exports = router;