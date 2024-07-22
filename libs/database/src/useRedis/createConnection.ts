import { Inject, Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

export const createConnectionFunction = (options: RedisOptions) => {
  return new Redis(options);
};

export const redisConnectionProviderFromConnectionName = (
  connectionName: string,
): Provider => {
  return {
    provide: connectionName,
    useFactory(options: RedisOptions) {
      return createConnectionFunction(options);
    },
    inject: [connectionName],
  };
};
