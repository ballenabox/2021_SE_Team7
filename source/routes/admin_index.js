var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();


// 페이징
router.get('/:page',function(req,res,next) {
    var page = req.params.page;
    var sql = "SELECT id, email, passwd, name FROM users WHERE admin = ?";
    conn.query(sql, 0, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('admin_index', {title: '회원 목록', rows: rows, page:page, length:rows.length-1, page_num:10, pass:true});
        console.log(rows.length-1);
    });
});
// /로 접근 시 /admin_index/1로 재접근
router.get('/', function(req, res, next) {
    res.redirect('/admin_index/1');
});

module.exports = router;
