export interface WpDataMock {
  [language: number]: {
    [customPostType: string]: WPPost[];
  };
}
export interface WPPost {
  id: number;
  title: WPPostContent;
  content: WPPostContent;
  type: string;
  status: string;
  date: string;
  modified: string;
  slug: string;
  link: string;
  menu_order: number;
  featured_media: number;
  acf: any;
}

export interface WPPostContent {
  rendered: string;
}
