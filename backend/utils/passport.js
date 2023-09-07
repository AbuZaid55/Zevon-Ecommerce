var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const userModel = require('../models/userModel')

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
async function(accessToken, refreshToken, user,done) {
    const name = user.displayName 
    const email = user.emails[0].value
    const validated = user.emails[0].verified
    const profile = user.photos[0].value
    const password = user.displayName+user.photos[0].value
    const existUser = await userModel.findOne({email:email})
    if(!existUser){
        await userModel({name:name,email:email,validated:validated,'profile.secure_url':profile,password:password}).save()
    } 
    done(null,email)
}
));
