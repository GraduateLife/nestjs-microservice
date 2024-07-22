import { Expose } from 'class-transformer';
import { BlogStatus, IBlog } from './blog.entity';
import { useTemplate } from '@app/restful';
import { ArrayWildCard } from '@app/common/types/Array';

const { Methods } = useTemplate('default');

const theOnes = ArrayWildCard.bind(null, /One$/);

export class BlogView implements IBlog {
  @Expose({ groups: Methods })
  authorId: string;

  @Expose({ groups: Methods })
  description: string;

  @Expose({ groups: Methods })
  coverImgUrl: string;

  @Expose({ groups: Methods })
  status: BlogStatus;

  @Expose({ groups: Methods })
  commentCount: number;

  @Expose({ groups: Methods })
  viewCount: number;

  @Expose({ groups: Methods })
  shareCount: number;

  @Expose({ groups: Methods })
  tags: string[];

  @Expose({ groups: Methods })
  publishAt: Date;

  @Expose({ groups: Methods })
  deletedAt: Date;
  @Expose({ groups: Methods })
  _id;

  @Expose({ groups: theOnes(Methods) })
  title;

  @Expose({ groups: theOnes(Methods) })
  content;

  @Expose({ groups: Methods })
  updatedAt;

  @Expose({ groups: Methods })
  createdAt;
}
