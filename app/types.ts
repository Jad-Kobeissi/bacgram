export interface User {
  id: Number;
  username: String;
  password: String;
  posts: Post[];
  viewedPosts: Post[];
  profilePicture: String;
  grade: Number;
  likedPosts: Post[];
  followers: User[];
  following: User[];
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
  likes: Number;
  likedUsers: User[];
  createdAt: Date;
  updatedAt: Date;
}
