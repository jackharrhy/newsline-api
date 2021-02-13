export interface IPostDetails {
  sender: string;
  from: string;
  subject: string | null;
  contentType: string;
  text: string;
  htmlUrl: string | null;
  html: string | null;
}

export interface IPost {
  title: string;
  url: string;
  date: Date;
  details: IPostDetails | null;
}

export interface IMonth {
  name: string;
  url: string;
  posts: IPost[];
}

export interface IPostOverview {
  date: string;
  title: string;
  sender: string;
  from: string;
  contenttype: string;
  htmlurl: string;
}
