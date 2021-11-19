var express = require('express');
var router = express.Router();
var mysql = require('../model/mysql.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getMusicList',function(req,res,next){
  console.log('进入方法')
  let p = new Promise((resolve, reject) => {
    const sql = `SELECT  name,  addr, total FROM music_guess.music LIMIT 10`
    mysql.query(sql,(err, result, fileds) => {
      if(err){
        reject({
          code: 1,
          msg: `mysql error: ${err}`
        })
      }else{
        resolve({
          code: 0,
          msg: `get musics success!`,
          data: result
        })
      }
    })
  }).then(
    (data) => {res.json(data)},
    (data) => {res.json(data)}
  )
})
module.exports = router;
