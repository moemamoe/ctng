import { WPLanguage } from '../../enum/wp-language';
import { WpDataMock, WPPost } from '../wp-post';
import { createPostMock } from './wp-gen-mocks';

export const PostMock: WPPost = createPostMock(1, {});
export const PostMockEn = createPostMock(2, {});

export const DataMock: WpDataMock = {
  [WPLanguage.de]: {
    posts: [PostMock],
  },
  [WPLanguage.en]: {
    posts: [PostMockEn],
  },
};
