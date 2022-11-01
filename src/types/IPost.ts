export default interface IPost {
  readonly postID: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: Date;
}
