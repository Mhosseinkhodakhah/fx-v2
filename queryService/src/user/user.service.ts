import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userInterFace } from './entities/user.entity';
import { transAction } from 'src/wallet/entities/trans-action.entity';
import { subsCribers } from './entities/subscribers.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisHandlerService } from 'src/redis-handler/redis-handler.service';

@Injectable()
export class UserService {
    constructor( @InjectModel('user') private userModel: Model<userInterFace>, 
    @InjectModel('transAction') private transActionModel: Model<transAction>, 
    @InjectModel('subscribers') private subScribersModel: Model<subsCribers>,
    private cacheManager:RedisHandlerService
) { }


    async getExploreData(req: any, res: any) {
        let cacheData = await this.cacheManager.get('getExploreData')
        if (cacheData){
            return {
                message: 'its test for fucking this sheet',
                statusCode: 200,
                data: cacheData
            }
        }
        const mostPopular = await this.userModel.find({ role: 3 }).sort({ 'subScriber.length': -1 }).limit(5)
        const topRated = await this.userModel.find({ role: 3 }).sort({ points: -1 }).limit(5)
        const topLowestFee = await this.userModel.find({ role: 3 }).sort({ subScriberFee: 1 }).limit(5)
        this.cacheManager.set('getExploreData',{
            mostPopular: mostPopular,
            topRated: topRated,
            topLowestFee: topLowestFee
        }).then(()=>{
            console.log('cache heat done')
        })
        return {
            message: 'its test for fucking this sheet',
            statusCode: 200,
            data: {
                mostPopular: mostPopular,
                topRated: topRated,
                topLowestFee: topLowestFee
            }
        }
    }



    async getUserInfo(req: any, res: any) {
        try {
            const userId = req.user._id
            let cacheData = await this.cacheManager.get(`getUserInfo-${userId}`)
            if (cacheData){
                return {
                    message: 'get user info for profile',
                    statusCode: 200,
                    data: cacheData,
                }
            }
            const user = await this.userModel.findById(userId)
            this.cacheManager.set(`getUserInfo-${userId}` , user)
            return {
                message: 'get user info for profile',
                statusCode: 200,
                data: user,
            }
        } catch (error) {
            return {
                message: 'internal service error occured',
                statusCode: 500,
                error: `${error}`
            }
        }
    }

    async getHomePageInfo(req: any, res: any) {
        const userId = req.user._id;
        // const leaders = await this.userModel.find({$and:[{role : 3} , {subScriber : {$in : userId}}]})
        let cacheData = await this.cacheManager.get(`getHomePageInfo-${userId}`)
        if (cacheData){
            return {
                message: 'getting leaders and transAction data of user',
                statusCode: 200,
                data: cacheData,
            }
        }
        const leaders = await this.userModel.find({ role: 3 }).limit(4).select(['-password', '-refreshToken'])
        const transActions = await this.transActionModel.find({ $or: [{ receiver: userId }, { payer: userId }] })
        this.cacheManager.set(`getHomePageInfo-${userId}`,{ leaders: leaders, transActions: transActions }).then(()=>{
            console.log('cache heat done!')
        })
        return {
            message: 'getting leaders and transAction data of user',
            statusCode: 200,
            data: { leaders: leaders, transActions: transActions },
        }
    }


    async usersBranches(req: any, res: any) {
        const userData = await this.userModel.findById(req.user._id).select(['username', 'role', 'profile'])
        // const leaders = userData.leaders
        const allLeaders = await this.userModel.find({ $and: [{ role: 3 }, { 'subScriber.userId': { $in: [req.user._id] } }] }).select(["username", 'profile'])
        console.log('sent user data ...',)
        if (userData.role == 3) {
            allLeaders.push(userData)
        }
        return {
            message: 'get all branches',
            statusCode: 200,
            data: allLeaders
        }
    }



    async getSpecificLeader(req: any, res: any, leaderId: string) {
        const user = req.user._id
        let cacheData = await this.cacheManager.get(`getSpecificLeader-${user}-${leaderId}`)
        if (cacheData){
            return {
                message: 'leader data already aggregate!',
                statusCode: 200,
                data : cacheData
            }
        }
        const leader = await this.userModel.findById(leaderId).select('-password').select('-refreshToken')
        if (!leader) {
            return {
                message: 'this leader is not exist on database!',
                statusCode: 404,
                error: 'resource not found'
            }
        }

        let subscribed = 0
        let follow = false
        let followers = await this.userModel.find({ followings: { "$in": [{ id: leaderId }] } }).select('profile').limit(4)
        let subScribers = await this.userModel.find({ leaders: { "$in": [leaderId] } }).select('profile').limit(4)

        const subScribe = await this.subScribersModel.findOne({ $and: [{ userId: user }, { leaderId: leaderId }] })

        if (subScribe) {
            subscribed = subScribe.status + 1
        }

        if (leader.followers.includes(user)) {
            follow = true
        }

        const fee = []

        leader.discount.forEach(elem => {
            if (elem['status'] == 0) {
                const data = {
                    planName: 'monthly',
                    month: 1,
                    discount: elem['discount'],
                    subScriberFee: leader.subScriberFee,
                    planCost: leader.subScriberFee - (elem['discount']),
                }
                fee.push(data)
            }
            if (elem['status'] == 1) {
                const data = {
                    planName: '2 month',
                    month: 2,
                    discount: elem['discount'],
                    subScriberFee: leader.subScriberFee,
                    planCost: leader.subScriberFee - (elem['discount']),
                }
                fee.push(data)
            }
            if (elem['status'] == 2) {
                const data = {
                    planName: '3 month',
                    month: 3,
                    discount: elem['discount'],
                    subScriberFee: leader.subScriberFee,
                    planCost: leader.subScriberFee - (elem['discount']),
                }
                fee.push(data)
            }

        })
        this.cacheManager.set(`getSpecificLeader-${user}-${leaderId}` , 
            { leader: leader, subScribeFee: fee, walletAddress: '123456879', subStatus: subscribed, follow: follow, followers: followers, subScribers: subScribers }
        ).then(()=>{
            console.log('cache heat done')
        })
        return {
            message: 'leader data already aggregate!',
            statusCode: 200,
            data: { leader: leader, subScribeFee: fee, walletAddress: '123456879', subStatus: subscribed, follow: follow, followers: followers, subScribers: subScribers }
        }
    }

    async searcher(req: any, res: any, search: string) {
        const reg = new RegExp(search)
        let cacheData = await this.cacheManager.get(`searcher-${search}`)
        if (cacheData){
            return {
                message: 'serch in leaders done',
                statusCode: 200,
                data: cacheData
            }
        }
        const founded = await this.userModel.find({ $and: [{ role: 3 }, { $or: [{ "firstName": { $regex: reg } }, { "lastName": { $regex: reg } }, { "email": { $regex: reg } }, { "username": { $regex: reg } }] }] }).select(['username', 'profile'])
        this.cacheManager.set(`searcher-${search}` , founded).then(()=>{
            console.log('cache heat done')
        })
        return {
            message: 'serch in leaders done',
            statusCode: 200,
            data: founded
        }
    }


    async getUser(req : any , res : any , id : string){ 
        let cacheData = await this.cacheManager.get(`getUser-${id}`)
        if (cacheData){
            return {
                message : 'get specific user done!',
                statusCode : 200,
                data : cacheData
            }
        }
        const user = await this.userModel.findById(id)
        if (!user){
            return {
                message : 'get specific user failed',
                statusCode : 404,
                error : 'account not found!'
            }
        }
        this.cacheManager.set(`getUser-${id}` , user)
        return {
            message : 'get specific user done!',
            statusCode : 200,
            data : user
        }
    }



/////////////////////////// last line     
}
