"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
};

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // До появления в кадре блок спрятан, поэтому без наблюдателя он
    // остался бы невидимым навсегда — в этом случае показываем сразу.
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-visible", "true");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "true");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, "--reveal-delay": `${delay}s` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
