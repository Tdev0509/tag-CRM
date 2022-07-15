var express = require('express');
var axios = require('axios');
var router = express.Router();
const { Tags, Templates ,db } = require('../services/arango');
const { auth } = require('../middlewares/auth');
const aql = require('arangojs').aql;

router.use(auth);

//get all tags
router.get('/', async function (req, res, next) {
  try {
    let aql = `FOR t IN tags LET c = (FOR c IN companies FILTER t.company == c._id return c) LET p = (FOR u IN users FILTER t.publisher == u._key return u) RETURN {_key:t._key, _id: t._id, name: t.name, advertiser: t.advertiser, publisher: p, browser: t.browser, deviceType: t.deviceType, version: t.version, country: t.country, company: c}`;
    
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
    let result = await Tags.remove().where({ _key: req.params._key });
    return res.send(result);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
});

//one tag get 
router.get('/get_tag/:tag_id', async function (req, res, next) {
  const { tag_id } = req.params;
  const _id = `tags/${tag_id}`;
  // try {
    //let tag = await Tags.find().where({ _id }).one().limit(1);
    let aql = `FOR t IN tags FILTER t._id == "${_id}" LET a = (FOR a IN users FILTER a._key == t.publisher LIMIT 1 RETURN a) RETURN { _key: t._key, _id: t._id, adServerUrl: t.adServerUrl, advertiser: t.advertiser, browser: t.browser, browserStatus: t.browserStatus, company: t.company, country: t.country, countryStatus: t.countryStatus, deviceType: t.deviceType, deviceTypeStatus: t.deviceTypeStatus, name: t.name, params: t.params, rotationType: t.rotationType, statType: t.statType, subids: t.subids, url: t.url, version: t.version, versionStatus: t.versionStatus, publisher: a }`;
    const cursor = await db.query(aql)
    let result = await cursor.all()
    if (result) {
      res.status(200).send(result[0]);
    }
    else {
      res.status(400).send('No tag found.');
    }
  // } catch (error) {
  //   res.status(400).send(error);
  // }
});

// router.post('/', async (req, res, next) => {
//   const { name, company } = req.body;
//   try {
//     const result = await new Tags({ name, company }).save();
//     return res.send(result);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

//new tag add 
router.post('/', async (req, res, next) => {
  const { name, company, advertiser, publisher, browserStatus, browser, deviceTypeStatus, deviceType, versionStatus, version, countryStatus, country, adServerUrl, statType,  subids, rotationType, url, params } = req.body;
  var param = JSON.stringify(params);
  var subList = [];
  subids.map(subItem => {
    if(subItem.subid.includes("-") || subItem.subid.includes("~")) {
      var startNum = parseInt(subItem.subid.split('-')[0] || subItem.subid.split('~')[0]);
      var endNum = parseInt(subItem.subid.split('-')[1] || subItem.subid.split('~')[1]);
      if(startNum < endNum) {
        for(var i=startNum; i<= endNum;i++) {
          subList.push({
            "filterTag": subItem.filterTag,
            "subid": i.toString(),
            "limit": subItem.limit,
            "split": subItem.split,
          })
        }
      } else if (startNum == endNum) {
        subList.push({
          "filterTag": subItem.filterTag,
          "subid": startNum.toString(),
          "limit": subItem.limit,
          "split": subItem.split
        })
      } else if(startNum > endNum) {
        for(var i=endNum; i<= startNum;i++) {
          subList.push({
            "filterTag": subItem.filterTag,
            "subid": i.toString(),
            "limit": subItem.limit,
            "split": subItem.split
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
    const isExist = await Tags.find().where({ name })
    // if (isExist && isExist.length > 0) {
    //   return res.status(400).send('Tag already exists.')
    // } else {
      var aql = `INSERT { name:"${name}", company: "${company}", advertiser:"${advertiser}", publisher:"${publisher}", browserStatus: "${browserStatus}", browser:"${browser}", deviceTypeStatus: "${deviceTypeStatus}", deviceType: "${deviceType}", versionStatus: "${versionStatus}", version: "${version}", countryStatus: "${countryStatus}", country: "${country}", adServerUrl: "${adServerUrl}", statType: "${statType}", subids: ${subidVal}, rotationType: "${rotationType}", url: "${url}", params: ${param} } INTO tags RETURN NEW`;
      const cursor = await db.query(aql);
      let result = await cursor.all();
      return res.send(result[result.length - 1]);
    // }
    
  } catch (error) {
    return res.status(400).send('Error adding Tag: ' + error)
  }
});

//get chrome version list
router.get('/chrome/browser', async function (req, res) {
  try {
    var config = {
      method: 'get',
      url: 'https://versionhistory.googleapis.com/v1/chrome/platforms/win/channels/stable/versions/',
      headers: { 
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
    var result = await axios(config);
    res.status(200).send(result.data.versions);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get firefox version list
router.get('/firefox/browser', async function (req, res) {
  try {
    var config = {
      method: 'get',
      url: 'https://product-details.mozilla.org/1.0/firefox_history_major_releases.json',
      headers: {}
    };
    var result = await axios(config);
    res.status(200).send(result.data);
  } catch (error) {
    res.status(400).send(error);
  }
  
});

//Update company
router.post('/update/:tag_id', auth, async function (req, res, next) {
  const { tag_id } = req.params;
  const { name, company, advertiser, publisher, browserStatus, browser, deviceTypeStaus, deviceType, versionStatus, version, countryStatus, country, adServerUrl, statType,  subids, rotationType, url, params } = req.body;
  var param = JSON.stringify(params);
  var subList = [];
  subids.map(subItem => {
    if(subItem.subid.includes("-") || subItem.subid.includes("~")) {
      var startNum = parseInt(subItem.subid.split('-')[0] || subItem.subid.split('~')[0]);
      var endNum = parseInt(subItem.subid.split('-')[1] || subItem.subid.split('~')[1]);
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
  const _id = req.body._id;
  try {
    const tag = await Tags.find().where({ _id }).one().limit(1);
    const result = await Tags.update({ ...tag[0], name: name, company: company, advertiser: advertiser, publisher: publisher, browserStatus: browserStatus, browser: browser, deviceTypeStaus: deviceTypeStaus, deviceType: deviceType, versionStatus: versionStatus, version: version,countryStatus: countryStatus, country: country, adServerUrl: adServerUrl, statType: statType, subids: subidVal, rotationType: rotationType, url: url, params: param }).where({ _id }).limit(1);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get tag with company id
router.get('/get_tag_company/:company_id', async function (req, res, next) {
  const { company_id } = req.params;
  const _id = `companies/${company_id}`;
  // const advertiser = "lyons";
  try {
    let aql = `FOR t IN tags FILTER t.company == "${_id}" LET a = (FOR a IN users FILTER a._key == t.publisher LIMIT 1 RETURN a) RETURN {tag: t, user: a}`;
    const cursor = await db.query(aql)
    let result = await cursor.all()
    return res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

/** 
 *  @param userTags[TagInterface];
 * 
 */
//get MANY tags
router.get('/get_many_tags', async (req, res, next) => {
  //Get UserTags from Query Request/URL string & format into JSON.
  const userTags = JSON.parse(req.query.tags);

  let tags = await getManyTagsHelper(userTags);

  //Check finalCompanies results
  if (tags) {
    res.status(200).send(tags);

  } else {
    res.status(400).send('No tag found.');
  }

})

///getManyTags
function getManyTagsHelper(userTags) {
  console.log("======user Tags====", userTags)
  return new Promise((resolve, reject) => {
    try {
      db.query(aql`
          FOR tag in tags
            FOR c in ${userTags}
              FILTER tag._id ==  c
              RETURN {_key:tag._key, _id: tag._id, name: tag.name, advertiser: tag.advertiser, browser: tag.browser, deviceType: tag.deviceType, version: tag.version, country: tag.country}
          `)
        .then(cursor => {
          return cursor.map(t => {
            // console.log(t)
            return t;
          })
        })
        .then(keys => {
          console.log('keys')
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
  });
}

module.exports = router;
