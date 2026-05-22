export type IEmbeddedPost = {
  src: string;
  className?: string;
};
export default function EmbeddedPost({ src, className }: IEmbeddedPost) {
  return (
    <>
      <blockquote
        // @ts-ignore reason="React getting too big for it's boots"
        class='instagram-media'
        className={className}
        data-instgrm-permalink={`https://www.instagram.com/reel/${src}/?utm_source=ig_embed&amp;utm_campaign=loading`}
        data-instgrm-version='14'
      ></blockquote>
      <script async src='//www.instagram.com/embed.js'></script>
    </>
  );
}
