'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlack, setIsBlack] = useState(false);

  const menuItems = [
    { href: '/?view=fullscreen', label: 'Home' },
    { href: '/?view=grid', label: 'Realisations' },
    { href: '/about', label: 'A Propos' },
    { href: '/?view=list', label: 'Publications' },
    { href: '/about', label: 'Contact' },
  ];

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const isAboutPage = pathname === '/about';
  const isCaseStudyPage = pathname.startsWith('/works/');

  useEffect(() => {
    if (isAboutPage) {
      const applyAboutHeaderColor = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        setIsBlack(isMobile);
      };

      applyAboutHeaderColor();
      window.addEventListener('resize', applyAboutHeaderColor);

      return () => {
        window.removeEventListener('resize', applyAboutHeaderColor);
      };
    }

    if (isCaseStudyPage) {
      const updateCaseHeaderColor = () => {
        const pageHeader = document.querySelector('.pageHeader');
        if (!pageHeader) {
          setIsBlack(true);
          return;
        }

        const pageHeaderBottom = pageHeader.getBoundingClientRect().bottom;
        setIsBlack(pageHeaderBottom <= 0);
      };

      updateCaseHeaderColor();

      const offLenisScroll = window.lenis?.on?.('scroll', updateCaseHeaderColor);
      const onNativeScroll = () => updateCaseHeaderColor();
      const onResize = () => updateCaseHeaderColor();

      window.addEventListener('scroll', onNativeScroll, { passive: true });
      window.addEventListener('resize', onResize);

      return () => {
        if (offLenisScroll) offLenisScroll();
        window.removeEventListener('scroll', onNativeScroll);
        window.removeEventListener('resize', onResize);
      };
    }

    if (pathname !== '/') {
      setIsBlack(true);
      return undefined;
    }

    const handleViewModeChange = (event) => {
      const nextViewMode = event.detail?.viewMode;
      setIsBlack(nextViewMode !== 'fullscreen');
    };

    window.addEventListener('home-viewmode-change', handleViewModeChange);
    return () => {
      window.removeEventListener('home-viewmode-change', handleViewModeChange);
    };
  }, [pathname, isAboutPage, isCaseStudyPage]);

  return (
    <>
      <header className={!isBlack ? 'is-white' : 'is-black'}>
        <Link href="/">ecdm</Link>
        <button onClick={openMenu}>menu</button>
      </header>
      <aside className={`menu ${isMenuOpen ? 'is-open' : ''}`}>
        <button className="close-menu" onClick={closeMenu}>close</button>
        <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={item.label} style={{ '--i': index }}>
              <span className="menu-line-mask">
                <Link href={item.href} onClick={closeMenu} className="menu-line-text">
                  {item.label}
                </Link>
              </span>
            </li>
          ))}
        </ul>
        </nav>
        <footer className="menu-footer">
          <div className="col">
            <span>Contact</span>
            <a>contact@ecdm.fr</a>
            <a>+33 1 44 93 20 60</a>
            <a>38 rue du Mont Thabor, 75001, Paris  </a>
          </div>

          <div className="col">
            <span>Contact</span>
            <a>Linkedin</a>
            <a>Twitter</a>
            <a>Instagram</a>
          </div>
        </footer>
      </aside>
      <div
        className={`menu-backdrop ${isMenuOpen ? 'is-open' : ''}`}
        onClick={closeMenu}
      />
    </>
  );
}
