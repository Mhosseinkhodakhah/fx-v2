const cacher = require('node-cache')

const cacheHeat = new cacher()




exports.getData = (key)=>{
    return cacheHeat.get(key)
}


exports.setData = (key , val)=>{
    return cacheHeat.mset([{
        key : key,
        val : val
    }])
}


exports.deletData = (key)=>{
    cacheHeat.del(key)
}