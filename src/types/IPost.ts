export default interface IPost {
  readonly postID: number;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: Date;
}
