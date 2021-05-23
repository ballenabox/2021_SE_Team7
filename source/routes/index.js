var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();
var url = require('url');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var multer = require('multer');

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
    
  //res.render('index', { title: 'Express', session: req.session });
  
  var sql = "SELECT pid,pname, pprice, pimage FROM products ORDER BY pdate DESC LIMIT 3;";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('index', {title: '게시판 리스트', rows: rows, session: req.session});
});
});
 // ejs에서 session 값을 활용하려면 res.render후 session값을 넘겨줘야한다 -> 향후 로그인정보가 필요한 모든 router.get에 필요
 router.get('/product-top', function(req, res, next) {
    
  //res.render('index', { title: 'Express', session: req.session });

  var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('product-top', {title: '게시판 리스트', rows: rows, session: req.session});
});
});

router.get('/product-bottom', function(req, res, next) {
    
  //res.render('index', { title: 'Express', session: req.session });

  var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('product-bottom', {title: '게시판 리스트', rows: rows, session: req.session});
});
});

router.get('/product-shoes', function(req, res, next) {
    
  //res.render('index', { title: 'Express', session: req.session });

  var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('product-shoes', {title: '게시판 리스트', rows: rows, session: req.session});
});
});

router.get('/product-all', function(req, res, next) {
    
  var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('product-all', {title: '게시판 리스트', rows: rows, session: req.session});
});
});

router.get('/product-details/:pid', function(req, res, next) {
  /*
  var urlParse = url.parse(req.url,true);
  var queryVar = urlParse.query;
  var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('product-details', {title: '게시판 리스트', rows: rows, session: req.session,product_name:queryVar.product_name,product_price:queryVar.product_price});
});
*/
var pid = req.params.pid;
    var sql = "SELECT pid, pname, pcategory, pprice, pstock, pdate, pimage FROM products WHERE pid = ?";
    conn.query(sql, [pid], function(err, row) {
        if(err) console.error(err);
        res.render('product-details', {title: "상품 상세", row:row[0]});
    });
});
module.exports = router;
