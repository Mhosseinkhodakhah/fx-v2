export interface refreshToken {
    email: string
}



export interface tokenInterface {
    _id: any,
    username: string,
    role: number,
    suspend: boolean,
    email: string,
    wallet: string,
    region: string,
    profile: string,
    level: number,
    leaders: string[]
}