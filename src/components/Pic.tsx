type PicProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  eager?: boolean;
  sizes?: string;
};

export function webpOf(src: string) {
  return src.split("?")[0].replace(/\.(png|jpe?g)$/i, ".webp");
}

export function Pic({
  src,
  alt,
  className,
  width,
  height,
  eager = false,
  sizes,
}: PicProps) {
  const clean = src.split("?")[0];
  const webp = webpOf(clean);
  const alreadyWebp = /\.webp$/i.test(clean);

  return (
    <picture>
      {alreadyWebp ? null : <source type="image/webp" srcSet={webp} sizes={sizes} />}
      <img
        className={className}
        src={clean}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        sizes={sizes}
        draggable={false}
      />
    </picture>
  );
}
