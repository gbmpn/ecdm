'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CaseAsidePin() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.caseContent');
    const aside = document.querySelector('.caseContent .caseInfos');
    const viewMore = document.querySelector('.viewMore');
    if (!section || !aside || !viewMore) return undefined;

    const media = gsap.matchMedia();

    media.add('(min-width: 992px)', () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: () => 'top top',
        endTrigger: viewMore,
        end: () => 'top bottom',
        pin: aside,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      const offLenisScroll = window.lenis?.on?.('scroll', ScrollTrigger.update);
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);

      const caseImages = section.querySelectorAll('img');
      const imageLoadHandlers = [];
      caseImages.forEach((img) => {
        if (img.complete) return;
        const onLoad = () => ScrollTrigger.refresh();
        img.addEventListener('load', onLoad);
        imageLoadHandlers.push([img, onLoad]);
      });

      ScrollTrigger.refresh();

      return () => {
        imageLoadHandlers.forEach(([img, onLoad]) => {
          img.removeEventListener('load', onLoad);
        });
        window.removeEventListener('resize', onResize);
        if (offLenisScroll) offLenisScroll();
        trigger.kill();
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
