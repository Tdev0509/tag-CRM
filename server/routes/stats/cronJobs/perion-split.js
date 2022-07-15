var moment = require('moment');
const { db } = require('../../../services/arango');

//Cron Job Perion Split Update function
async function perionSplitUpdateCronJob() {
    var startDate = moment().utc().subtract(2, "days").add(-7, 'hours').startOf('day').toDate().getTime();
    var endDate = moment().utc().subtract(2, 'days').add(-7, 'hours').endOf('day').toDate().getTime();
    console.log('Perion Split Update Cron Job start!');
    let aql = `FOR com IN companies FOR r IN com.reportingProviders FILTER r.reportingProvider == "perion" RETURN com`;
    const cursor = await db.query(aql)
    let companyInfo = await cursor.all()
    
    if(companyInfo) {
        for (var companyData of companyInfo) {
            var company_name = companyData.name.trim().split(" ");
            var company_id = companyData._id;
            var perionStatCollectionName = `${company_name.join("_")}_perion_stat_reports`;
            try {
                db.query(`FOR tag IN tags FILTER tag.advertiser == "perion" && tag.company == "${company_id}" FOR subid IN tag.subids FOR stat IN ${perionStatCollectionName} FILTER stat.date >= ${startDate} && stat.date <= ${endDate} && TO_NUMBER(stat.subid) == TO_NUMBER(subid.subid) UPDATE stat WITH {"split": subid.split} IN ${perionStatCollectionName}`)
            } catch (error) {
                console.log(error);
            }
        }
        console.log('Perion Split Update Cron Job End!');
    }
}

module.exports =  {
    perionSplitUpdateCronJob,
}