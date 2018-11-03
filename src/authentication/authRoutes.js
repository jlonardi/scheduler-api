const express = require('express');
const passport = require('passport');

const router = express.Router();
const { isAuthenticated } = require('../utils/middlewares');

router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return res.sendStatus(200);
    });
  }
});

router.get('/user', isAuthenticated, (req, res) => res.json(req.user));

router.post(
  '/mobile/google/login',
  passport.authenticate('bearer'),
  (req, res) => {
    res.json({ all: 'ok' });
  });

module.exports = router;
