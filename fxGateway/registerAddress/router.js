const express = require('express')
const { updateAddress } = require('./controler')


const router = express.Router()


router.put('/updateAddress' , updateAddress)



module.exports = router