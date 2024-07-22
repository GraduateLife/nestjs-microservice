import { DynamicModule, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

const def = {
  maxRetries: 10,
  requestTimeout: 60000,
  pingTimeout: 60000,
  sniffOnStart: true,
  auth: {
    username: 'elastic',
    password: 'changeme',
  },
};

// apiKey: {
//     id: 'gMMfq5ABE30utUD7dvFt',
//     name: 'got',
//     api_key: 'yH94He6ZT3qY5CV7OTMGnA',
//     encoded:
//       'Z01NZnE1QUJFMzB1dFVEN2R2RnQ6eUg5NEhlNlpUM3FZNUNWN09UTUduQQ==',
//     beats_logstash_format: 'gMMfq5ABE30utUD7dvFt:yH94He6ZT3qY5CV7OTMGnA',
//   },

@Module({})
export class useElasticModule {
  static forRoot(url: string): DynamicModule {
    return ElasticsearchModule.register({
      node: url,
      sniffOnStart: true,
      maxRetries: 10,
      requestTimeout: 60000,
      pingTimeout: 60000,
      //   auth: { username: 'ecma', password: '123456' },
    });
  }
}
