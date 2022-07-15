var express = require('express');
var router = express.Router();
var Database = require('arangojs').Database;
var db = new Database(process.env.DB_AUTH_HOST);// database URL
const userCollection = 'users'; 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/setup', async function(req, res) {
  try {
    await db.createDatabase(process.env.DB_NAME);
    db.useDatabase(process.env.DB_NAME);
    collection = db.collection(userCollection);
    await collection.create(userCollection);
    res.send({message: `DB ${process.env.DB_NAME} successfully created with collection ${userCollection}`})
  } catch (error) {
    console.log(error)
  }  
});

module.exports = router;
