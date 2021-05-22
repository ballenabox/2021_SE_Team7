var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

/* GET home page or admin page. */
router.get('/', function(req, res, next) {
 
  if(req.cookies) {
    console.log("쿠키")
    console.log(req.cookies)
  }

  if(req.session) {
    console.log("세션")
    console.log(req.session)
  }

  res.render('index', { title: 'Express', session: req.session });
}); // ejs에서 session 값을 활용하려면 res.render후 session값을 넘겨줘야한다 -> 향후 로그인정보가 필요한 모든 router.get에 필요

module.exports = router;
