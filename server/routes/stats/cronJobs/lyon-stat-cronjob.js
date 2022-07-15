var moment = require('moment');
var axios = require('axios');
const { db } = require('../../../services/arango');

//Cron Job Lyon function
function lyonStatCronJob() {
    var crondate = moment().utc();
    var cron_date = crondate.subtract(2, "days").add(-7, 'hours').format("YYYY-MM-DD");
    console.log('Lyons Cron Job start!');
    var config = {
        method: 'get',
        url: `http://rt.api.imageadvantage.net/PublisherAPIReports/?StartDate=${cron_date}&EndDate=${cron_date}&Key=8rand(KK&ReportType=3`,
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
                console.log(err)
            }
            
        }
        console.log('Lyons Cron Job End!');
    })
    .catch(function (error) {
        console.log(error);
    });
    
}
module.exports =  {
    lyonStatCronJob,
}