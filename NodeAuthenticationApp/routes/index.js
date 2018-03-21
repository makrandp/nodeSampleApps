const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

// Home Page - Dashboard
router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('index');
});

// Login Form
router.get('/login', (req, res, next) => {
  if (req.isAuthenticated()) { //this will avoid user from logging in again if he is already logged in
    res.render('index');
  } else {
    res.render('login');
  }
});

// Register Form
router.get('/register', (req, res, next) => {
  res.render('register');
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

// Process Register
router.post('/register', validateData, (req, res, next) => {

  passport.authenticate('sign-up', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  })(req, res, next);

    // const newUser = new User({
    //   name: req.body.name,
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: req.body.password
    // });
    //
    // User.registerUser(newUser, (err, user) => {
    //   if (err) throw err;
    //   req.flash('success_msg', 'You are registered and can log in');
    //   res.redirect('/login');
    // });

});

//local strategy for signup(register)

passport.use('sign-up',new LocalStrategy( {
        passReqToCallback : true // will pass req to callback
    },
  function (req,username, password, done) {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (user) {
        return done(null, false, {
          message: 'Username Already exists'
        });
      }else{
        const newUser = new User({
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        });

        User.registerUser(newUser, (err, user) => {
          if (err) throw err;
          req.flash('success_msg', 'You are registered and can log in');
          //res.redirect('/login');
        return done(null, user);
        });

      }
    });

}));

// Local Strategy
passport.use('sign-in',new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return done(null, false, {
        message: 'No user found'
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Wrong Password'
        });
      }
    });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

// Login Processing
router.post('/login', (req, res, next) => {
  passport.authenticate('sign-in', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});



// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not authorized to view that page');
    res.redirect('/login');
  }
}

function validateData(req,res,next){
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
      next();
    }
}
module.exports = router;
