var express = require('express');
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

    var sql = "SELECT id, email, passwd FROM users WHERE id=? AND passwd=?";
    conn.query(sql, datas, function(err, rows) {
        if(err) console.log("err : " + err);
        if(!(rows.length > 0)) {
            console.log("ID or Password Error");
        } else {
            // 메인 페이지로 계정 정보를 넘긴다.
            res.render('');
       }     
    });
});

// Register
router.get('/register', function(req, res, next) {
    res.render('views/register');
});
router.post('/register', function(req, res, next) {
    var id = req.body.id;
    var email = req.body.email;
    var passwd = req.body.passwd;
    var name = req.body.name;
    var datas = [id, email, passwd, name];

    var sql = "INSERT INTO users(id, email, passwd, name) VALUES(?, ?, ?, ?)";
    conn.query(sql, datas, function(err, rows) {
        if(err) console.log("err : " + err);

    })
});

module.exports = router;