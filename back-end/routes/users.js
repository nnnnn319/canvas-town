var express = require('express');
var router = express.Router();
var mysql = require('../model/mysql.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



// 登录
router.post('/registerName', function(req, res, next){
    let {username} = req.body
    console.log(username)
    // 查看是否存在
    let response = new Promise((resolve,reject) => {
      // 查询是否存在
      const sql = `SELECT * from user WHERE username = '${username}' `
      mysql.query(sql, (err,result,fields)=>{
        if(err){
          resolve({
            code: 1,
            msg:"SQL ERROR:" + err
          })
        }else{
          if(result.length === 1){
            if(result[0].ifLogin === 1){
              console.log("已登录")
              // 已登录
              resolve({
                code: 1,
                msg: "账号已登录"
              })
            }else{
              console.log("未登录")
              // 未登录
              const sql = `UPDATE music_guess.user t SET t.ifLogin = 1 WHERE t.id = ${result[0].id}`
              mysql.query(sql, (err,result,fields)=>{
                if(err){
                  // 状态设置成功
                  resolve({
                    code: 1,
                    msg: 'MYSQL ERROR' + err
                  })
                }else{
                  resolve({
                    code: 0,
                    msg:"登录成功"
                  })
                }
              })
            }
          }else{
            const sql = `INSERT INTO user (username, ifLogin) VALUES ('${username}', 1)`
            mysql.query(sql, (err,result,fields)=>{
              if(err){
                reject({
                  code: 1,
                  msg: 'MYSQL ERROR' + err
                })
              }else{
                resolve({
                  code: 0,
                  msg:"登录成功"
                })
              }
            })
          }
        }
      })
    }).then((data=>{
      res.json(data)
    }))
})


// 退出登录
router.post('/logout', function(req, res, next){
  let {username} = req.body
  console.log(username,`退出登录`)
  let p = new Promise((resolve, reject) => {
    const sql = `UPDATE music_guess.user t SET t.ifLogin = 0 WHERE t.username = '${username}'`
    mysql.query(sql,(err, result, fileds) =>{
      if(err){
        reject({
          code: 1,
          msg: `Mysql Error: ${err}`
        })
      }else{
        resolve({
          code: 0,
          msg: `退出登录成功`
        })
      }
    })
  })

  p.then(
    (data) => {res.json(data)},
    (data) => {res.json(data)}
  )
})
module.exports = router;
