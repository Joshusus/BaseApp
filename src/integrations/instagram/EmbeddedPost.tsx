import classNames from '~/helpers/classNames';
export type IEmbeddedPost = {
  src: string;
  className?: string;
};
export default function EmbeddedPost({ src, className }: IEmbeddedPost) {
  return (
    <>
      <blockquote
        className={classNames('instagram-media', className ?? '')}
        data-instgrm-permalink={`https://www.instagram.com/reel/${src}/?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
      ></blockquote>
      <script async src="//www.instagram.com/embed.js"></script>
    </>
  );
}
