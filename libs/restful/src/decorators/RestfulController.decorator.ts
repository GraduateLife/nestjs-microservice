import { ApplyMethodDecorators } from '@app/common/decorators/ApplyMethodDecorators';
import {
  Type,
  Controller,
  UsePipes,
  UseInterceptors,
  SerializeOptions,
} from '@nestjs/common';
import {
  DefaultParamMagics,
  DefaultRestfulStyle,
  Methods,
} from '../templates/Default';
import { RestfulValidationPipe } from '../globals/RestfulPipe';
import { RestfulSerializer } from '../globals/RestfulSerializer';
import { ApiTags } from '@nestjs/swagger';

const formatRouteName = (routeName: string) => {
  if (routeName.startsWith('/')) routeName = routeName.split('/')[1];
  return routeName
    .split('')
    .map((char, idx) => (idx === 0 ? char.toUpperCase() : char))
    .join('');
};

const ToBindController =
  (
    restfulStyleName: string,
    routeName: string,
    serializationView: Type<any>,
    extraDecorators?: Record<string, MethodDecorator[]>,
  ) =>
  (TGT: Type<any>) => {
    ApplyMethodDecorators(getRestfulStyle(restfulStyleName))(TGT);

    UsePipes(new RestfulValidationPipe(true))(TGT);
    UseInterceptors(new RestfulSerializer(serializationView))(TGT);
    // CommonSerializer
    Controller(routeName)(TGT);
    ApiTags(
      formatRouteName(routeName) +
        ` (created by RestfulController of template: ${restfulStyleName})`,
    )(TGT);
    if (extraDecorators) {
      ApplyMethodDecorators(extraDecorators)(TGT);
    }
    return TGT;
  };

const getRestfulStyle = (templateKey: string) => {
  switch (templateKey) {
    case 'default':
      return DefaultRestfulStyle;

    default:
      break;
  }
};

export const SkipViewSerialization = () => SerializeOptions({});
export const JoinViewSerialization =
  (asGroups?: string[]) => (TGT, Key, descriptor) => {
    if (!asGroups) {
      asGroups = [Key];
    }
    SerializeOptions({ groups: asGroups })(TGT, Key, descriptor);
  };

export const useTemplate = (template: string) => {
  switch (template) {
    case 'default':
      return {
        RestfulController: ToBindController.bind(null, 'default'),
        ParamMagics: DefaultParamMagics,
        Methods: [...Methods],
      };

    default:
      break;
  }
};
