const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");

//Load User model
const User = require("../models/User");
const gUser = require("../models/gUser");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            //Match User
            User.findOne({ email: email })
                .then(user => {
                    console.log("In Local");
                    if (!user) {
                        return done(null, false, { message: "This email is not registered" });
                    }
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: "Password is Incorrect" });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://zapmail-flipr-hackathon.herokuapp.com/auth/google/callback',
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
            }
            try {
                let user = await gUser.findOne({ googleId: profile.id });
                if (user) {
                    console.log("In Google");
                    done(null, user);
                }
                else {
                    console.log("In Google");
                    user = await gUser.create(newUser);
                    done(null, user);
                }
            }
            catch (err) {
                console.error(err);
            }
            // gUser.findOne({ googleId: profile.id })
            //     .then(user => {
            //         console.log("In Google");
            //         console.log(user);
            //         if (user) {
            //             return done(null, user);
            //         }
            //         else {
            //             user = gUser.create(newUser);
            //             return done(null, user);
            //         }
            //     })
            //     .catch(err => console.error(err));
        }
    ));
    passport.serializeUser(function (user, done) {
        // console.log("Serialize");
        // console.log(user);
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        // console.log("Deserialize");
        // console.log(user);
        // console.log(user.googleId);
        // console.log(user._id);
        if (user.googleId != undefined) {
            gUser.findById(user._id, function (err, user) {
                done(err, user);
            })
        }
        else {
            User.findById(user._id, function (err, user) {
                done(err, user);
            })
        }
    });
}