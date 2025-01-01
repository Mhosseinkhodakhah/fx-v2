const { getData, deletData, setData } = require("./caching")




exports.updateAddress = async(req , res , next)=>{
    const Address = req.body.Address
    if (getData('address')){
        deletData('address')
        setData([{
            key : 'address',
            val : Address
        }])
    }else{
        setData([{
            key : 'address',
            val : Address
        }])
    }
}

