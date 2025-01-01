




exports.getAddress = async()=>{
    const raw = await fetch('http://localhost:8001/getAddresses' , {
        method : "GET",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
    })
    const response = raw.json()
    return response
}