import React from "react";
import { useRouter } from "@tanstack/react-router";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean; scroll?: boolean };

const Link = React.forwardRef<HTMLAnchorElement, Props>(function Link({ href, onClick, prefetch: _p, scroll: _s, ...rest }, ref) {
  const router = useRouter();
  return (
    <a
      ref={ref}
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || rest.target === "_blank") return;
        if (!href.startsWith("/")) return;
        e.preventDefault();
        router.history.push(href);
        window.scrollTo(0, 0);
      }}
    />
  );
});
export default Link;
