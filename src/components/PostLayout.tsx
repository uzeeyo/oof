import IPost from "../lib/types/IPost";
import Secret from "./Secret";

interface Props {
  posts: IPost[];
}

const PostLayout = ({ posts }: Props) => {
  return (
    <div className={`flex flex-col flex-grow flex-gap p-7 items-center`}>
      {posts.map((post) => (
        <div>
          <Secret key={post.id} secret={post} />
        </div>
      ))}
    </div>
  );
};

export default PostLayout;
