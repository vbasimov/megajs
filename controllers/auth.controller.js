var passport = require('passport');
var User = require('../models/user.model');

var userController = {};

userController.home = function(req, res) {
  req.session.returnTo = null;
  res.render('index', { user : req.user, title: 'Реестр задолженностей' });
};

userController.register = function(req, res) {
  if (req.user) {
    res.redirect('/');
  }
  res.render('register', { title: 'Регистрация' });
};

userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { user : user, title: 'Регистрация' }); //user
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

userController.login = function(req, res) {
  if (req.user) {
    res.redirect('/');
  }
  res.render('login', { user : req.user, title: 'Авторизация' });
};


userController.doLogin = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return err; }
    if (!user) { return res.render('login', { message: 'Неверное имя пользователя или пароль', title: 'Авторизация' }); }
    req.logIn(user, function(err) {
      if (err) { return err; }
      return res.redirect(req.session.returnTo || '/');
    });
  })(req, res);
};

userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;
