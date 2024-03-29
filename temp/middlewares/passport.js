const User = require("../database/register");
const {SECRET} = require("../config");
const {Strategy , ExtractJwt } = require("passport-jwt");
const passport = require("passport");

const opts = {
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:SECRET
};

module.exports = passport =>{
    passport.use(
        new Strategy(opts , async(payload , done) =>{
            await User.findById(payload.user_id).then( async user => {
                if(user)
                {
                    return done(null , user);
                }
                return done(null,false);
            }).catch(err => {
                return done(null , false);
            });
        })
    );
};