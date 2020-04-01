const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const users = require("./users.js");
const cfg = require("./config.js");

const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
    const strategy = new Strategy(params, function(payload, done) {
    const user = users[payload.id] || null;
    if (user) {
        return done(null, {id: user.id});
    } else {
        return done(new Error("User not found"), null);
    }
    });
    passport.use(strategy);
    return {
    initialize: function() {
        return passport.initialize();
    },
    authenticate: function() {
        return passport.authenticate("jwt", cfg.jwtSession);
    }
    };
};