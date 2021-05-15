var express = require('express');
var path = require('path');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

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

  function passwordValidation(password) {
    var pattern1 = /[0-9]/;
    var pattern2 = /[a-zA-Z]/;
  
    if (!pattern1.test(password) || !pattern2.test(password) || password.length < 8) {
      return false;
    } else {
      return true;
    }
  }

module.exports = router;