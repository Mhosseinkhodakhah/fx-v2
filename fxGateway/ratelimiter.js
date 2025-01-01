//this middleware just set ratelimiter for each ip that call apis



// holding requests count per ip 
const reqCount = {}


//main limiter function
const limiter = (req , res , next)=>{
    //getting user IP at first 
    //but it may not be very correct so you should make it specefic
    const IP = req.ip;

    // add IP to the reqCount or IP in reqCount must be increase 1 
    reqCount[IP] = (reqCount[IP] || 0) + 1;


    // block the ip if its requests be more than 50 
    // although we must consider time for each ip in future
    if ( reqCount[IP] > 1500 ){
        res.status(429).json(
            {
                code: 429,
                status: "Error",
                message: "Rate limit exceeded.",
                data: null,
            }
        )
    }
    next()
}



module.exports = limiter;
