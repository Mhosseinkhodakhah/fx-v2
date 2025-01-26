import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisHandlerService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get(key): Promise<any> {
        return await this.cacheManager.get(key);
    }

    async set(key, value) {
        await this.cacheManager.set(key, value);
    }

    async reset() {
        await this.cacheManager.clear();
    }   

    async del(key) {
        await this.cacheManager.del(key);
    }
}