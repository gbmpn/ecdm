'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const COLUMN_COUNT = 4;

export default function GridView({ projects }) {
  const rootRef = useRef(null);

  const columns = useMemo(() => {
    const buckets = Array.from({ length: COLUMN_COUNT }, () => []);
    projects.forEach((project, index) => {
      buckets[index % COLUMN_COUNT].push(project);
    });
    return buckets;
  }, [projects]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let rafId;
    const parallaxCards = Array.from(
      rootRef.current?.querySelectorAll('.card-image') ?? [],
    );

    const tick = () => {
      const viewportCenter = window.innerHeight * 0.5;
      for (let i = 0; i < parallaxCards.length; i += 1) {
        const card = parallaxCards[i];
        const imageWrapper = card.querySelector('.card-image-inner');
        if (!imageWrapper) continue;

        const rect = card.getBoundingClientRect();
        const imageCenter = rect.top + rect.height * 0.5;
        const distance = imageCenter - viewportCenter;
        const parallaxY = Math.max(-52, Math.min(52, -distance * 0.16));
        imageWrapper.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      parallaxCards.forEach((card) => {
        const imageWrapper = card.querySelector('.card-image-inner');
        if (imageWrapper) imageWrapper.style.transform = 'translate3d(0, 0, 0)';
      });
    };
  }, [projects]);

  return (

      <div ref={rootRef}  className="gridView">
        {columns.map((columnProjects, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="grid-column"
          >
            {columnProjects.map((project) => (
              <Link key={project.id} href={`/works/${project.slug}`} className="project-card">
                <div className="card-image">
                  <div className="card-image-inner">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="card-content">
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
  
  );
}
