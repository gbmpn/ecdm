'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ListView({ projects }) {
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleLineEnter = (event) => {
    setHoveredImage(event.currentTarget.dataset.img || null);
  };

  const handleLineLeave = () => {
    setHoveredImage(null);
  };

  return (
    <>
      <div className="listView">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/works/${project.slug}`}
            className="list-line"
            data-img={project.image}
            onMouseEnter={handleLineEnter}
            onMouseLeave={handleLineLeave}
          >
            <h2 className="list-title">{project.title}</h2>
            <p className="list-location">{project.location}</p>
          </Link>
        ))}
      </div>
      <div className={`list-preview ${hoveredImage ? 'is-visible' : ''}`}>
        {hoveredImage ? (
          <Image
            src={hoveredImage}
            alt=""
            fill
            sizes="(max-width: 1200px) 40vw, 30vw"
            style={{ objectFit: 'cover' }}
          />
        ) : null}
      </div>
    </>
  );
}
