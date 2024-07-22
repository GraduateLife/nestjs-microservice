import {
  DynamicModule,
  Inject,
  Module,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
// startupNodes: ClusterNode[], options?: ClusterOptions

export type IRedis = typeof Redis.prototype;

type HowToInject<T> = Pick<ModuleMetadata, 'imports'> & {
  inject?: any[];
  useClass?: Type<T>;
  useExisting?: Type<T>;
  useFactory?: (...args: any[]) => Promise<T> | T;
};

interface ToInjectByFactory<Q>
  extends Pick<HowToInject<Q>, 'inject' | 'useFactory'> {}

const notationToProvider = (
  notation: string,
  options: ToInjectByFactory<any>,
): Provider => {
  return {
    provide: notation,
    useFactory: options.useFactory,
    inject: options.inject,
  };
};

export const RedisCli = (connectionName: string) => {
  return Inject(connectionName);
};

@Module({})
export class useRedisModule {
  static forRoot(connectionName: string, options: RedisOptions): DynamicModule {
    const connection: Provider = {
      provide: connectionName,
      useFactory(o: RedisOptions) {
        return new Redis(o);
      },
      inject: ['to-inject-ioredis-option'],
    };

    return {
      module: useRedisModule,
      providers: [
        notationToProvider('to-inject-ioredis-option', {
          useFactory: () => options,
        }),
        connection,
      ],
      exports: [connection],
    };
  }
}
