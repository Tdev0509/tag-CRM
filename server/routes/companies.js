var express = require('express');
var router = express.Router();
const { Companies,Tags, Templates, db } = require('../services/arango');
const { auth } = require('../middlewares/auth');
const aql = require('arangojs').aql;
const { InitPerionStatReportsSchema } = require('../models/initPerion');
router.use(auth);

// router.get('/', async function (req, res, next) {
//   try {
//     let result = await Tags.find();
//     return res.send(result);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// router.delete('/:_key', async function (req, res, next) {
//   try {
//     let result = await Tags.remove().where({ _key: req.params._key });
//     return res.send(result);
//   } catch (error) {
//     console.log(error)
//     res.status(400).send(error);
//   }
// });

// router.get('/:_key', async function (req, res, next) {
//   try {
//     let result = await Tags.find().where({ _key: req.params._key }).one();
//     return res.send(result);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// router.post('/', async (req, res, next) => {
//   const { name, company } = req.body;
//   try {
//     const result = await new Tags({ name, company }).save();
//     return res.send(result);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

//Saves a new company into the companies collection
router.post('/', async (req, res, next) => {
  const { name, reportingProviders, adServerUrls } = req.body
  let adServerUrlsVal = JSON.stringify(adServerUrls);
  let reportingProvidersVal = JSON.stringify(reportingProviders)
  // console.log(reportingProviders)
  try {
    const isExist = await Companies.find().where({ name })
    if (isExist && isExist.length) {
      return res.status(400).send('Company already exists.')
    } else {
      var aql = `INSERT { name:"${name}", reportingProviders: ${reportingProvidersVal}, adServerUrls: ${adServerUrlsVal} } INTO companies RETURN NEW`
      const cursor = await db.query(aql)
      let result = await cursor.all()
      //new perion stat collection creating about new company
      let companyName = name.trim().split(" ");
      db.model(`${companyName.join("_")}_perion_stat_reports`, InitPerionStatReportsSchema)
      return res.status(200).send(result[result.length - 1])
    }
  } catch (error) {
    return res.status(400).send('Error adding company: ' + error)
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const allCompanies = await Companies.find();
    return res.status(200).send(allCompanies);
  } catch (err) {
    return res.status(400).send(err);
  }
})

//Return ONE company 
router.get('/get_company/:company_id', async (req, res, next) => {
  const { company_id } = req.params;
  console.log(company_id)
  const _id = `companies/${company_id}`;
  console.log(_id)
  const company = await Companies.find().where({ _id }).one().limit(1);
  if (company) {
    res.status(200).send(company);
  }
  else {
    res.status(400).send('No company found.');
  }
})

/** /api/companies/get_companies
 *  @param userCompanies[CompanyInterface];
 * 
 */
//get MANY companies
router.get('/get_many_companies', async (req, res, next) => {
  //Get UserCompanies from Query Request/URL string & format into JSON.
  const userCompanies = JSON.parse(req.query.companies);

  let companies = await getManyCompaniesHelper(userCompanies);

  //Check finalCompanies results
  if (companies) {
    res.status(200).send(companies);

  } else {
    res.status(400).send('No company found.');
  }

})


function getManyCompaniesHelper(userCompanies) {
  console.log("======user company====", userCompanies)
  return new Promise((resolve, reject) => {
    try {
      db.query(aql`
          FOR company in companies
            FOR c in ${userCompanies}
              FILTER company._id ==  c
                RETURN { name: company.name, adServerUrls: company.adServerUrls, reportingProviders: company.reportingProviders, _id: company._id }
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


// router.get('/try', async function (req, res, next) {
//   let aql = `FOR b IN users 
//   FILTER b._key == "304907"
//   LET a = (FOR x IN b.tagsId FOr a IN tags FILTER x == a._key return a) 
//   LIMIT 1
//   RETURN {fullname: b.fullname, email: b.email,role: b.role, tags: a}`;
//   const cursor = await db.query(aql)
//   let results = await cursor.all()
//   console.log(results)
//   res.send(results);
//   // convert results from JSON to models
//   //console.log(User.fromJSON(results))
// });

//Update company
router.post('/update/:company_id', auth, async function (req, res, next) {
  const { company_id } = req.params;
  const { name, reportingProviders, adServerUrls } = req.body
  console.log(req.body, reportingProviders)
  const _id = req.body._id;
  console.log(_id);
  try {
    const company = await Companies.find().where({ _id }).one().limit(1);
    const result = await Companies.update({ ...company[0], name: name, reportingProviders: reportingProviders, adServerUrls: adServerUrls  }).where({ _id }).limit(1);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete company
router.post('/delete/:company_id', auth, async function (req, res, next) {
  const { company_id } = req.params;
  const { name } = req.body;
  console.log('Starting...')
  console.log(company_id)
  console.log(name)
  console.log(req.body)
  const _id = req.body._id;
  console.log(_id);
  try {
    console.log('Trying to delete')
    //tags delete
    await Tags.remove().where({ company: _id});
    //tempate delete
    await Templates.remove().where({ company: _id});
    const deletedCompany = await Companies.remove().where({ _id }).one().limit(1);
    await deleteCompaniesFromUserOnCompanyDelete(deletedCompany._id);
    return res.status(200).send(deletedCompany);
  } catch (error) {
    res.status(400).send(error);
  }
});

function deleteCompaniesFromUserOnCompanyDelete(companyId) {
  return new Promise((resolve, reject) => {
    try {
      db.query(aql`
          FOR user in users
              LET newCompanies = (
                REMOVE_VALUE (user.companies, "companies/86485209")
              )
            UPDATE user WITH { companies: newCompanies } IN users

          `)
        .then(cursor => {
          return cursor.map(t => {
            // console.log(t)
            return t;
          })
        })
        .then(keys => {
          console.log('keys')
          console.log(keys)
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
