import { MongooseSerializer, ValidateObjectIdPipe } from './mapper';

export const useMongoose = () => {
  return {
    ValidateObjectIdPipe,
    MongooseSerializer,
  };
};
