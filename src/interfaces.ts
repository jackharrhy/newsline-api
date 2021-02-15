export interface IPostDetails {
  id: string;
  sender: string;
  from: string;
  subject: string | null;
  contentType: string;
  text: string;
  htmlUrl: string | null;
  html: string | null;
}

export type PostTitle = string;
export type PostUrl = string;

export interface IPost {
  id: string;
  title: PostTitle;
  url: PostUrl;
  date: Date;
  details: IPostDetails | null;
}

export interface IMonth {
  name: string;
  url: string;
  posts: IPost[];
}

export interface ISqlPostOverview {
  id: string;
  date: string;
  title: string;
  url: string;
  sender: string;
  from: string;
  contenttype: string;
  htmlurl: string;
}

export interface ISqlPostDetails {
  id: string;
  sender: string;
  from: string;
  subject: string;
  contenttype: string;
  text: string;
  htmlurl: string;
  html: string;
}
