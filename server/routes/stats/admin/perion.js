var express = require('express');
var router = express.Router();
const { auth } = require('../../../middlewares/auth');
const perionFunctions = require('../helpers/perion-scraper')
var moment = require('moment');
const { db, Companies } = require('../../../services/arango');
const request = require('request');
const aql = require('arangojs').aql;

router.use(auth);


//Gets summary row for perion stats
router.get('/summary_metrics', async (req, res, next) => {
  console.log('Summary Metrics Route')
  console.log(req.query)
  const { company } = req.query;
  let summary = await perionFunctions.getSummaryMetrics(company);
  if (summary) {
    res.status(200).send({ summary });
  }
});


//Gets summary row for perion stats
router.get('/chart_metrics', async (req, res, next) => {
  console.log('Chart Metrics')
  const { company } = req.query;
  const { startDate } = req.query;
  const { endDate } = req.query;
  let chartSummary = await perionFunctions.getChartMetrics(company, startDate, endDate);
  if (chartSummary) {
    res.status(200).send({ revenuePerDay: chartSummary.revenuePerDay, datesOfRevenue: chartSummary.datesOfRevenue, searchesPerDay: chartSummary.searchesPerDay })
  }
});

//Gets chart for perion stats
router.get('/chart_perion_stat', async (req, res, next) => {
    console.log('Chart Perion Metrics')
    const { company } = req.query;
    let chartSummary = await perionFunctions.getChartStat(company);
    if (chartSummary) {
      res.status(200).send({ revenuePerDay: chartSummary.revenuePerDay, datesOfRevenue: chartSummary.datesOfRevenue, revenueBeforePerDay: chartSummary.revenueBeforePerDay })
    }
  });


//Updates All Perion Stats
//Route: /stats/admin/update/perion/all
//Params:
//startDate (required): MM-YYYY-DD
//endDate (required): MM-YYYY-DD
//companyCredentials (required):
router.put('/', async (req, res, next) => {
  const { company, startDate, endDate } = req.body;
  console.log('/stats/admin/perion/ UPDATING...')
  let stats = await perionFunctions.getRawPerionStats(company);
  console.log('Got Perion Stats!')
  perionFunctions.updateDocuments(company, stats);
  console.log('Completed UPSERT!')
  //Perion Split Change
  perionFunctions.updateSplits(company);
  res.status(200).send({ stats: 'ok' });
});

//Takes in COMPANY

//Take in Authentication

//GET All Perion Stats
//Route: /stats/admin/update/perion/all
//Params:
//startDate (required): MM-YYYY-DD
//endDate (required): MM-YYYY-DD
//companyCredentials (required):
router.get('/', async (req, res, next) => {
  //console.log(req.query)
  const { company, startDate, endDate } = req.query;
  let stats = await perionFunctions.getStats(company, startDate, endDate);
  if (stats) {
    res.status(200).send({ stats: stats })
  }
});

//perion stat about every tag
router.get('/per-tag-stat', async (req, res, next) => {
  //console.log(req.query)
  const { company, startDate, endDate } = req.query;
  let stats = await perionFunctions.getPerTagStats(company, startDate, endDate);
  if (stats) {
    res.status(200).send(stats)
  }
});


//Test Perion Data Add
router.post('/test-perion', async (req, res, next) => {
  const { start_date, end_date } = req.body
  console.log('Test Perion Data Add');
    var startDate = moment(start_date).utc().startOf('day').toDate().getTime();
    var endDate = moment(end_date).utc().endOf('day').toDate().getTime();

    //GET Perion Data From Company
    let companyAql = `FOR company in companies FOR provider IN company.reportingProviders FILTER provider.reportingProvider == "perion" RETURN company`
    try {
        const companyCursor = await db.query(companyAql)
        let companyInformation = await companyCursor.all()
        for (var companyStat of companyInformation) {
          var companyName = companyStat.name;
          for (var companyReportingProvider of companyStat.reportingProviders) {
              
              if(companyReportingProvider.reportingProvider == "perion") {
                  var perionEmail = companyReportingProvider.email;
                  var perionPassword = companyReportingProvider.password;
                  var perionApiUrl = companyReportingProvider.apiUrl;
                  var perionApiKey = companyReportingProvider.apiKey;
                  if(perionEmail && perionPassword) {
                      //SETUP LOGIN HEADERS
                      var jar = request.jar();

                      var login_headers = {
                          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                          'Origin': 'https://services.hub.codefuel.com/login',
                          'Referer': 'https://services.hub.codefuel.com/login',
                          'Accept': 'ttext/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'upgrade-insecure-requests': 1
                      }

                      let loginStatus = await loginSession(perionEmail, perionPassword, jar, login_headers)
                      console.log("Inside UI, getting data: ", loginStatus)
                      if(loginStatus) {
                          //All Channel URL
                          let report_url = `https://services.hub.codefuel.com/analytics/reports?channelQueryType=all_channels&columnQueryData=%7B%22ids%22:%5B%22date%22,%22channel%22,%22country%22,%22revenue%22,%22searches%22,%22searches_monetized%22,%22ad_impressions%22,%22ad_clicks%22,%22publisher_cpc%22,%22monetized_ctr%22,%22coverage%22%5D%7D&columnQueryType=specific_columns&endDate=${endDate}&geoQueryType=all&limit=100000000&productQueryType=all_product&startDate=${startDate}&walletQueryType=all_wallets`;
                          console.log(report_url)

                          //REQUEST DASHBOARD PAGE DATA
                          var report_headers = {
                              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36',
                              'Origin': 'https://admin.hub.codefuel.com',
                              'Referer': 'https://admin.hub.codefuel.com/',
                              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                              'upgrade-insecure-requests': 1
                          }

                          let dashPageData = await getDashboardPageData(jar, report_url, report_headers);
                          let rawPerionStats = await convertStringToJsonObject(dashPageData);
                          rawPerionStats.rows.forEach((row) => {
                              if (row.wallet) {
                                  var company_id = `companies/${companyStat._key}`;
                                  var date = row.date;
                                  var country = "";
                                  var subid = "bonus";
                                  var impressions = 0;
                                  var monetized_impressions= 0;
                                  var clicks= 0;
                                  var revenue= (parseFloat(row.revenue) || 0.00);
                                  var bing_searches_initial= 0;
                                  var bing_searches_followon= 0;
                                  var bing_monetized_searches_initial= 0;
                                  var bing_monetized_searches_followon= 0;
                                  var split= 0;

                              } else {
                                  var company_id = `companies/${companyStat._key}`;
                                  var date = row.date;
                                  var country = row.country.toString();
                                  var subid = row.channel;
                                  var impressions = (parseInt(row.searches) || 0);
                                  var monetized_impressions= (parseInt(row.searches_monetized) || 0);
                                  var clicks= (parseInt(row.ad_clicks) || 0);
                                  var revenue= (parseFloat(row.revenue) || 0.00);
                                  var bing_searches_initial= (parseFloat(row.bing_searches_initial) || 0.00);
                                  var bing_searches_followon= (parseFloat(row.bing_searches_followon) || 0.00);
                                  var bing_monetized_searches_initial= (parseFloat(row.bing_monetized_searches_initial) || 0.00);
                                  var bing_monetized_searches_followon= (parseFloat(row.bing_monetized_searches_followon) || 0.00);
                                  var split= 70;
                              }
                              let nameChange = companyName.trim().split(" ");
                              let perionCollectionName = (`${nameChange.join("_")}_perion_stat_reports`).toString()
                              try {
                                  db.query(`INSERT {"company_id": "${company_id}","date":${date},"country":"${country}","subid":"${subid}","impressions":${impressions},"monetized_impressions":${monetized_impressions},"clicks":${clicks},"revenue":${revenue},"bing_searches_initial":${bing_searches_initial},"bing_searches_followon":${bing_searches_followon},"bing_monetized_searches_initial":${bing_monetized_searches_initial},"bing_monetized_searches_followon":${bing_monetized_searches_followon},"split":${split}} INTO ${perionCollectionName}`);
                              } catch (error) {
                                  console.log(error)
                              }
                              
                          });
                      }
                      
                  }
              }
              
          }
          console.log("====end!======")
      }
    } catch (error) {
        console.log('Error: ' + error);
    }
  
});

function convertStringToJsonObject(data) {
  return JSON.parse(data);
}

//login Session part
function loginSession(perionEmail, perionPassword, jar, login_headers) {
  return new Promise(function (resolve, reject) {
      request({
          uri: 'https://services.hub.codefuel.com/login',
          method: "POST",
          form: {
              email: perionEmail,
              password: perionPassword
          },
          jar: jar,
          timeout: 60000,
          headers: login_headers,
          followRedirect: true
      }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              //THIS BODY WILL SHOW A REDIRECTING MESSAGE IF SUCCESS, OTHERWISE WILL SPIT OUT LOGIN FORM HTML
              resolve(body);
          } else {
              reject(error);
          }
          
      })
  })
}

//get data from api
function getDashboardPageData(jar, report_url, report_headers) {
  return new Promise(function (resolve, reject) {
      request({
          uri: report_url,
          method: "GET",
          jar: jar,
          timeout: 20000,
          followRedirect: true,
          maxRedirects: 10,
          headers: report_headers
      }, function (error, response, html) {
          if (!error && response.statusCode == 200) {
              resolve(response.body);
          } else {
              reject(error);
          }
          
      })
  }) 
}

router.get("/all-stat", async (req, res, next) => {
  const { company } = req.query;
  //Gets the starting day of the month UTC MS Timestamp
  let startOfCurrentMonth = moment().utc().subtract(30, 'days').startOf('day').toDate().getTime();
  //Gets the end of month day of the month UTC MS Timestamp
  let endOfCurrentMonth = moment().utc().endOf('day').toDate().getTime();
  let startOfBeforeMonth = moment().utc().subtract(60, 'days').startOf('day').toDate().getTime();
  let endOfBeforeMonth = moment().utc().subtract(30, 'days').endOf('day').toDate().getTime();
  let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
  if(companyInfo) {
    var company_name = companyInfo.name.trim().split(" ");
    var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`)

    let aql = `LET currentStat = (FOR r IN ${perionCollectionName} FILTER r.date >= ${startOfCurrentMonth} && r.date <= ${endOfCurrentMonth} COLLECT date = r.date AGGREGATE revenue = SUM(TO_NUMBER(r.revenue)) RETURN {date, revenue }) LET beforeStat = (FOR r IN ${perionCollectionName} FILTER r.date >= ${startOfBeforeMonth} && r.date <= ${endOfBeforeMonth} COLLECT date = r.date AGGREGATE revenue = SUM(TO_NUMBER(r.revenue)) RETURN {date, revenue }) RETURN {currentStat, beforeStat}`
    
    const cursor = await db.query(aql)
    let result = await cursor.all()
  return res.status(200).send(result)
  }
  
});

module.exports = router;