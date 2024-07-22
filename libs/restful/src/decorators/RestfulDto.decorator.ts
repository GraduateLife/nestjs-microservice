import { ArrayIsSubset } from '@app/common/types/Array';
import { XReflect } from '@app/common/xreflect';
import { SetMetadata, Type } from '@nestjs/common';
import { useTemplate } from './RestfulController.decorator';

const DTO_METADATA_FLAG = 'DTO_METADATA_FLAG';
/**
 * @remarks for params, must inject ValidationPipe in controller impl
 */
type DtoSettings = {
  toUseTemplate: string;
  toBeLocated: 'body' | 'query';
  toBeValidatedInGroups: string[];
};

export const RestfulDto = (settings: DtoSettings) => (TGT) => {
  SetMetadata(DTO_METADATA_FLAG, settings)(TGT);
  return TGT;
};

export const isSupposedToBeRestfulDto = (TGT: Type<any>) => {
  const mda = XReflect.getHattedMetadata(TGT, DTO_METADATA_FLAG) as DtoSettings;
  if (!mda) {
    console.log('it does not contain metadata');
    return false;
  }

  return true;
};

export const isValidRestfulDto = (TGT: Type<any>) => {
  const mda = XReflect.getHattedMetadata(TGT, DTO_METADATA_FLAG) as DtoSettings;
  if (!mda) {
    console.log('it does not contain metadata');
    return false;
  }

  if (!['body', 'query'].includes(mda.toBeLocated)) {
    console.log('wrong location');
    return false;
  }
  const { Methods } = useTemplate(mda.toUseTemplate);
  if (!ArrayIsSubset(mda.toBeValidatedInGroups, [...Methods], 'strict')) {
    console.log(`in dto ${TGT} got groups `, mda.toBeValidatedInGroups);
    console.log(`but in template ${mda.toUseTemplate} want `, Methods);
    console.log('wrong groups');
    return false;
  }

  return true;
};
export const getRestfulDtoMetadata = (
  TGT: Type<any>,
): DtoSettings & { dtoName: string } => {
  const metaData = XReflect.getHattedMetadata(TGT, DTO_METADATA_FLAG);
  const dtoName = TGT.name;
  return { dtoName, ...metaData };
};
