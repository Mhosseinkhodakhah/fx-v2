// configuting the gateway for routing the requests 
// this is the main source for gateway that rout the requests to the microservices

///////////////////////////////////////////////////////////////////////////////////////

// call all dependencies 
const express = require('express')
const cookieparser = require('cookie-parser')
const retelimiter = require('./ratelimiter')  //this module is limiting the requests rate for each user 
require('dotenv').config({path : './config/config.env'}) 
const winston = require("winston"); // this packages for logging the requests
const expressWinston = require("express-winston");
const responseTime = require("response-time"); //this package for use the response time
const rateLimit = require("express-rate-limit") //this package for limiting the all requests rate that come to server
const cors = require('cors') // this package for securing the requests
const helmet = require('helmet') // this package for securing the requests
const xss = require('xss-clean') // this package for preventing XSS attacks by sanitizing user input
const hpp = require('hpp') //this package for preventing HTTP Parameter Pollution vulnerability
const routes =  require('./proxies') // all proxies define in this module
const { createLogger, format, transports } = require('winston');
const router = require('./registerAddress/router');
const { combine, timestamp, label, prettyPrint } = format;
const app = express();



// running app on port
const port = process.env.PORT || 8000;


const server = app.listen(port , (err)=>{
    console.log('gateway is listening to requests...')
})


process.on('unhandledRejection' , (error)=>{
  console.log('error occured' , error )
})


process.on('uncaughtException' , (error)=>{
  console.log('error occured' , error )
})


// server.requestTimeout = 10000

// securing connection 
app.disable("x-powered-by");
app.use(cors());
// app.use(helmet());
app.use(xss())
app.use(hpp())



// set logger
app.use(                
  expressWinston.logger({
    transports: [new winston.transports.Console() , new (winston.transports.File)({filename: 'myLogs.log' })],
    format: format.combine(
      label({ label: 'right meow!' }),
      timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      prettyPrint()
    ),
    statusLevels: true,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);



 // inside logger!!!!
 winston.configure({
  format : format.combine(
    
    label({ label: 'right meow!' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    prettyPrint()
  ),
  transports: [
      new (winston.transports.File)({filename: 'inside.log' }),
      // new winston.transports.Console()
    ],
})

////////////////////////////////////////////////////////////////////////////?
// * this module is for seting all rate limiting to requests!!!!! 
////////////////////////////////////////////////////////////////////////////?
// set ratelimiting for all requests 
// app.use(rateLimit({
//       windowMs: 15 * 60 * 1000, // 15 minutes
//       max: 5, // 5 calls
// }))




// making instance of proxy module 
const rooter = new routes()



// geting Address from service registrator
app.use('/addresses' , router)                                                  // update address by service Registrator

app.get('/geturl' , (req , res , next)=>{
  return res.status(200).json({
    success : true,
    url : 'https://fx-leader-alimh17s-projects.vercel.app/'
  })
})


app.use('/test' , (req , res , next)=>{
  res.send('the gateway is running successfully.....')
})




// routing to microservices 
app.use("/api/getUsers" , rooter.proxy(process.env.USER_G_SERVICE));        // routing the req to get user service

app.use("/api/setUsers" , rooter.proxy(process.env.USER_S_SERVICE));        // routing the req to set user service

app.use("/api/v2/setUsers" , rooter.proxy(process.env.USER_V2));        // routing the req to get user service

app.use("/api/getContent" , rooter.proxy(process.env.CONTENT_G_SERVICE) );  // routing the req to get content service

app.use("/api/setContent" , rooter.proxy(process.env.CONTENT_S_SERVICE) );  // routing the req to set content service

app.use("/api/setWallet" , rooter.proxy(process.env.WALLET_S_SERVICE) );     // routing the req to set content service

app.use("/api/getWallet" , rooter.proxy(process.env.WALLET_G_SERVICE) );     // routing the req to get content service

app.use("/api/getSignal" , rooter.proxy(process.env.SIGNAL_G_SERVICE) );     // routing the req to get signal service

app.use("/api/setSignal" , rooter.proxy(process.env.SIGNAL_S_SERVICE) );     // routing the req to set signal service

app.use("/api/getAdmin" , rooter.proxy(process.env.ADMIN_G_SERVICE) );       // routing the req to get admin service

app.use("/api/setAdmin" , rooter.proxy(process.env.ADMIN_S_SERVICE) );       // routing the req to set admin service

app.use("/api/setStory" , rooter.proxy(process.env.STORY_S_SERVICE) );       // routing the req to set admin service

app.use("/api/getStory" , rooter.proxy(process.env.STORY_G_SERVICE) );       // routing the req to get story service

app.use("/api/setTask" , rooter.proxy(process.env.TASK_SERVICE) );       // routing the req to get story service
