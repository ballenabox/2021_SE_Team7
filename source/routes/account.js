var express = require('express');
var path = require('path');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

// Register
router.get('/register', function(req, res, next) {
    res.render('register');
});
router.post('/register', function(req, res, next) {
    var id = req.body.id;
    var email = req.body.email;
    var passwd = req.body.password;
    var name = req.body.name;
    var datas = [id, email, passwd, name];
    console.log(id, email, passwd, name, datas)

    req.session.dup = false;
    req.session.dup_id = false;
    req.session.dup_eamil = false;
    req.session.Validation = true;

    var datas2 = [id, email];
    var sql3 = "SELECT id, email FROM users WHERE id=? OR email=?";
    conn.query(sql3, datas2, function(err, results) {
      if(err) {
        console.log("dup err : " + err);
        throw err;
      }
      console.log('쿼리문 안에서 : ' + id, email);
      if(results.length>0) { // 중복이고
        if(!passwordValidation(passwd)) { // 조건 안맞을 때
          req.session.dup = true;
          req.session.Validation = true;
          res.redirect('/');
        }
        else { // 조건 맞을 때
          req.session.dup = true;
          req.session.Validation = false;
          res.redirect('/');
        }
      }
      else { // 중복 아니고
        if(!passwordValidation(passwd)) { // 조건 안맞을때
          req.session.Validation = true; // -> 넣지마라
          res.redirect('/');
        }
        else { // 조건 맞을 때 -> 최종 적합할 때
          console.log('모든 조건 만족')
          req.session.Validation = false;
        }

        console.log('req.session.Validation : ' + req.session.Validation);
        if (req.session.Validation == false) {
          var sql = "INSERT INTO users(id, email, passwd, name) VALUES(?, ?, ?, ?)";
          conn.query(sql, datas, function(err, rows) {
            if(err) {
              console.log("err : " + err);
            }
            else {
              req.session.loggedin = true;
              req.session.name = name;
              res.redirect('/');
            }
    })
  }
      }
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

// Login
router.get('/login', function(req, res, next) {
    let session = req.session

    res.render('login', {
        session: session
    });
});
router.post('/login', function(req, res, next) {
    var id = req.body.id;
    var passwd = req.body.password;
    var datas = [id, passwd];

    var sql = "SELECT id, passwd, name, admin FROM users WHERE id=? AND passwd=?";
    conn.query(sql, datas, function(err, results) {
        if(err) {
            console.log("err : " + err);
            throw err;
        }
        if(results.length > 0) {
            req.session.loggedin = true;
            console.log("로그인 성공")
            req.session.name = results[0].name;
            if(results[0].admin == 1) {
              req.session.isAdmin = true;
              console.log('관리자 : ' + req.session.name + '님이 접속하였습니다');
              res.redirect('/admin_index');
              res.end();
            }
            else {
              console.log('회원 : ' + req.session.name + '님이 접속하였습니다');
              res.redirect('/');
              res.end();
            }
        } else {
            console.log("ID or Password Error");
            // 에러에 따른 경고창 표시 필요 -> 백엔드에서 불가능, 프론트엔트에서 구현
            // return res.status(401).json({ message : "id 또는 password가 올바르지 않습니다"});
            res.redirect('/');
       }
    });
});

router.get('/logout', function(req, res, next) {
  
    req.session.loggedin = false;
    req.session.isAdmin = false;
    res.redirect('/');
    res.end();
})

module.exports = router;