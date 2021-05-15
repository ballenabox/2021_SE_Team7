var express = require('express');
var session = require('express-session');
var path = require('path');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();


// Login
router.get('/login', function(req, res, next) {
    res.render('views/login');
});
router.post('/login', function(req, res, next) {
    var id = req.body.id;
    var passwd = req.body.passwd;
    var datas = [id, passwd];

    var sql = "SELECT id, passwd FROM users WHERE id=? AND passwd=?";
    conn.query(sql, datas, function(err, results) {
        if(err) {
            console.log("err : " + err);
            throw err;
        }
        if(results.length > 0) {
            req.session.loggedin = true;
            res.redirect('/');
            console.log('User with [', request.connection.remoteAddress, '] IP is logged in.')
            // 메인 페이지로 계정 정보를 넘긴다.
            response.end();
            //res.render('');
        } else {
            console.log("ID or Password Error");
       }     
    });
});

module.exports = router;