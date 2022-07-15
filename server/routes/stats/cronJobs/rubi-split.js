var moment = require('moment');
const { db } = require('../../../services/arango');

//Cron Job Rubi Split Update function 
async function rubiSplitUpdateCronJob() {
    var crondate = moment().utc();
    var startDate = crondate.subtract(2, "days").add(-7, 'hours').startOf('day').toDate().getTime();
    var endDate = crondate.subtract(2, 'days').add(-7, 'hours').endOf('day').toDate().getTime();
    console.log('Rubi Split Update Cron Job start!');
    try {
        db.query(`FOR stat IN rubi_stat_reports FILTER stat.date >= ${startDate} && stat.date <= ${endDate} FOR t IN tags FILTER t.advertiser == 'rubi' FOR ts IN t.subids FILTER (ts.filterTag == 'StartsWith' && STARTS_WITH(stat.subid, ts.subid)) || ts.filterTag == 'EndsWith' && LIKE(stat.subid, ts.subid + '%') || (ts.filterTag == 'Contains' && CONTAINS(stat.subid, ts.subid)) || (ts.filterTag == 'ExactValue' && stat.subid == ts.subid) UPDATE stat WITH {"split": ts.split} IN rubi_stat_reports`)
    } catch (error) {
        console.log(error);
    }
    console.log('Rubi Split Update Cron Job End!');
}

module.exports =  {
    rubiSplitUpdateCronJob,
}