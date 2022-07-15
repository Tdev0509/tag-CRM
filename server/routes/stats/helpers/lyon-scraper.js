const moment = require('moment');
const request = require('request');
const { db } = require('../../../services/arango')
const aql = require('arangojs').aql;
const helperFunctions = require('./date-formatter')


var updateAllLyonStats = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let updatedLyonStats = await getLyonStats();
            console.log('starting UpdateDocument()...')
            await updateDocuments('Lyon', updatedLyonStats);
            console.log('finished UpdateDocument()...')
            resolve(true)
        } catch (err) {
            reject(err);
        }
    })

    // console.log('updated documents');
    // await updateSplits('lyon', 'tags');
    // console.log('finished updating splits')
    // let tags = await getAllTags('lyon', 'tags');
    // console.log(tags);
    // console.log(answers.length);
}

//BEGIN SCRAPING LOGIC
function getRawLyonStats() {
    return new Promise((resolve, reject) => {
        try {
            //SETUP REPORT DATE RANGES
            var start = moment.duration(-5, 'days');
            var end = moment.duration(-2, 'days');
            // var startDate = moment().add(minus).format('YYYY-MM-DD'); //7 DAYS BACK
            // var endDate = moment().add(minusOne).format('YYYY-MM-DD'); //YESTERDAY
            var startDate = moment().add(start).utc().startOf('day').format('x'); //7 DAYS BACK
            var endDate = moment().add(end).utc().endOf('day').format('x'); //YESTERDAY

            console.log('Start Date: ' + startDate + ' End Date: ' + endDate)

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
            //MAKE THE LOGIN POST WITH CORRECT HEADERS
            request({
                uri: 'https://services.hub.codefuel.com/login',
                method: "POST",
                form: {
                    email: '',
                    password: ''
                },
                jar: jar,
                timeout: 60000,
                headers: login_headers,
                followRedirect: true
            }, function (error, response, body) {

                //THIS BODY WILL SHOW A REDIRECTING MESSAGE IF SUCCESS, OTHERWISE WILL SPIT OUT LOGIN FORM HTML
                console.log('Inside UI, getting data: ' + body);

                //CONSTRUCT DASHBOARD REPORT URL TO GRAB JSON DATA THAT IS HIDDEN IN THEIR HTML
                // let date_json = {"start":start_date,"end":end_date}
                // let formatted_date = encodeURIComponent(JSON.stringify(date_json));


                //All Channel URL
                let report_url = `https://services.hub.codefuel.com/analytics/reports?channelQueryType=all_channels&columnQueryData=%7B%22ids%22:%5B%22date%22,%22channel%22,%22country%22,%22revenue%22,%22searches%22,%22searches_monetized%22,%22ad_impressions%22,%22ad_clicks%22,%22publisher_cpc%22,%22monetized_ctr%22,%22coverage%22%5D%7D&columnQueryType=specific_columns&endDate=${endDate}&geoQueryType=all&limit=100000000&productQueryType=all_product&startDate=${startDate}&walletQueryType=all_wallets`;
                console.log(report_url)
                //Chanel URL
                // let report_url = `https://services.hub.codefuel.com/analytics/reports?channelQueryData={"ids":["1001", "1011"]}&channelQueryType=specific_channels&columnQueryData={"ids":["date","channel","country","device","revenue","searches","searches_monetized","ad_clicks","monetized_ctr"]}&columnQueryType=specific_columns&endDate=${endDate}&geoQueryType=all&limit=100000&productQueryType=all_product&startDate=${startDate}&walletQueryType=all_wallets`;

                //console.log(report_url);

                //REQUEST DASHBOARD PAGE DATA
                var report_headers = {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36',
                    'Origin': 'https://admin.hub.codefuel.com',
                    'Referer': 'https://admin.hub.codefuel.com/',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'upgrade-insecure-requests': 1
                }
                request({
                    uri: report_url,
                    method: "GET",
                    jar: jar,
                    timeout: 20000,
                    followRedirect: true,
                    maxRedirects: 10,
                    headers: report_headers
                }, async function (error, response, html) {
                    /**
                     * * Converting API stats response to JSON Object
                     */

                    let rawLyonStats = await convertStringToJsonObject(response.body);
                    let finalLyonStats = [];
                    rawLyonStats.rows.forEach((row) => {

                        let stat = {};
                        if (row.wallet) {
                            stats = {
                                date: row.date,
                                country: '',
                                subid: 'bonus',
                                impressions: 0,
                                monetized_impressions: 0,
                                clicks: 0,
                                revenue: (parseFloat(row.revenue) || 0.00),
                                bing_searches_initial: 0,
                                bing_searches_followon: 0,
                                bing_monetized_searches_initial: 0,
                                bing_monetized_searches_followon: 0,
                                split: 0
                            }
                            //{"date":1635638400001,"wallet":"W-000850018","channel":"","install_date":"N/A","searches":"","revenue":5104,"searches_monetized":"","view":"mat"},
                        } else {
                            stat = {
                                date: row.date,
                                country: row.country.toString(),
                                subid: row.channel,
                                impressions: (parseInt(row.searches) || 0),
                                monetized_impressions: (parseInt(row.searches_monetized) || 0),
                                clicks: (parseInt(row.ad_clicks) || 0),
                                revenue: (parseFloat(row.revenue) || 0.00),
                                bing_searches_initial: (parseFloat(row.bing_searches_initial) || 0.00),
                                bing_searches_followon: (parseFloat(row.bing_searches_followon) || 0.00),
                                bing_monetized_searches_initial: (parseFloat(row.bing_monetized_searches_initial) || 0.00),
                                bing_monetized_searches_followon: (parseFloat(row.bing_monetized_searches_followon) || 0.00),
                                split: 0
                            }
                        }
                        finalLyonStats.push(stat);
                    });

                    resolve(finalLyonStats);
                    return;


                    //EXIT SCRIPT IN ABOUT 20 SECONDS. YOU MONGODB STUFF SHOULD BE DONE BY THEN
                    setTimeout(function () {
                        process.exit();
                    }, 20000);

                }).on('error', function (e) {
                    console.log('trouble logging in to Lyon dashboard page ' + e);
                    process.exit();
                });

            }).on('error', function (e) {
                console.log('Trouble logging in to Lyon reporting ' + e);
                process.exit();
            });

        } catch (err) {
            reject(error)
            console.log('Script run error: ' + err);
            process.exit();
        }
    });
}

/**
 * *Converts String to JSON Object
 *  @param {*} data 
 */
function convertStringToJsonObject(data) {
    return JSON.parse(data);
}

function checkIfLyonStatsAreUpdated(lyonLastUpdatedTime) {

}

async function updateDocuments(collectionName, data) {
    console.log('Updating ' + data.length + ' documents')
    // console.log(data)
    // let collection = db.collection('manic');
    return new Promise((resolve, reject) => {
        try {
            db.query(aql`   
                FOR doc in ${data}

                    UPSERT { date: doc.date, country: doc.country, subid: doc.subid }
                    
                    INSERT doc
                    
                    UPDATE doc IN lyon_stat_reports
                
                RETURN

            `)
                .then(cursor => {
                    console.log('Cursor....')
                    return cursor.map(t => {
                        console.log(t)
                        return t;
                    })
                })
                .then(keys => {
                    console.log('keys')
                    console.log(keys)
                    resolve(keys);
                })
                .catch(err => {
                    console.log('Inner catch error...')
                    console.log(err);
                    reject(err);
                })
        } catch (err) {
            console.log('Hit the CATCH of lots of docs...')
            console.log(err)
            reject(err);
        }
    })
}

function updateSplits(stats, tags) {
    console.log('updating splits')
    let statCollection = db.collection(stats);
    let tagCollection = db.collection(tags);
    return new Promise((resolve, reject) => {
        db.query(aql`   
            FOR tag in ${tagCollection}
            FOR stat in ${statCollection}
                let sid = REGEX_SPLIT(tag.subid, "-")
                FILTER TO_NUMBER(stat.subid) >= TO_NUMBER(sid[0]) && TO_NUMBER(stat.subid) <= TO_NUMBER(sid[1]) && tag.advertiser == "Manic Traffic"
                UPDATE stat WITH {"split": tag.split} IN ${statCollection}
        `)
            .then(cursor => cursor.map(doc => {
                return doc;
            }))
            .then(keys => {
                resolve(keys);
            })
            .catch(err => {
                reject(err);
            })
    })
}

function addSplitsToAllStats() {

}
//Gets Lyons Stats
async function getStats(company, startDate, endDate) {
    company = "lyon"
    startDate = moment(startDate, "MM-DD-YYYY").utc().startOf('day').toDate().getTime();
    endDate = moment(endDate, "MM-DD-YYYY").utc().endOf('day').toDate().getTime();

    return new Promise((resolve, reject) => {
        try {
            db.query(aql`   
            FOR doc in lyon_stat_reports
                FILTER doc.rptDate >= ${startDate} && doc.rptDate <= ${endDate}
                COLLECT date = doc.rptDate, subid = doc.subid
                AGGREGATE revenue = SUM(TO_NUMBER(doc.revenue)), searches = SUM(TO_NUMBER(doc.searches)), biddedSearches = SUM(TO_NUMBER(doc.biddedSearches)), clicks = SUM(TO_NUMBER(doc.clicks)), ctr = SUM(TO_NUMBER(doc.ctr)), biddedCtr = SUM(TO_NUMBER(doc.biddedCTR)), split = AVERAGE(TO_NUMBER(doc.split))
                SORT date DESC, TO_NUMBER(subid)
                RETURN { date, subid, clicks,  ctr, revenue, split, searches, biddedCtr, biddedSearches }
            `)
                .then(cursor => {
                    return cursor.map(t => {
                        return t;
                    })
                })
                .then(keys => {
                    console.log('keys')
                    resolve(keys);
                })
                .catch(err => {
                    console.log('Inner catch error...')
                    console.log(err);
                    reject(err);
                })
        } catch (err) {
            console.log(err)
        }
    })
}

/**
 * *getSummaryMetrics(company) {
 * @param {*} company 
 * @returns 
 */
 async function getSummaryMetrics(company) {
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

    // console.log("--------------------", dayInCurrentMonth, dayInBeforeMonth, dayInTwoBeforeMonth);

    return new Promise((resolve, reject) => {
        try {
            db.query(aql`

                    LET summaryMetrics = (
                        FOR t IN lyon_stat_reports
                            FILTER t.rptDate >= ${startOfCurrentMonth} && t.rptDate <= ${endOfCurrentMonth}
                            COLLECT AGGREGATE revenue = SUM(TO_NUMBER(t.revenue)), profit = SUM(TO_NUMBER(t.revenue) * ((100 - t.split) * 0.01)), reportedDays = COUNT_DISTINCT(t.rptDate)
                            RETURN {revenue, profit, revenuePace: (TO_NUMBER(revenue)/reportedDays) * ${dayInCurrentMonth}, profitPace: (profit/reportedDays) * ${dayInCurrentMonth}}
                        )
                    LET  lastMonthStat = (
                        FOR t IN lyon_stat_reports
                            FILTER t.rptDate >= ${startOfBeforeMonth} && t.rptDate <= ${endOfBeforeMonth}
                            COLLECT AGGREGATE revenue = SUM(TO_NUMBER(t.revenue)), profit = SUM(TO_NUMBER(t.revenue) * ((100 - t.split) * 0.01)), reportedDays = COUNT_DISTINCT(t.rptDate)
                            RETURN {revenue, profit, revenuePace: (TO_NUMBER(revenue)/reportedDays) * ${dayInBeforeMonth}, profitPace: (profit/reportedDays) * ${dayInBeforeMonth}}
                        )
                    LET  lastMonthStat = (
                        FOR t IN lyon_stat_reports
                            FILTER t.rptDate >= ${startOfTwoBeforeMonth} && t.rptDate <= ${endOfTwoBeforeMonth}
                            COLLECT AGGREGATE revenue = SUM(TO_NUMBER(t.revenue)), profit = SUM(TO_NUMBER(t.revenue) * ((100 - t.split) * 0.01)), reportedDays = COUNT_DISTINCT(t.rptDate)
                            RETURN {revenue, profit, revenuePace: (TO_NUMBER(revenue)/reportedDays) * ${dayInTwoBeforeMonth}, profitPace: (profit/reportedDays) * ${dayInTwoBeforeMonth}}
                        )
                    RETURN { summaryMetrics, lastMonthStat, twoLastMonthStat }
                `)
                .then(cursor => {
                    return cursor.map(t => {
                        //console.log(moment(t).utc().format("MM/DD/YYYY"))
                        return t;
                    })
                })
                .then(keys => {
                    // console.log('keys')
                    // console.log(keys)
                    // resolve({ dayInCurrentMonth: dayInCurrentMonth, keys });
                    resolve(keys);
                })
                .catch(err => {
                    console.log('Inner catch error...')
                    console.log(err);
                    reject(err);
                })
        } catch (err) {
            console.log(err)
        }
    })
}

function getChartMetrics(company, startDate, endDate) {
    var startDate = helperFunctions.getStartOfDayUTCTimestampDateObject(startDate);

    var endDate = helperFunctions.getEndOfDayUTCTimestampDateObject(endDate);
    return new Promise((resolve, reject) => {
        try {
            db.query(aql`
                    LET revenuePerDay = ( // subquery start
                        FOR r IN lyon_stat_reports
                            FILTER r.rptDate >= ${startDate} && r.rptDate <= ${endDate}
                            COLLECT date = r.rptDate
                            AGGREGATE revenuePerDay = SUM(TO_NUMBER(r.revenue))
                            RETURN revenuePerDay
                        )

                    LET datesOfRevenue = ( // subquery start
                        FOR r IN lyon_stat_reports
                            FILTER r.rptDate >= ${startDate} && r.rptDate <= ${endDate}
                            COLLECT date = r.rptDate
                            RETURN date
                        )

                    LET searchesPerDay = ( // subquery start
                        FOR r IN lyon_stat_reports
                            FILTER r.rptDate >= ${startDate} && r.rptDate <= ${endDate}
                            COLLECT date = r.rptDate
                            AGGREGATE searchesPerDay = SUM(TO_NUMBER(r.searches))
                            RETURN searchesPerDay
                        )

                    RETURN { revenuePerDay, datesOfRevenue, searchesPerDay }
                `)
                .then(cursor => {
                    return cursor.map(t => {
                        return t;
                    })
                })
                .then(keys => {
                    resolve(keys[0]);
                })
                .catch(err => {
                    console.log('Inner catch error...')
                    console.log(err);
                    reject(err);
                })
        } catch (err) {
            console.log(err)
        }
    })
}



module.exports = {
    updateAllLyonStats,
    getRawLyonStats,
    updateDocuments,
    getSummaryMetrics,
    getChartMetrics,
    getStats
};