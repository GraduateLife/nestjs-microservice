import { ApplyMethodDecorators } from '@app/common/decorators/ApplyMethodDecorators';
import { Type, Controller, UsePipes, UseInterceptors } from '@nestjs/common';
import {
  DefaultParamMagics,
  DefaultRestfulStyle,
  DefaultValidationGroup,
} from '../templates/Default';
import { RestfulValidationPipe } from '../globals/RestfulPipe';
import { RestfulSerializer } from '../globals/RestfulSerializer';

const RestfulController =
  (useTemplate: string, routeName: string, serializationView: Type<any>) =>
  (TGT: Type<any>) => {
    ApplyMethodDecorators(getRestfulStyle(useTemplate))(TGT);
    UsePipes(new RestfulValidationPipe(false))(TGT);
    UseInterceptors(new RestfulSerializer(serializationView))(TGT);
    // CommonSerializer
    Controller(routeName)(TGT);
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

export const useTemplate = (template: string) => {
  switch (template) {
    case 'default':
      return {
        RestfulController: RestfulController.bind(null, 'default'),
        ParamMagics: DefaultParamMagics,
        validationGroups: [...DefaultValidationGroup],
      };

      break;

    default:
      break;
  }
};
