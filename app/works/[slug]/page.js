import Image from 'next/image';
import { notFound } from 'next/navigation';
import { projects } from '../../data/projects';
import ViewMore from '../../components/ViewMore';
import CaseAsidePin from '../../components/CaseAsidePin';
import CaseImageGrid from '../../components/CaseImageGrid';

const CASE_IMAGE_FOLDER = 'mountain-vista';
const CASE_IMAGE_COUNT = 21;

export default async function Case({ params }) {
  const { slug } = await params;
  const project = projects.find(
    (item) => item.slug === slug || String(item.id) === slug,
  );

  if (!project) notFound();

  const caseImages = Array.from({ length: CASE_IMAGE_COUNT }, (_, index) => {
    const filename = String(index + 1).padStart(2, '0');
    return `/${CASE_IMAGE_FOLDER}/${filename}.webp`;
  });
  const viewMoreProjects = projects.filter((item) => item.slug !== project.slug);

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
          <div className='row'>
            <span>Project Description</span>
            <p>établissement d’enseignement supérieur, bureaux, commerces, restaurant et espace de coworking</p>
          </div>
          <div className='row'>
            <span>Maître d’ouvrage : </span>
            <p>Spie Batignolles Immobilier Architecte : ECDM architectes – chefs de projet : Anca Radu et Marc-Antoine Galup Mission : conception architecturale et visa du clos et couvert</p>
          </div>
          <div className='row'>
            <span>Architecte : </span>
            <p>ECDM architectes – chefs de projet : Anca Radu et Marc-Antoine Galup Mission : conception architecturale et visa du clos et couvert</p>
          </div>
          <div className='row'>
            <span>Équipe : </span>
            <p>Salem Mostefaoui</p>
          </div>
          <div className='row'>
            <span>Surface : </span>
            <p>Place Ravezies, Bordeaux (33), France</p>
          </div>
          <div className='row'>
            <span>Coût : </span>
            <p>12 600 m²</p>
          </div>
          <div className='row'>
            <span>Livraison :  </span>
            <p>28.3 M€ HT</p>
          </div>
        </aside>
      </section>
      <CaseAsidePin />
      <ViewMore projects={viewMoreProjects} />
    </div>
  );
}
