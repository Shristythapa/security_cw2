const rateLimit = require("express-rate-limit");

const loginAccountLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 5,
    message:"Too Many Request made. Please try after 15 min",
    standardHeaders:true,
    legacyHeaderr:false,
});

module.exports ={
    loginAccountLimiter
}