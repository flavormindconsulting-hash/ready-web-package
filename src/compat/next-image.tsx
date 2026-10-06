import React from "react";
type Props = React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; unoptimized?: boolean; quality?: number; sizes?: string };
export default function Image({ fill, priority: _p, unoptimized: _u, quality: _q, style, ...rest }: Props) {
  return <img {...rest} style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style} />;
}
