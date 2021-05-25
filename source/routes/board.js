var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var multer = require('multer');

router.get('/list/:page', function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    var page = req.params.page;
    var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        // delete_complete : 삭제 버튼으로 인해 이 페이지로 돌아오는 경우, true로 render되어 들어온다.
        res.render('list', {title: '게시판 리스트', rows: rows, delete_complete : false});
    });
});

// /list로 접근 시
router.get('/list', function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    res.redirect('/board/list/1');
});

// 상품 등록
router.get('/write', function(req, res, next) {
    if(req.session) {
        console.log("세션")
        console.log(req.session)
      }
      if (req.session.isAdmin == 1) {
        res.render('write', {title : "상품 등록", session: req.session});
      }
      else {
          console.log("접근 권한이 없습니다")
          res.redirect('/');
      }
});

// 파일 업로드 모듈
const _storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: _storage});

// 파일 업로드 인자(upload.single) 추가.
router.post('/write', upload.single('pimage'), function(req, res, next) {
    var pname = req.body.pname;
    var pcategory = req.body.pcategory;
    var pprice = req.body.pprice;
    var pstock = req.body.pstock;
    var pimage = req.file.originalname;
    var datas = [pname, pcategory, pprice, pstock, pimage];

    req.session.WriteError = false;

    if (pname.length > 20||pprice<0) {
        req.session.WriteError = true;
        // 제약조건에 맞지않음, 무효
        res.redirect('/board/write');
    }
    else {
        // 제약조건에 맞음, 등록
        var sql = "INSERT INTO products(pname, pcategory, pprice, pstock, pimage) VALUES(?, ?, ?, ?, ?)";
        conn.query(sql, datas, function(err, rows) {
            if(err) console.log("err : " + err);
            // 등록 완료 후 어느 화면으로 갈 것인가?
            res.redirect('/board/list');
    });
    }
});

// 상품 삭제 in list
// 실제 데이터는 삭제하지 않고 알림창만 뜨게 한다.
router.post('/delete',function(req,res,next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    /* var pid = req.body.pid;
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
    }); */
    var sql = "SELECT * FROM products";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('list', {title: '게시판 리스트', rows: rows, delete_complete : true});
    });
});

// 상품 상세보기
router.get('/read/:pid', function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    var pid = req.params.pid;
    var sql = "SELECT pid, pname, pcategory, pprice, pstock, pdate, pimage FROM products WHERE pid = ?";
    conn.query(sql, [pid], function(err, row) {
        if(err) console.error(err);
        res.render('read', {title: "상품 상세", row:row[0]});
    });
});

// 상품정보 상세보기->수정
router.post('/update', upload.single('newimage'), function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    var pid = req.body.pid;
    var pname = req.body.pname;
    var pcategory = req.body.pcategory;
    var pprice = req.body.pprice;
    var pstock = req.body.pstock;
    if(req.file == undefined) {
        var datas = [pname, pcategory, pprice, pstock, pid];
        var sql = "UPDATE products SET pname=?, pcategory=?, pprice=?, pstock=? WHERE pid=?";
        conn.query(sql, datas, function(err, result) {
            if(err) console.error(err);
            if(result.affectedRows == 0) {
                res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
            } else {
                res.redirect('/board/read/' + pid);
            }
        });
    } else {
        var pimage = req.file.originalname;
        var datas = [pname, pcategory, pprice, pstock, pimage, pid];
        var sql = "UPDATE products SET pname=?, pcategory=?, pprice=?, pstock=?, pimage=? WHERE pid=?";
        conn.query(sql, datas, function(err, result) {
            if(err) console.error(err);
            if(result.affectedRows == 0) {
                res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
            } else {
                res.redirect('/board/read/' + pid);
            }
        });
    }   
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

// 공지/이벤트 리스트 조회(관리자 페이지)
router.get('/eventlist/:page', function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    var page = req.params.page;
    var sql = "SELECT * FROM events";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // delete_complete : 삭제 버튼으로 인해 이 페이지로 돌아오는 경우, true로 render되어 들어온다.
        res.render('eventlist', {title: '이벤트/공지 리스트', rows: rows, delete_complete : false});
    });
});

// /list로 접근 시
router.get('/eventlist', function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    res.redirect('/board/eventlist/1');
});

// 공지/이벤트 상세보기
router.get('/eventread/:eid', function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    var eid = req.params.eid;
    var sql = "SELECT eid, title, content, start, end, eimage FROM events WHERE eid = ?";
    conn.query(sql, [eid], function(err, row) {
        if(err) console.error(err);
        res.render('eventread', {title: "공지/이벤트 상세", row:row[0]});
    });
});

// 공지/이벤트 등록
router.get('/eventwrite', function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    if(req.session) {
        console.log("세션")
        console.log(req.session)
      }
      if (req.session.isAdmin == 1) {
        res.render('eventwrite', {title : "공지/이벤트 등록", session: req.session});
      }
      else {
          console.log("접근 권한이 없습니다")
          res.redirect('/');
      }
});

// 공지/이벤트 등록
router.post('/eventwrite', upload.single('eimage'), function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    var title = req.body.title;
    var content = req.body.content;
    var start = req.body.start;
    var end = req.body.end;
    var eimage = req.file.originalname;
    var datas = [title, content, start, end, eimage];

    var sql = "INSERT INTO events(title, content, start, end, eimage) VALUES(?, ?, ?, ?, ?)";
    conn.query(sql, datas, function(err, rows) {
        if(err) console.log("err : " + err);
        // 등록 완료 후 어느 화면으로 갈 것인가?
        res.redirect('/board/eventlist');
    });
});

// 공지/이벤트 수정
router.post('/eventupdate', upload.single('newimage'), function(req, res, next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
      
    var eid = req.body.eid;
    var title = req.body.title;
    var content = req.body.content;   
    var start = req.body.start;
    var end = req.body.end;
    
    if(req.file == undefined) {       
        
        if(!start) {
            // 시작일,종료일,이미지 변경하지 않음
            if(!end) {
                var datas = [title, content, eid];
                var sql = "UPDATE events SET title=?, content=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            // 시작일,이미지 변경하지 않음. 종료일 변경됨
            } else {
                var datas = [title, content, end, eid];
                var sql = "UPDATE events SET title=?, content=?, end=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            }
        
        } else {
            // 종료일,이미지 변경하지 않음. 시작일 변경됨
            if(!end) {
                var datas = [title, content, start, eid];
                var sql = "UPDATE events SET title=?, content=?, start=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            // 이미지 변경하지 않음. 시작일,종료일 변경됨
            } else {
                var datas = [title, content, start, end, eid];
                var sql = "UPDATE events SET title=?, content=?, start=?, end=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            }
        }       
    } else {
        var eimage = req.file.originalname;
        if(!start) {
            // 시작일,종료일 변경하지 않음. 이미지 변경됨
            if(!end) {
                var datas = [title, content, eimage, eid];
                var sql = "UPDATE events SET title=?, content=?, eimage=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            // 시작일 변경하지 않음. 종료일,이미지 변경됨
            } else {
                var datas = [title, content, end, eimage, eid];
                var sql = "UPDATE events SET title=?, content=?, end=?, eimage=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            }
        } else {
            // 종료일 변경하지 않음. 시작일,이미지 변경됨
            if(!end) {
                var datas = [title, content, start, eimage, eid];
                var sql = "UPDATE events SET title=?, content=?, start=?, eimage=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            // 시작일,종료일,이미지 변경됨
            } else {
                var datas = [title, content, start, end, eimage, eid];
                var sql = "UPDATE events SET title=?, content=?, start=?, end=?, eimage=? WHERE eid=?";
                conn.query(sql, datas, function(err, result) {
                    if(err) console.error(err);
                    if(result.affectedRows == 0) {
                        res.send("<script>alert('입력 양식에 에러가 있습니다.');history.back();</script>");          
                    } else {
                        res.redirect('/board/eventread/' + eid);
                    }
                });
            }
        }
    }
});

// 공지/이벤트 삭제
router.post('/eventdelete',function(req,res,next) {
    if (req.session.isAdmin != 1) {
        res.redirect('/');
      }
    var sql = "SELECT * FROM events";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        // rows에 상품 정보를 담아 list.ejs로 보낸다.
        res.render('eventlist', {title: '공지/이벤트 리스트', rows: rows, delete_complete : true});
    });
});


module.exports = router;