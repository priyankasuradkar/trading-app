const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// replace with your MongoDB connection string
const mongoDBConnectionStr = 'mongodb+srv://trading:trading@cluster0.pfcyujz.mongodb.net/google';

mongoose.connect(mongoDBConnectionStr, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(session({
    secret: 'my-super-secret-string',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const User = require('./model/user');

passport.use(new GoogleStrategy({
    clientID: '195015933397-rvrlnkudl27th254s1nkj33j298ogpia.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {

            console.log('PROFILE DETAILS ::::: ', profile._json);
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                done(null, user);
            } else {
                user = await User.create({ googleId: profile.id, displayName: profile._json.name, userName: profile._json.username, email: profile._json.email, profilePicture: profile._json.picture, accessToken: accessToken });
                done(null, user);
            }
        } catch (err) {
            console.log(err);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const userData = await User.findById(id, { displayName: 1, email: 1, profilePicture: 1, displayName: 1 });

    if (!userData) {
        done(err)
    }

    const userDetails = {
        username: userData.displayName,
        email: userData.email,
        displayName: userData.displayName,
        profilePicture: userData.profilePicture
    }.toString();

    console.log('USER DETAILS :::: ', userDetails);
    done('Logged in Successfully')
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })

);

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));