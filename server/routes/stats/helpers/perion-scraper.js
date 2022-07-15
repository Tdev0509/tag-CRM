const moment = require('moment');
const request = require('request');
const { db, Companies } = require('../../../services/arango')
const aql = require('arangojs').aql;
const helperFunctions = require('./date-formatter');

// await run();

// startProgram();

var updateAllPerionStats = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let updatedPerionStats = await getPerionStats();
            console.log('starting UpdateDocument()...')
            await updateDocuments('perion', updatedPerionStats);
            console.log('finished UpdateDocument()...')
            resolve(true)
        } catch (err) {
            reject(err);
        }
    })

    // console.log('updated documents');
    // await updateSplits('manic_perion', 'tags');
    // console.log('finished updating splits')
    // let tags = await getAllTags('manic_perion', 'tags');
    // console.log(tags);
    // console.log(answers.length);
}

//BEGIN SCRAPING LOGIC
function getRawPerionStats(company) {
    return new Promise(async (resolve, reject) => {
        try {
            //SETUP REPORT DATE RANGES
            var start = moment.duration(-5, 'days');
            var end = moment.duration(-2, 'days');
            
            // var startDate = moment().add(minus).format('YYYY-MM-DD'); //7 DAYS BACK
            // var endDate = moment().add(minusOne).format('YYYY-MM-DD'); //YESTERDAY
            var startDate = moment().add(start).utc().startOf('day').format('x'); //7 DAYS BACK
            var endDate = moment().add(end).utc().endOf('day').format('x'); //YESTERDAY

            // console.log('Start Date: ' + startDate + ' End Date: ' + endDate)
            let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
            if (companyInfo) {
                let finalPerionStats = [];
                for (var companyReportingProvider of companyInfo.reportingProviders) {
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
                                    let stat = {};
                                    if (row.wallet) {
                                        stats = {
                                            company_id: `companies/${companyInfo._key}`,
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
                                            company_id: `companies/${companyInfo._key}`,
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
                                    finalPerionStats.push(stat);
                                });
                                resolve(finalPerionStats);
                                return;
                            } else {
                                resolve(finalPerionStats);
                                return;
                            }
                            
                        }
                    } else {
                        resolve(finalPerionStats);
                        return;
                    }
                }
            }
        } catch (err) {
            reject(err)
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

function checkIfPerionStatsAreUpdated(perionLastUpdatedTime) {

}

async function updateDocuments(company, data) {
    console.log('Updating ' + data.length + ' documents')  
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var companyid = companyInfo._id;
        var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`)
        var allData = [];
        for (var reportingProvider of companyInfo.reportingProviders) {
            if(reportingProvider.reportingProvider == "perion") {
                try {
                    for(var subData of data) {
                        var company_id = subData['company_id'];
                        var date = subData['date'];
                        var country = subData['country'];
                        var subid = subData['subid'];
                        var impressions = subData['impressions'];
                        var monetized_impressions= subData['monetized_impressions'];
                        var clicks= subData['clicks'];
                        var revenue= subData['revenue'];
                        var bing_searches_initial= subData['bing_searches_initial'];
                        var bing_searches_followon= subData['bing_searches_followon'];
                        var bing_monetized_searches_initial= subData['bing_monetized_searches_initial'];
                        var bing_monetized_searches_followon= subData['bing_monetized_searches_followon'];
                        var split= 70;

                        const cursor = await db.query(`UPSERT { date: ${subData.date}, country: "${subData.country}", subid: "${subData.subid}" } INSERT {"company_id": "${company_id}","date":${date},"country":"${country}","subid":"${subid}","impressions":${impressions},"monetized_impressions":${monetized_impressions},"clicks":${clicks},"revenue":${revenue},"bing_searches_initial":${bing_searches_initial},"bing_searches_followon":${bing_searches_followon},"bing_monetized_searches_initial":${bing_monetized_searches_initial},"bing_monetized_searches_followon":${bing_monetized_searches_followon},"split":${split}} UPDATE {"company_id": "${company_id}","date":${date},"country":"${country}","subid":"${subid}","impressions":${impressions},"monetized_impressions":${monetized_impressions},"clicks":${clicks},"revenue":${revenue},"bing_searches_initial":${bing_searches_initial},"bing_searches_followon":${bing_searches_followon},"bing_monetized_searches_initial":${bing_monetized_searches_initial},"bing_monetized_searches_followon":${bing_monetized_searches_followon},"split":${split}} IN ${perionCollectionName} RETURN NEW`)
                        let result = await cursor.all();
                        allData.push(result[0])
                    }

                    return allData;
                    
                } catch (err) {
                    console.log('Hit the CATCH of lots of docs...')
                    console.log(err)
                    return  err;
                }
            } else {
                return allData;
            }
        }
    } else {
        return allData;
    }
    
}
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
async function updateSplits(company) {
    console.log('updating splits')
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    return new Promise((resolve, reject) => {
        if(companyInfo) {
            var company_name = companyInfo.name.trim().split(" ");
            var company_id = companyInfo._id;
            var perionStatCollectionName = (`${company_name.join("_")}_perion_stat_reports`)
            db.query(`FOR tag IN tags FILTER tag.advertiser == "perion" && tag.company == "${company_id}" FOR subid IN tag.subids FOR stat IN ${perionStatCollectionName} FILTER TO_NUMBER(stat.subid) == TO_NUMBER(subid.subid) UPDATE stat WITH {"split": subid.split} IN ${perionStatCollectionName}`)
                .then(cursor => cursor.map(doc => {
                    resolve(doc);
                }))
                .then(keys => {
                    resolve(keys);
                })
                .catch(err => {
                    reject(err);
                })
            }
        
    })
}

function addSplitsToAllStats() {

}
//get Perion Stats for every tag
async function getPerTagStats(company, startDate, endDate) {
    startDate = moment(startDate, "MM-DD-YYYY").utc().startOf('day').toDate().getTime();
    endDate = moment(endDate, "MM-DD-YYYY").utc().endOf('day').toDate().getTime();
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var companyid = companyInfo._id;
        var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`).toString()
        console.log("=============== get stat about every tag ===============", perionCollectionName)
        return new Promise((resolve, reject) => {
            try {
                db.query(`   
                    FOR doc in ${perionCollectionName}
                        FILTER doc.date >= ${startDate} && doc.date <= ${endDate} && doc.company_id == "${companyid}"
                        
                        RETURN doc
                `)
                    .then(cursor => {
                        return cursor.map(t => {
                            // console.log(t)
                            return t;
                        })
                    })
                    .then(keys => {
                        // console.log('keys')
                        // console.log(keys)
                        //console.log(keys)
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
    } else {
        return;
    }
}

//Gets Perion Stats
async function getStats(company, startDate, endDate) {
    startDate = moment(startDate, "MM-DD-YYYY").startOf('day').toDate().getTime();
    endDate = moment(endDate, "MM-DD-YYYY").endOf('day').toDate().getTime();
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var companyid = companyInfo._id;
        var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`).toString()
        console.log("===============get stat Metrics===============", perionCollectionName)
        for (var reportingProvider of companyInfo.reportingProviders) {
            if(reportingProvider.reportingProvider == "perion") {
                return new Promise((resolve, reject) => {
                    try {
                        db.query(`   
                            FOR doc in ${perionCollectionName}
                                FILTER doc.date >= ${startDate} && doc.date <= ${endDate} && doc.company_id == "${companyid}"
                                COLLECT date = doc.date, subid = doc.subid
                                AGGREGATE revenue = SUM(doc.revenue), impressions = SUM(doc.impressions), monetized_impressions = SUM(doc.monetized_impressions), clicks = SUM(doc.clicks), split = AVERAGE(TO_NUMBER(doc.split)), bing_searches_initial = SUM(doc.bing_searches_initial), bing_searches_followon = SUM(doc.bing_searches_followon)
                                SORT date DESC, TO_NUMBER(subid)
                                RETURN { date, subid, clicks, cpc: revenue/clicks, ctr: clicks/impressions, revenue, split, impressions, monetized_impressions, followon: bing_searches_followon/bing_searches_initial, publisherNet: revenue*split/100, profit: (100-split)*revenue/100 }
                        `)
                            .then(cursor => {
                                return cursor.map(t => {
                                    // console.log(t)
                                    return t;
                                })
                            })
                            .then(keys => {
                                // console.log('keys')
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
        }
        
        
    } else {
        return;
    }
    
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
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    // console.log("====================", dayInCurrentMonth, dayInBeforeMonth, dayInTwoBeforeMonth)
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var companyid = companyInfo._id;
        var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`)
        console.log("===============get Summary Metrics===============", perionCollectionName)
        for (var reportingProvider of companyInfo.reportingProviders) {
            if(reportingProvider.reportingProvider == "perion") {
                return new Promise((resolve, reject) => {
                    try {
                        db.query(`
                                LET summaryMetrics = (
                                    FOR t IN ${perionCollectionName}
                                        FILTER t.date >= ${startOfCurrentMonth} && t.date <= ${endOfCurrentMonth} && t.company_id == "${companyid}"
                                        COLLECT AGGREGATE revenue = SUM(t.revenue), profit = SUM(t.revenue * ((100 - t.split) * 0.01)), reportedDays = COUNT_DISTINCT(t.date)
                                        RETURN {revenue, profit, revenuePace: (revenue/reportedDays) * ${dayInCurrentMonth}, profitPace: (profit/reportedDays) * ${dayInCurrentMonth}}
                                    )
                                LET  lastMonthStat = (
                                    FOR t IN ${perionCollectionName}
                                        FILTER t.date >= ${startOfBeforeMonth} && t.date <= ${endOfBeforeMonth} && t.company_id == "${companyid}"
                                        
                                        COLLECT AGGREGATE revenue = SUM(t.revenue), profit = SUM(t.revenue * ((100 - t.split) * 0.01)), reportedDays = COUNT_DISTINCT(t.date)
                                        RETURN {revenue, profit, revenuePace: (revenue/reportedDays) * ${dayInBeforeMonth}, profitPace: (profit/reportedDays) * ${dayInBeforeMonth}}
                                    )
                                LET  twoLastMonthStat = (
                                    FOR t IN ${perionCollectionName}
                                        FILTER t.date >= ${startOfTwoBeforeMonth} && t.date <= ${endOfTwoBeforeMonth} && t.company_id == "${companyid}"
                                        
                                        COLLECT AGGREGATE revenue = SUM(t.revenue), profit = SUM(t.revenue * ((100 - t.split) * 0.01)), reportedDays = COUNT_DISTINCT(t.date)
                                        RETURN {revenue, profit, revenuePace: (revenue/reportedDays) * ${dayInTwoBeforeMonth}, profitPace: (profit/reportedDays) * ${dayInTwoBeforeMonth}}
                                    )
            
                                RETURN { summaryMetrics, lastMonthStat, twoLastMonthStat, dayInCurrentMonth : ${dayInCurrentMonth}, dayInBeforeMonth: ${dayInBeforeMonth}, dayInTwoBeforeMonth: ${dayInTwoBeforeMonth} }
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
            } else {
                return [];
            }
        }
        
    } else {
        return [];
    }
    
}

async function getChartMetrics(company, startDate, endDate) {
    var startDate = helperFunctions.getStartOfDayUTCTimestampDateObject(startDate);

    var endDate = helperFunctions.getEndOfDayUTCTimestampDateObject(endDate);
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var companyid = companyInfo._id;
        var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`)

        console.log("===============get Chart Metrics===============", perionCollectionName)
        for (var reportingProvider of companyInfo.reportingProviders) {
            if(reportingProvider.reportingProvider == "perion") {
                return new Promise((resolve, reject) => {
                    try {
                        db.query(`
                                LET revenuePerDay = ( // subquery start
                                    FOR r IN ${perionCollectionName}
                                        FILTER r.date >= ${startDate} && r.date <= ${endDate} && r.company_id == "${companyid}"
                                        COLLECT date = r.date
                                        AGGREGATE revenuePerDay = SUM(r.revenue)
                                        RETURN revenuePerDay
                                    )
            
                                LET datesOfRevenue = ( // subquery start
                                    FOR r IN ${perionCollectionName}
                                        FILTER r.date >= ${startDate} && r.date <= ${endDate} && r.company_id == "${companyid}"
                                        COLLECT date = r.date
                                        RETURN date
                                    )
            
                                LET searchesPerDay = ( // subquery start
                                    FOR r IN ${perionCollectionName}
                                        FILTER r.date >= ${startDate} && r.date <= ${endDate} && r.company_id == "${companyid}"
                                        COLLECT date = r.date
                                        AGGREGATE searchesPerDay = SUM(r.impressions)
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
        }
    }
    
}

async function getChartStat(company) {
    //Gets the starting day of the month UTC MS Timestamp
    let startOfCurrentMonth = moment().utc().startOf('month').toDate().getTime();
    //Gets the end of month day of the month UTC MS Timestamp
    let endOfCurrentMonth = moment().utc().endOf('month').toDate().getTime();
    let startOfBeforeMonth = moment().subtract(1, 'months').utc().startOf('month').toDate().getTime();
    let endOfBeforeMonth = moment().subtract(1, 'months').utc().endOf('month').toDate().getTime();

    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var companyid = companyInfo._id;
        var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`)

        console.log("===============get Chart Perion Metrics===============", perionCollectionName)
        for (var reportingProvider of companyInfo.reportingProviders) {
            if(reportingProvider.reportingProvider == "perion") {
                return new Promise((resolve, reject) => {
                    try {
                        db.query(`
                                LET revenuePerDay = ( // subquery start
                                    FOR r IN ${perionCollectionName}
                                        FILTER r.date >= ${startOfCurrentMonth} && r.date <= ${endOfCurrentMonth} && r.company_id == "${companyid}"
                                        COLLECT date = r.date
                                        AGGREGATE revenuePerDay = SUM(r.revenue)
                                        RETURN revenuePerDay
                                    )
            
                                LET datesOfRevenue = ( // subquery start
                                    FOR r IN ${perionCollectionName}
                                        FILTER r.date >= ${startOfCurrentMonth} && r.date <= ${endOfCurrentMonth} && r.company_id == "${companyid}"
                                        COLLECT date = r.date
                                        RETURN date
                                    )
            
                                LET revenueBeforePerDay = ( // subquery start
                                    FOR r IN ${perionCollectionName}
                                        FILTER r.date >= ${startOfBeforeMonth} && r.date <= ${endOfBeforeMonth} && r.company_id == "${companyid}"
                                        COLLECT date = r.date
                                        AGGREGATE revenueBeforePerDay = SUM(r.impressions)
                                        RETURN revenueBeforePerDay
                                    )
            
                                RETURN { revenuePerDay, datesOfRevenue, revenueBeforePerDay }
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
        }
    }
    
}


module.exports = {
    updateAllPerionStats,
    getRawPerionStats,
    updateDocuments,
    getSummaryMetrics,
    getChartMetrics,
    getStats,
    updateSplits,
    getChartStat,
    getPerTagStats,
};