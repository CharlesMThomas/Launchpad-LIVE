const passport = require('passport')
const router = require('express').Router()
const FacebookStrategy = require('passport-facebook')
const {User} = require('../db/models')
module.exports = router

  const facebookConfig = {
    clientID: '354229048320684',
    clientSecret: '9cb0cfcd2321fc399cfaee304b090714',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
  }

  const strategy = new FacebookStrategy(facebookConfig, (token, refreshToken, profile, done) => {
    const facebookId = profile.id
    const name = profile.displayName
    const email = profile.emails[0].value
    // Since our model requires a password, we stored a random string so the password
    // Could not be guessed and combined with the associated facebook email to gain access.
    const password = 'z>/[E<CVwGAma&7?';

    User.find({where: {facebookId}})
      .then(foundUser => (foundUser
        ? done(null, foundUser)
        : User.create({name, email, facebookId, password})
          .then(createdUser => done(null, createdUser))
      ))
      .catch(done)
  })

  passport.use(strategy)

  router.get('/', passport.authenticate('facebook', {scope: 'email'}))

  router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res, err) {
    console.log(err);
    // Successful authentication, redirect home.
    res.redirect('/projects');
  });
