'use client';

import { useEffect, useMemo, useState } from 'react';
import GridView from './GridView';
import HomeSwiper from './HomeSwiper';
import Filters from './Filters';
import ListView from './ListView';

const VALID_HOME_VIEWS = new Set(['fullscreen', 'grid', 'list']);

export default function HomePageClient({ projects, initialView = 'fullscreen' }) {
  const safeInitialView = VALID_HOME_VIEWS.has(initialView) ? initialView : 'fullscreen';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState(safeInitialView);

  useEffect(() => {
    setViewMode(safeInitialView);
  }, [safeInitialView]);

  const categories = useMemo(
    () => ['all', ...new Set(projects.map((p) => p.category))],
    [projects],
  );

  const filteredProjects = useMemo(
    () => (selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory)),
    [projects, selectedCategory],
  );

  const getProjectCount = (category) => {
    if (category === 'all') return projects.length;
    return projects.filter((p) => p.category === category).length;
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('home-viewmode-change', { detail: { viewMode } }),
    );
  }, [viewMode]);

  const resetScrollTop = () => {
    if (window.lenis?.scrollTo) {
      window.lenis.scrollTo(0, { immediate: true, force: true });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const changeView = (nextView) => {
    if (nextView === viewMode) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resetScrollTop();

    if (!prefersReducedMotion && document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        setViewMode(nextView);
      });
      transition.finished.finally(() => {
        resetScrollTop();
      });
      return;
    }

    setViewMode(nextView);
    requestAnimationFrame(() => {
      resetScrollTop();
    });
  };

  return (
    <div className={`site-wrapper ${viewMode === 'fullscreen' ? 'is-fullscreen' : ''}`}>
      {viewMode !== 'fullscreen' ? (
        <Filters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          getProjectCount={getProjectCount}
        />
      ) : null}

      {viewMode === 'fullscreen' ? <HomeSwiper projects={projects} /> : null}
      {viewMode === 'grid' ? <GridView projects={filteredProjects} /> : null}
      {viewMode === 'list' ? <ListView projects={filteredProjects} /> : null}

      <nav className={`toggleViw ${viewMode !== 'fullscreen' ? 'is-not-fullscreen' : ''}`}>
        <button
          className={viewMode === 'fullscreen' ? 'is-active' : ''}
          onClick={() => changeView('fullscreen')}
        >
          Fullscreen
        </button>
        <button
          className={viewMode === 'grid' ? 'is-active' : ''}
          onClick={() => changeView('grid')}
        >
          Grid
        </button>
        <button
          className={viewMode === 'list' ? 'is-active' : ''}
          onClick={() => changeView('list')}
        >
          List
        </button>
      </nav>
    </div>
  );
}
