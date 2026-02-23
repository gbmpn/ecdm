import Image from 'next/image';
import { notFound } from 'next/navigation';
import ViewMore from '../../components/ViewMore';
import CaseAsidePin from '../../components/CaseAsidePin';
import CaseImageGrid from '../../components/CaseImageGrid';
import { getProjectBySlug, getRandomViewMoreProjects } from '../../lib/sanity/projects';

export default async function Case({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const caseImages = project.images.length > 0 ? project.images : [project.image];
  const viewMoreProjects = await getRandomViewMoreProjects(project._id, 4);

  return (
    <div className="site-wrapper">
      <section className="pageHeader">
        <div className="pageHeader-media">
          <Image
              src={project.image}
              alt={project.title}
              fill
              style={{
                objectFit: 'cover'
              }}
          />
        </div>
        
        <div className='textContent'>
          <h1>{project.title}</h1>
          <span className='location'>{project.category}</span>
        </div>
        
      </section>

      <section className='caseContent'>
        <CaseImageGrid images={caseImages} title={project.title} />
        <aside className='caseInfos'>
          {project.textDescriptions.length > 0 ? project.textDescriptions.map((item, index) => (
            <div className='row' key={`${item.label}-${index}`}>
              <span>{item.label}</span>
              <p>{item.textContent}</p>
            </div>
          )) : (
            <div className='row'>
              <span>Description</span>
              <p>Content coming soon.</p>
            </div>
          )}
        </aside>
      </section>
      <CaseAsidePin />
      <ViewMore projects={viewMoreProjects} />
    </div>
  );
}
