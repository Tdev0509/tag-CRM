const moment = require('moment');
const request = require('request');
const { db } = require('../../../services/arango')
const { query } = require('express');
const aql = require('arangojs').aql;

// await run();

// startProgram();


//Formates any date into timestamp date object
//Dates passed must be in MM-DD-YYYY format
function getStartOfDayUTCTimestampDateObject(date) {
    return moment(date, "MM-DD-YYYY").startOf('day').toDate().getTime();
    //return moment(date, "MM-DD-YYYY").utc().startOf('day').toDate().getTime();
}

//Formates any date into timestamp date object
//Dates passed must be in MM-DD-YYYY format
function getEndOfDayUTCTimestampDateObject(date) {
    return moment(date, "MM-DD-YYYY").endOf('day').toDate().getTime();
    //return moment(date, "MM-DD-YYYY").utc().endOf('day').toDate().getTime();
}

function getStartOfCurrentMonthUTCTimestampDateObject() {
    return startOfCurrentMonth = moment().utc().startOf('month').toDate().getTime();
}

function getEndOfCurrentMonthUTCTimestampDateObject() {
    return endOfCurrentMonth = moment().utc().endOf('month').toDate().getTime();
}





module.exports = {
    getStartOfDayUTCTimestampDateObject,
    getEndOfDayUTCTimestampDateObject,
    getStartOfCurrentMonthUTCTimestampDateObject,
    getEndOfCurrentMonthUTCTimestampDateObject
};