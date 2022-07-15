const moment = require('moment');
const request = require('request');
const { db, Companies, Tags } = require('../../../services/arango')
const aql = require('arangojs').aql;
const helperFunctions = require('./date-formatter');
var axios = require('axios');

//BEGIN SCRAPING LOGIC
function getRawPerionStats(company, start, end) {
    return new Promise(async (resolve, reject) => {
        try {
           
            var startDate = moment(start).utc().startOf('day').toDate().getTime();
            var endDate = moment(end).utc().endOf('day').toDate().getTime();

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
                            //console.log("Inside UI, getting data: ", loginStatus)
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


//Begin Rubi scraping logic and Upsert
async function updateRubiStats(company, start, end) {
    try {
        var startDate = moment(start).utc().format("MM-DD-YYYY");
        var endDate = moment(end).utc().format("MM-DD-YYYY");
        var config = {
            method: 'get',
            url: `https://admin.mycoolnewtab.com/api/v2/report?date_from=${startDate}&date_to=${endDate}&key=b8ccd84e-345b-4196-b09b-c60e4c2ab1a9&format=json`,
            headers: { }
        };
        axios(config)
            .then(function (response) {
                let rubiData = [];
                for (var res_data of response.data) {
                    if(res_data.rows.length > 0) {
                        for (var subData of res_data.rows) {
                            var stat = {
                                date: moment(subData.Date, "MM/DD/YYYY").utc().startOf('day').toDate().getTime(),
                                publisher: subData.Publisher,
                                subid: subData.SubID,
                                geo: subData.GEO,
                                total_searches: subData['Total Searches'],
                                monetized_searches: subData['Monetized Searches'],
                                clicks: subData.Clicks,
                                revenue: subData["Net Revenue"],
                                split: 0
                            }
                            rubiData.push(stat)
                        }
                    }
                }

                try {
                    db.query(aql`FOR stat IN ${rubiData} UPSERT { date: stat.date, subid: stat.subid } INSERT stat UPDATE {date: stat.date, publisher: stat.publisher, subid: stat.subid, geo: stat.geo, total_searches: stat.total_searches, monetized_searches: stat.monetized_searches, clicks: stat.clicks, revenue: stat.revenue} IN rubi_stat_reports`);
                } catch (error) {
                    console.log(err)
                }
                console.log("Rubi Add And Update End!")  
            })
            .catch(function (error) {
                console.log(error);
            });

    } catch (error) {
        console.log(error)
    }
}

//Begin lyon scraping and upsert
async function updateLyonStats(company, start, end) {
    var startDate = moment(start).utc().format("YYYY-MM-DD");
    var endDate = moment(end).utc().format("YYYY-MM-DD");
    var config = {
        method: 'get',
        url: `http://rt.api.imageadvantage.net/PublisherAPIReports/?StartDate=${startDate}&EndDate=${endDate}&Key=8rand(KK&ReportType=3`,
        headers: { }
    };
    axios(config)
        .then(function (response) {
            var respond_data = response.data.split(/\r?\n/);
            var lyondict = {};
            var lyonData = [];
            for (var i=1; i < respond_data.length -1; i++ ) {
                var subdata = respond_data[i].split(',');
                lyondict['rptDate'] = moment(subdata[0], "YYYY-MM-DD").utc().startOf('day').toDate().getTime();
                lyondict['ma'] = subdata[1]
                lyondict['subid'] = subdata[2];
                lyondict['market'] = subdata[3];
                lyondict['userCountry'] = subdata[4];
                lyondict['currencyCode'] = subdata[5];
                lyondict['searches'] = subdata[6];
                lyondict['biddedSearches'] = subdata[7];
                lyondict['clicks'] = subdata[8];
                lyondict['biddedCTR'] = subdata[9];
                lyondict['ctr'] = subdata[10];
                lyondict['split_num'] = 0;
                lyondict['revenue'] = subdata[11];
                lyonData.push(lyondict);
            }
            try {
                db.query(aql`FOR stat IN ${lyonData} UPSERT { rptDate: stat.rptDate, subid: stat.subid } INSERT stat UPDATE {rptDate: stat.rptDate, ma: stat.ma, subid: stat.subid, market: stat.market, userCountry: stat.userCountry, currencyCode: stat.currencyCode, searches: stat.searches, biddedSearches: stat.biddedSearches, biddedCTR: stat.biddedCTR, ctr: stat.ctr, split_num: stat.split_num, clicks: stat.clicks, revenue: stat.revenue} IN lyon_stat_reports`);
            
            } catch(error) {
                console.log('Error Upsert Lyon Stat: ' + error)
            }
        })
        .catch(function (error) {
            console.log('Error Upsert Lyon Stat: ' + error)
        });
}
async function updatePerionDocuments(company, data) {
    console.log('Updating Perion ' + data.length + ' documents')  
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var perionCollectionName = (`${company_name.join("_")}_perion_stat_reports`).toString()
        for (var reportingProvider of companyInfo.reportingProviders) {         
            if(reportingProvider.reportingProvider == "perion") {
                for(var subData of data) {
                    if(subData) {
                        var company_id = subData['company_id'];
                        var date = subData['date'];
                        var country = subData['country'];
                        var subid = subData['subid'];
                        var impressions = subData['impressions'] ? subData['impressions'] : 0;
                        var monetized_impressions= subData['monetized_impressions'] ? subData['monetized_impressions'] : 0;
                        var clicks= subData['clicks'] ? subData['clicks'] : 0;
                        var revenue= subData['revenue'] ? subData['revenue'] : 0;
                        var bing_searches_initial= subData['bing_searches_initial'] ? subData['bing_searches_initial'] : 0;
                        var bing_searches_followon= subData['bing_searches_followon'] ? subData['bing_searches_followon'] : 0;
                        var bing_monetized_searches_initial= subData['bing_monetized_searches_initial'] ? subData['bing_monetized_searches_initial'] : 0;
                        var bing_monetized_searches_followon= subData['bing_monetized_searches_followon'] ? subData['bing_monetized_searches_followon'] : 0;
                        var split= 0;
                        try {
                            db.query(`UPSERT { date: ${date}, country: "${country}", subid: "${subid}" } INSERT {"company_id": "${company_id}","date":${date},"country":"${country}","subid":"${subid}","impressions":${impressions},"monetized_impressions":${monetized_impressions},"clicks":${clicks},"revenue":${revenue},"bing_searches_initial":${bing_searches_initial},"bing_searches_followon":${bing_searches_followon},"bing_monetized_searches_initial":${bing_monetized_searches_initial},"bing_monetized_searches_followon":${bing_monetized_searches_followon}, "split":${split} } UPDATE {"company_id": "${company_id}","date":${date},"country":"${country}","subid":"${subid}","impressions":${impressions},"monetized_impressions":${monetized_impressions},"clicks":${clicks},"revenue":${revenue},"bing_searches_initial":${bing_searches_initial},"bing_searches_followon":${bing_searches_followon},"bing_monetized_searches_initial":${bing_monetized_searches_initial},"bing_monetized_searches_followon":${bing_monetized_searches_followon}} IN ${perionCollectionName}`)
                        } catch (err) {
                            console.log('Hit the CATCH of lots of docs...')
                            console.log(err.response.body)
                        }
                    }
                    
                    // let result = await cursor.all();
                    // allData.push(result[0])
                }
            } 
        }
    }     
}

async function updatePerionSplits(company, tagId, start, end) {
    console.log(`${tagId} updating split!`)
    let companyInfo = await Companies.find().where({ _id: company }).one().limit(1);
    var allData = [];
    if(companyInfo) {
        var company_name = companyInfo.name.trim().split(" ");
        var company_id = companyInfo._id;
        var perionStatCollectionName = `${company_name.join("_")}_perion_stat_reports`
        var startDate = moment(start).utc().startOf('day').toDate().getTime();
        var endDate = moment(end).utc().endOf('day').toDate().getTime();
        try {
            db.query(`FOR tag IN tags FILTER tag._id == "${tagId}" && tag.company == "${company_id}" FOR subid IN tag.subids FOR stat IN ${perionStatCollectionName} FILTER stat.date >= ${startDate} && stat.date <= ${endDate} && TO_NUMBER(stat.subid) == TO_NUMBER(subid.subid) UPDATE stat WITH {"split": subid.split} IN ${perionStatCollectionName}`)
        } catch (error) {
            console.log(error);
        }
        
    }     
    return allData;
}

async function updateLyonsSplits(company, tagId, start, end) {
    console.log(`${tagId} updating split!`)
    var startDate = moment(start).utc().startOf('day').toDate().getTime();
    var endDate = moment(end).utc().endOf('day').toDate().getTime();
    try {
        db.query(`FOR stat IN lyon_stat_reports FILTER stat.rptDate >= ${startDate} && stat.rptDate <= ${endDate} FOR t IN tags FILTER t._id == "${tagId}" && t.company == "${company}" FOR ts IN t.subids FILTER (ts.filterTag == 'StartsWith' && STARTS_WITH(stat.subid, ts.subid)) || ts.filterTag == 'EndsWith' && LIKE(stat.subid, ts.subid + '%') || (ts.filterTag == 'Contains' && CONTAINS(stat.subid, ts.subid)) || (ts.filterTag == 'ExactValue' && stat.subid == ts.subid) UPDATE stat WITH {"split": ts.split} IN lyon_stat_reports`)
    } catch (error) {
        console.log(error);
    }
    // if(tagInfo) {
    //     for(var tag of tagInfo) {
    //         for(var subid of tag.subids) {
                
    //             var tsplit = subid.split;
    //             var tfilterTag = subid.filterTag;
    //             var tsubid = subid.subid;
    //             try {
    //                 if(tfilterTag == "StartsWith") {
    //                     await db.query(`FOR stat IN lyon_stat_reports FILTER stat.rptDate >= ${startDate} && stat.rptDate <= ${endDate} && STARTS_WITH(stat.subid, "${tsubid}") UPDATE stat WITH {"split": ${tsplit}} IN lyon_stat_reports`)
    //                 } else if (tfilterTag == "EndsWith") {
    //                     await db.query(`FOR stat IN lyon_stat_reports FILTER stat.rptDate >= ${startDate} && stat.rptDate <= ${endDate} && LIKE(stat.subid, "${tsubid}%") UPDATE stat WITH {"split": ${tsplit}} IN lyon_stat_reports`)
    //                 } else if (tfilterTag == "ExactValue") {
    //                     await db.query(`FOR stat IN lyon_stat_reports FILTER stat.rptDate >= ${startDate} && stat.rptDate <= ${endDate} && stat.subid == "${tsubid}" UPDATE stat WITH {"split": ${tsplit}} IN lyon_stat_reports`)
    //                 } else if (tfilterTag == "Contains") {
    //                     await db.query(`FOR stat IN lyon_stat_reports FILTER stat.rptDate >= ${startDate} && stat.rptDate <= ${endDate} && CONTAINS(stat.subid, "${tsubid}") UPDATE stat WITH {"split": ${tsplit}} IN lyon_stat_reports`)
    //                 }
    //             } catch (error) {
    //                 console.log(error);
    //             }
                
    //         }
    //     }
    // }
}

async function allTagSplitUpdate(start, end) {
    console.log(`All Tags updating split!`)
    var startDate = moment(start).utc().startOf('day').toDate().getTime();
    var endDate = moment(end).utc().endOf('day').toDate().getTime();

    //rubi part
    try {
        db.query(`FOR stat IN rubi_stat_reports FILTER stat.date >= ${startDate} && stat.date <= ${endDate} FOR t IN tags FILTER t.advertiser == "rubi" FOR ts IN t.subids FILTER (ts.filterTag == 'StartsWith' && STARTS_WITH(stat.subid, ts.subid)) || ts.filterTag == 'EndsWith' && LIKE(stat.subid, ts.subid + '%') || (ts.filterTag == 'Contains' && CONTAINS(stat.subid, ts.subid)) || (ts.filterTag == 'ExactValue' && stat.subid == ts.subid) UPDATE stat WITH {"split": ts.split} IN rubi_stat_reports`)
    } catch (error) {
        console.log(error);
    }
    //lyons part
    try {
        db.query(`FOR stat IN lyon_stat_reports FILTER stat.rptDate >= ${startDate} && stat.rptDate <= ${endDate} FOR t IN tags FILTER t.advertiser == "lyons" FOR ts IN t.subids FILTER (ts.filterTag == 'StartsWith' && STARTS_WITH(stat.subid, ts.subid)) || ts.filterTag == 'EndsWith' && LIKE(stat.subid, ts.subid + '%') || (ts.filterTag == 'Contains' && CONTAINS(stat.subid, ts.subid)) || (ts.filterTag == 'ExactValue' && stat.subid == ts.subid) UPDATE stat WITH {"split": ts.split} IN lyon_stat_reports`)
    } catch (error) {
        console.log(error);
    }
    //perion part
    let companyInfo = await Companies.find();
    if(companyInfo.length > 0) {
        for (var comInfo of companyInfo) {
            var company_name = comInfo.name.trim().split(" ");
            var company_id = comInfo._id;
            var perionStatCollectionName = `${company_name.join("_")}_perion_stat_reports`;
            try {
                db.query(`FOR tag IN tags FILTER tag.advertiser == "perion" && tag.company == "${company_id}" FOR subid IN tag.subids FOR stat IN ${perionStatCollectionName} FILTER stat.date >= ${startDate} && stat.date <= ${endDate} && TO_NUMBER(stat.subid) == TO_NUMBER(subid.subid) UPDATE stat WITH {"split": subid.split} IN ${perionStatCollectionName}`)
            } catch (error) {
                console.log(error);
            }
        }
    }
}

async function updateRubiSplits(company, tagId, start, end) {
    console.log(`${tagId} updating split!`)
    var startDate = moment(start).utc().startOf('day').toDate().getTime();
    var endDate = moment(end).utc().endOf('day').toDate().getTime();
    try {
        db.query(`FOR stat IN rubi_stat_reports FILTER stat.date >= ${startDate} && stat.date <= ${endDate} FOR t IN tags FILTER t._id == "${tagId}" && t.company == "${company}" FOR ts IN t.subids FILTER (ts.filterTag == 'StartsWith' && STARTS_WITH(stat.subid, ts.subid)) || ts.filterTag == 'EndsWith' && LIKE(stat.subid, ts.subid + '%') || (ts.filterTag == 'Contains' && CONTAINS(stat.subid, ts.subid)) || (ts.filterTag == 'ExactValue' && stat.subid == ts.subid) UPDATE stat WITH {"split": ts.split} IN rubi_stat_reports`)
    } catch (error) {
        console.log(error);
    }
    // if(tagInfo) {
    //     for(var tag of tagInfo) {
    //         for(var subid of tag.subids) {
                
    //             var tsplit = subid.split;
    //             var tfilterTag = subid.filterTag;
    //             var tsubid = subid.subid;
    //             try {
    //                 if(tfilterTag == "StartsWith") {
    //                     await db.query(`FOR stat IN rubi_stat_reports FILTER stat.date >= ${startDate} && stat.date <= ${endDate} && STARTS_WITH(stat.subid, "${tsubid}") UPDATE stat WITH {"split": ${tsplit}} IN rubi_stat_reports`)
    //                 } else if (tfilterTag == "EndsWith") {
    //                     await db.query(`FOR stat IN rubi_stat_reports FILTER stat.date >= ${startDate} && stat.date <= ${endDate} && LIKE(stat.subid, "${tsubid}%") UPDATE stat WITH {"split": ${tsplit}} IN rubi_stat_reports`)
    //                 } else if (tfilterTag == "ExactValue") {
    //                     await db.query(`FOR stat IN rubi_stat_reports FILTER stat.date >= ${startDate} && stat.date <= ${endDate} && stat.subid == "${tsubid}" UPDATE stat WITH {"split": ${tsplit}} IN rubi_stat_reports`)
    //                 } else if (tfilterTag == "Contains") {
    //                     await db.query(`FOR stat IN rubi_stat_reports FILTER stat.date >= ${startDate} && stat.date <= ${endDate} && CONTAINS(stat.subid, "${tsubid}") UPDATE stat WITH {"split": ${tsplit}} IN rubi_stat_reports`)
    //                 }
    //             } catch (error) {
    //                 console.log(error);
    //             }
                
    //         }
    //     }
    // }
}

function getRawLyonsStats(start, end) {
    return new Promise(async (resolve, reject) => {
        try {
            var startDate = moment(start).utc().startOf('day').toDate().getTime();
            var endDate = moment(end).utc().subtract(2, 'days').endOf('day').toDate().getTime();
            let aql = `FOR lyon IN lyon_stat_reports FILTER lyon.rptDate >= ${startDate} && lyon.rptDate <= ${endDate} RETURN lyon`
            db.query(aql).then(cursor => {
                return cursor.map(t => {
                    // console.log(t)
                    return t;
                })
            })
            .then(keys => {
                resolve(keys);
            })
            .catch(err => {
                console.log('Inner catch error...')
                console.log(err);
                reject(err);
            })
            
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

module.exports = {
    getRawPerionStats,
    updatePerionDocuments,
    updatePerionSplits,
    getRawLyonsStats,
    updateLyonsSplits,
    updateRubiSplits,
    updateRubiStats,
    updateLyonStats,
    allTagSplitUpdate
};