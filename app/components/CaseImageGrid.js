'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CaseImageGrid({ images, title }) {
  const rootRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const imageNodes = gsap.utils.toArray('.case-grid-image');

      imageNodes.forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 1.1, transformOrigin: '50% 50%' },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: node,
              start: 'top 100%',
              end: 'top 12%',
              scrub: 1.8,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, rootRef);

    const offLenisScroll = window.lenis?.on?.('scroll', ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      if (offLenisScroll) offLenisScroll();
      ctx.revert();
    };
  }, [images]);

  return (
    <div ref={rootRef} className="grid caseImageGrid">
      {images.map((src, index) => (
        <figure key={src} className="case-grid-item">
          <Image
            className="case-grid-image"
            src={src}
            alt={`${title} ${index + 1}`}
            width={1200}
            height={1800}
            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
          />
        </figure>
      ))}
    </div>
  );
}
