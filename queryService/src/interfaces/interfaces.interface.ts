export interface updateUserDBInterface {
    userEmail : string;
    message : string
    data : {}
}


export interface updateWalletDataInterface{
    user : string;
    data : {};
    message : string;
}

export interface updateTaskInterface{
    mainId : string;
    task : {};
    message : string;
}


export interface updateStoryInterface{
    mainId : string;
    story : {};
    message : string
}


export interface CacheManagerOptions {
    store?:  any
    ttl?: number;
    max?: number;
    isCacheableValue?: (value: any) => boolean;
}