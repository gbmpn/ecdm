import Image from 'next/image'
import {getAboutPageContent} from '../lib/sanity/about'

function normalizeParagraphe(paragraphe) {
  return String(paragraphe)
    .replace(/&lt;br\s*\/?&gt;/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\r\n/g, '\n')
}

export default async function About() {
  const aboutPage = await getAboutPageContent()

  if (!aboutPage) {
    return (
      <section className="about">
        <Image
          src="/08.webp"
          alt="about cover"
          fill
          style={{
            objectFit: 'cover',
          }}
        />

        <div className="textContent">
          <h1>A propos</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="about">
      <Image
        src={aboutPage.coverImageUrl}
        alt="about cover"
        fill
        style={{
          objectFit: 'cover',
        }}
      />

      <div className="textContent">
        <h1>A propos</h1>
        {aboutPage.textContents.map((item, index) => (
          <div className="row" key={`${item.label}-${index}`}>
            <span>{item.label}</span>
            <p style={{whiteSpace: 'pre-line'}}>{normalizeParagraphe(item.paragraphe)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
