export interface IPostDetails {
  sender: string;
  from: string;
  subject: string;
  contentType: string;
  text: string;
  htmlUrl: string;
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
