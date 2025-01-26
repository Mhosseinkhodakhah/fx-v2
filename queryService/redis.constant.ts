import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";




export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [],
    useFactory: async () => {
        const store = await redisStore({
            socket: {
                host: 'localhost',
                port: 6379,
            },
        });
        return {
            store: () => store,
        };
    },
};