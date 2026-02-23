import Image from 'next/image';
import Link from 'next/link';

const VIEW_MORE_COUNT = 4;

function pickRandomProjects(items, count) {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export default function ViewMore({ projects }) {
  const randomProjects = pickRandomProjects(projects, VIEW_MORE_COUNT);

  return (
    <section className="viewMore">
      <div className="viewMore-head">
        <h2>View More</h2>
        <Link href="/">See all projects</Link>
      </div>

      <div className="viewMore-grid">
        {randomProjects.map((project) => (
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
