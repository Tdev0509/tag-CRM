var moment = require('moment');
const { db } = require('../../../services/arango');
const request = require('request');
const aql = require('arangojs').aql;
var axios = require('axios');

function rubiStatCronJob() {
    var cron_date = moment.utc().subtract(2, "days").add(-7, 'hours').format("MM-DD-YYYY");
    
    console.log("========Rubi Cron Job start!========")
    var config = {
        method: 'get',
        url: `https://admin.mycoolnewtab.com/api/v2/report?date_from=${cron_date}&date_to=${cron_date}&key=b8ccd84e-345b-4196-b09b-c60e4c2ab1a9&format=json`,
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
                db.query(aql`FOR stat IN ${rubiData} INSERT stat INTO rubi_stat_reports`);
            } catch (error) {
                console.log(err)
            }
            console.log("Rubi Cron Job End!")  
        })
        .catch(function (error) {
            console.log(error);
        });
}

module.exports =  {
    rubiStatCronJob,
}