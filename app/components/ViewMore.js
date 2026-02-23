import Image from 'next/image';
import Link from 'next/link';

const VIEW_MORE_COUNT = 4;

export default function ViewMore({ projects }) {
  const visibleProjects = projects.slice(0, VIEW_MORE_COUNT);

  return (
    <section className="viewMore">
      <div className="viewMore-head">
        <h2>View More</h2>
        <Link href="/">See all projects</Link>
      </div>

      <div className="viewMore-grid">
        {visibleProjects.map((project) => (
          <Link key={project.id} href={`/works/${project.slug}`} className="project-card">
            <div className="card-image">
              <Image
                src={project.image}
                alt={project.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="card-content">
              <h3>{project.title}</h3>
              <p>{project.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
