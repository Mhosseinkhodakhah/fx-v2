

interface payloadInterface {
    success : boolean
    scope : string
    message : string
    error : string | object |null
    data : string | object | null
}



export class Respons {
    constructor( req:any , res:any , statusCode : number , scope:string , message : string , error : string|object|null , data:string |object | null){
        let payload : payloadInterface = {
            success : (statusCode == 200) ? true : false,
            scope : scope,
            message : message,
            error : error,
            data : data
        }
        
        return res.status(statusCode).json(payload)
    }
}
