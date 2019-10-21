var express = require('express');
var router = express.Router();
var pgclient = require('dao/pgHelper');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//查询列表页

router.get('/', function(req, res, next){
  if (req.cookies.islogin) {
    req.session.islogin = req.cookies.islogin;
  }
  if (req.session.islogin) {
    res.locals.islogin = req.session.islogin;
  }
  pgclient.select('userinfo','','',function(result){
    if (result[0] === undefined) {
      res.send('没有用户信息！');
    }
    else{
      res.render('users', {title: '用户管理', datas: result, test: res.locals.islogin});
    }
  });
});

//新增页面跳转
router.route('/add')
  .get(function(req, res){
    res.render('users_add', {title: '新增'});
  })
  .post(function(req, res){
    pgclient.save('userinfo', {'username':req.body.username,'password':req.body.password2,'email':req.body.email,'telephone':req.body.telephone}, function(err){
      pgclient.select('userinfo', {'username': req.body.username},'',function(result){
        if (result[0] === undefined) {
          res.send('添加未成功，请重新输入');
        }
        else{
          res.redirect('/users');
        }
      });
    });
  })

//删除
router.get('/del/:id', function(req, res){
  if (req.cookies.islogin) {
    req.session.islogin = req.cookies.islogin;
  }
  if (req.session.islogin) {
    res.locals.islogin = req.session.islogin;
  }
  pgclient.remove('userinfo', {'id':req.params.id},function(err){
    if (err != '') {
      res.send("删除失败：" + err);
    }
    else
    {
      res.redirect('/users');
    }
  })
});

//获取修改的用户

router.get('/toUpdate/:id', function(req, res){
  if (req.cookies.islogin) {
    req.session.islogin = req.cookies.islogin;
  }
  if (req.session.islogin) {
    res.locals.islogin = req.session.islogin;
  }
  var id = req.params.id;
  console.log(id);
  pgclient.select('userinfo', {'id':id}, '', function(result){
    if (result[0] === undefined) {
      res.send('修改失败！');
    }
    else
    {
      res.render("users_update", {title:'用户信息更新', datas: result, test:res.locals.islogin});
    }
  });
});

//修改

router.post('/update', function(req, res){
  if (req.cookies.islogin) {
    req.session.islogin = req.cookies.islogin;
  }
  if (req.session.islogin) {
    res.locals.islogin = req.session.islogin;
  }
  var id = req.body.id;
  var username = req.body.username;
  var email = req.body.email;
  var telephone = req.body.telephone;
  pgclient.update('userinfo', {'id': id}, {'username': username, 'email': email, 'telephone': telephone}, function(err){
    if (err !='') {
      res.send("修改失败：" + err);
    }
    else
    {
      res.redirect('/users');
    }
  });
});

//搜索
router.post('/search', function(req, res){
  var username = req.body.s_username;
  var telephone = req.body.s_telephone;
  if (req.cookies.islogin) {
    req.session.islogin = req.cookies.islogin;
  }
  if (req.session.islogin) {
    res.locals.islogin = req.session.islogin;
  }
  if (!username && !telephone) {
    pgclient.select('userinfo', '', '', function(result){
      if (result[0] === undefined) {
        res.send('没有用户信息！');
      }
      else
      {
        res.render('users', {title: '用户管理', datas: result, test: res.locals.islogin});
      }
    });
  }
  if (username) {
    pgclient.select('userinfo', {'username': username}, '', function(result){
      if (result[0] === undefined) {
        res.send("没有用户信息！");
      }
      else
      {
        res.render('users', {title: '用户信息查询', datas: result, test: res.locals.islogin});
      }
    });
  }
  if (telephone) {
    pgclient.select('userinfo', {'telephone': telephone}, '', function(result){
      if (result[0] === undefined) {
        res.send('没有用户信息！');
      }
      else
      {
        res.render('users', {title: '用户信息查询', datas: result, test: res.locals.islogin});
      }
    });
  }
  if (username&&telephone) {
    pgclient.select('userinfo', {'username': username, 'telephone': telephone}, '', function(result){
      if (result[0] === undefined) {
        res.send('没有用户信息！');
      }
      else
      {
        res.render('users', {title: '用户信息查询', datas: result, test: TextDecoderStream.locals.islogin});
      }
    });
  }
});

module.exports = router;