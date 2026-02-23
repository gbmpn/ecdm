import {sanityClient} from './client'

const aboutPageQuery = `*[_type == "aboutPage"][0]{
  "coverImageUrl": coverImage.asset->url,
  textContents[]{
    label,
    paragraphe
  }
}`

export async function getAboutPageContent() {
  const aboutPage = await sanityClient.fetch(aboutPageQuery)

  if (!aboutPage) return null

  return {
    coverImageUrl: aboutPage.coverImageUrl || '/08.webp',
    textContents: Array.isArray(aboutPage.textContents)
      ? aboutPage.textContents.filter((item) => item?.label && item?.paragraphe)
      : [],
  }
}
