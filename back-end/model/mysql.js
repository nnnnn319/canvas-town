var mysql = require('mysql')

const fs = require('fs')
// 引入配置文件，这个配置文件的位置是相对于app.js的
let mysqlConfig = fs.readFileSync('./config/config.json')

var connection = mysql.createConnection(JSON.parse(mysqlConfig).mysqlConfig);

module.exports = connection