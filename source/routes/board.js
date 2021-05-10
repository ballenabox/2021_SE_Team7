var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();
 

router.get('/list/:page', function(req, res, next) {
    var page = req.params.page;
    var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('list', {title: '게시판 리스트', rows: rows});
    });
});

// /list로 접근 시
router.get('/list', function(req, res, next) {
    res.redirect('/board/list/1');
});

// 상품 등록
router.get('/write', function(req, res, next) {
    res.render('write', {title : "상품 등록"});
});

router.post('/write', function(req, res, next) {
    var pname = req.body.pname;
    var pcategory = req.body.pcategory;
    var pprice = req.body.pprice;
    var pstock = req.body.pstock;
    var datas = [pname, pcategory, pprice, pstock];

    var sql = "INSERT INTO products(pname, pcategory, pprice, pstock) VALUES(?, ?, ?, ?)";
    conn.query(sql, datas, function(err, rows) {
        if(err) console.log("err : " + err);
        // 등록 완료 후 어느 화면으로 갈 것인가?
        res.redirect('/board/list');
    });
});

// 상품 삭제 in list
router.post('/delete',function(req,res,next) {
    var pid = req.body.pid;
    var pname = req.body.pname;
    var datas = [pid, pname];

    var sql = "DELETE FROM products WHERE pid=? AND pname=?";
    conn.query(sql,datas, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows == 0)
        {
            res.send("<script>alert('해당 상품이 존재하지 않습니다');history.back();</script>");
        } else {
            res.redirect('/board/list/');
        }
    });
});

// 상품 상세보기
router.get('/read/:pid', function(req, res, next) {
    var pid = req.params.pid;
    var sql = "SELECT pid, pname, pcategory, pprice, pstock, pdate FROM products WHERE pid = ?";
    conn.query(sql, [pid], function(err, row) {
        if(err) console.error(err);
        res.render('read', {title: "상품 상세", row:row[0]});
    });
});

// 상품정보 상세보기->수정
router.post('/update', function(req, res, next) {
    var pid = req.body.pid;
    var pname = req.body.pname;
    var pcategory = req.body.pcategory;
    var pprice = req.body.pprice;
    var pstock = req.body.pstock;
    var datas = [pname, pcategory, pprice, pstock, pid];

    // pname, pcategory의 문자열 길이에서 오류 발생. DB를 수정하거나 제약조건을 걸어야 한다.
    var sql = "UPDATE products SET pname=?, pcategory=?, pprice=?, pstock=? WHERE pid=?";
    conn.query(sql, datas, function(err, result) {
        if(err) console.error(err);
        if(result.affectedRows == 0) {
            res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
        } else {
            res.redirect('/board/read/' + pid);
        }
    });
});


/* // 페이징
router.get('/page/:page',function(req,res,next)
{
    var page = req.params.page;
    var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('page', {title: ' 게시판 리스트', rows: rows, page:page, length:rows.length-1, page_num:10, pass:true});
        console.log(rows.length-1);
    });
});
// /page로 접근 시 /page/1로 재접근
router.get('/page', function(req, res, next) {
    res.redirect('/board/page/1');
}); */


module.exports = router;