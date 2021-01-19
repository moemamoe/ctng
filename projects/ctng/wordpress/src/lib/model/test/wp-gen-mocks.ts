import { WPImage } from '../wp-image';
import { WPPost } from '../wp-post';

export function createPostMock(id: number, acfObject: any, slug: string = 'Test Post Slug'): WPPost {
  return {
    id: id,
    title: { rendered: 'Test Post Title' },
    content: { rendered: 'Test Post Content' },
    type: 'Test Post Type',
    status: 'Test Post Status',
    date: '2018-08-17T15:37:28',
    modified: '2018-08-17T15:37:28',
    slug: slug,
    link: 'Test Post Link',
    menu_order: 1,
    featured_media: 2,
    acf: acfObject,
  };
}

export function createImageMock(url?: string): WPImage {
  return {
    ID: 22,
    id: 22,
    alt: 'alt text',
    author: 1,
    description: 'image description',
    filename: 'file name',
    filesize: 23000,
    height: 400,
    width: 300,
    icon: 'image icon',
    link: 'image link',
    date: 'image date',
    modified: 'image date modified',
    name: 'image name',
    subtype: 'image subtype',
    title: 'image title',
    type: 'image type',
    uploaded_to: 1,
    url: url ? url : 'http://image.url.de',
    caption: 'image caption',
    sizes: [],
  };
}
