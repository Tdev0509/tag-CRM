var express = require('express');
var axios = require('axios');
var router = express.Router();
const { Templates ,db } = require('../services/arango');
const { auth } = require('../middlewares/auth');

router.use(auth);

//new Template add 
router.post('/', async (req, res, next) => {
  const { templateName, name, company, advertiser, publisher, browserStatus, browser, deviceTypeStatus, deviceType, versionStatus, version, countryStatus, country, adServerUrl, statType, subids, rotationType, url, params } = req.body;
    var param = JSON.stringify(params);
    var subList = [];
    subids.map(subItem => {
      if(subItem.subid.includes("-")) {
        var startNum = parseInt(subItem.subid.split('-')[0]);
        var endNum = parseInt(subItem.subid.split('-')[1]);
        if(startNum < endNum) {
          for(var i=startNum; i<= endNum;i++) {
            subList.push({
              "subid": i.toString(),
              "limit": subItem.limit,
              "split": subItem.split,
              "filterTag": subItem.filterTag
            })
          }
        } else if (startNum == endNum) {
          subList.push({
            "subid": startNum.toString(),
            "limit": subItem.limit,
            "split": subItem.split,
            "filterTag": subItem.filterTag
          })
        } else if(startNum > endNum) {
          for(var i=endNum; i<= startNum;i++) {
            subList.push({
              "subid": i.toString(),
              "limit": subItem.limit,
              "split": subItem.split,
              "filterTag": subItem.filterTag
            })
          }
        } else {
          subList.push(subItem);
        }
        
      } else {
        subList.push(subItem);
      }
      
    });
    var subidVal = JSON.stringify(subList);
    try {
      const isExist = await Templates.find().where({ templateName })
      if (isExist && isExist.length > 0) {
        return res.status(400).send('Template already exists.')
      } else {
        var aql = `INSERT { templateName: "${templateName}", name:"${name}", company: "${company}", advertiser:"${advertiser}", publisher:"${publisher}", browserStatus: "${browserStatus}", browser:"${browser}", deviceTypeStatus: "${deviceTypeStatus}", deviceType: "${deviceType}", versionStatus: "${versionStatus}", version: "${version}", countryStatus: "${countryStatus}", country: "${country}", adServerUrl: "${adServerUrl}", statType: "${statType}", subids: ${subidVal}, rotationType: "${rotationType}", url: "${url}", params: ${param} } INTO templates RETURN NEW`;
        const cursor = await db.query(aql);
        let result = await cursor.all();
        return res.send(result[result.length - 1]);
      }
      
    } catch (error) {
      return res.status(400).send('Error adding Template: ' + error)
    }
});
  
//get all templates
router.get('/', async function (req, res, next) {
    try {
      let aql = `FOR t IN templates LET c = (FOR c IN companies FILTER t.company == c._id return c) RETURN {_key:t._key, _id: t._id, templateName: t.templateName, name: t.name, advertiser: t.advertiser, publisher: t.publisher, browser: t.browser, deviceType: t.deviceType, version: t.version, country: t.country,  company: c}`;
      const cursor = await db.query(aql)
      let result = await cursor.all()
      return res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
});

//delete tag 
router.delete('/:_key', async function (req, res, next) {
    try {
      let result = await Templates.remove().where({ _key: req.params._key });
      return res.send(result);
    } catch (error) {
      console.log(error)
      res.status(400).send(error);
    }
});

//one tag get 
router.get('/get_template/:template_id', async function (req, res, next) {
    const { template_id } = req.params;
    const _id = `templates/${template_id}`;
    try {
      let template = await Templates.find().where({ _id }).one().limit(1);
      if (template) {
        res.status(200).send(template);
      }
      else {
        res.status(400).send('No Template found.');
      }
    } catch (error) {
      res.status(400).send(error);
    }
});

module.exports = router;