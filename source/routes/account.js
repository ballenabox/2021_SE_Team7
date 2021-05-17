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

    // 필수 정보 미입력시 입력 요구 경고
    // if (!email) {
    //   return res.status(400).json({ message: "이메일 입력하세요" });
    // }
    
    // ID와 이메일 주소 중복체크후 경고
    // var emailExists = "SELECT email FROM users WHERE email = ?";
    // conn.query(emailExists, [email], function(err, rows))
    // 비밀번호 생성규칙
    // if (!passwordValidation(password)) {
    //   // return res.status(400).json({ message: "비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다." });
    // }

    var sql = "INSERT INTO users(id, email, passwd, name) VALUES(?, ?, ?, ?)";
    conn.query(sql, datas, function(err, rows) {
        if(err) {
          console.log("err : " + err);
        }
        else {
          res.redirect('/account/login')
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
              res.redirect('/board/write');
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
            res.redirect('/account/login');
       }
    });
});

router.get('/logout', function(req, res, next) {
    req.session.loggedin = false;
    res.redirect('/');
    res.end();
})

module.exports = router;