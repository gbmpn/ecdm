'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const isModifiedEvent = (event) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const isIgnoredHref = (href) =>
  !href ||
  href.startsWith('#') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('javascript:');

export default function NavigationTransition() {
  const router = useRouter();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedEvent(event)) return;

      const anchor = event.target.closest('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href');
      if (isIgnoredHref(rawHref)) return;

      const url = new URL(anchor.href, window.location.href);
      const isSameOrigin = url.origin === window.location.origin;
      if (!isSameOrigin) return;

      const currentUrl = new URL(window.location.href);
      const isSameRoute =
        currentUrl.pathname === url.pathname &&
        currentUrl.search === url.search &&
        currentUrl.hash === url.hash;
      if (isSameRoute) return;

      event.preventDefault();

      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      const navigate = () => router.push(nextHref);

      if (!prefersReducedMotion.matches && document.startViewTransition) {
        document.startViewTransition(navigate);
      } else {
        navigate();
      }
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
    };
  }, [router]);

  return null;
}
