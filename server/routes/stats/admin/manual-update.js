var express = require('express');
var router = express.Router();
const { auth } = require('../../../middlewares/auth');
const manualUpdateFunctions = require('../helpers/manual-update-scraper');
var axios = require('axios');
var moment = require('moment');
const { Tags } = require('../../../services/arango')

router.use(auth);

//Maunal Update Stat
router.put('/stat-update', async (req, res, next) => {
    const { company, reportType, startDate, endDate } = req.body;
    console.log('REPORT MANUAL UPDATING...', company, reportType, startDate, endDate)
    let stats;
    if (reportType == "perion") {
        stats = await manualUpdateFunctions.getRawPerionStats(company, startDate, endDate);
        manualUpdateFunctions.updatePerionDocuments(company, stats);
        console.log('Completed UPSERT!');
    } else if (reportType == "lyons") {
        manualUpdateFunctions.updateLyonStats(company, startDate, endDate);
        console.log('Completed Lyons UPSERT!');
    } else if (reportType == "rubi") {
        manualUpdateFunctions.updateRubiStats(company, startDate, endDate);
        console.log('Completed Rubi UPSERT!');
    }

    res.status(200).send({ stats: "ok" });
});

//Maunal Update Split
router.put('/split-update', async (req, res, next) => {
    const { company, tag, startDate, endDate } = req.body;
    console.log('REPORT MANUAL UPDATING SPLIT...', company, tag, startDate, endDate)
    if(tag == "all tag") {
        manualUpdateFunctions.allTagSplitUpdate(startDate, endDate);
        console.log(`Completed All Tag's Split Updating!`)
    } else {
        let tagData = await Tags.find().where({ _id: tag }).one().limit(1);
        let reportType = tagData.advertiser;
        let comId = tagData.company;
        let tagId = tagData._id;
        if (reportType == "perion") {
            //Perion Split Change
            manualUpdateFunctions.updatePerionSplits(comId, tagId, startDate, endDate);
            console.log(`Completed ${tagId} Split Updating!`)
        } else if (reportType == "lyons") {
            //Lyons Split Change
            manualUpdateFunctions.updateLyonsSplits(comId,tagId, startDate, endDate);
            console.log(`Completed ${tagId} Split Updating!`)
        } else if (reportType == "rubi") {
            //Rubi Split Change
            manualUpdateFunctions.updateRubiSplits(comId,tagId, startDate, endDate);
            console.log(`Completed ${tagId} Split Updating!`)
        }
    }
    

    res.status(200).send({ stats: "ok" });
});

module.exports = router;