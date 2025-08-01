export interface User {
  id: Number;
  username: String;
  password: String;
  posts: Post[];
  viewedPosts: Post[];
  profilePicture: String;
  createdAt: Date;
  updatedAt: Date;
}
export interface Post {
  id: Number;
  author: User;
  authorId: Number;
  title: String;
  content: String;
  viewedUsers: User[];
  image?: String;
  createdAt: Date;
  updatedAt: Date;
}
