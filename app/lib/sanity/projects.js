import {sanityClient} from './client'

const projectsHomeQuery = `*[_type == "project"] | order(legacyId asc, _createdAt asc) {
  _id,
  legacyId,
  title,
  "slug": slug.current,
  "category": coalesce(category->title, "Uncategorized"),
  location,
  year,
  "coverImageUrl": coverImage.asset->url,
  "firstImageUrl": images[0].asset->url
}`

const projectBySlugQuery = `*[_type == "project" && (slug.current == $slug || string(legacyId) == $slug)][0]{
  _id,
  legacyId,
  title,
  "slug": slug.current,
  "category": coalesce(category->title, "Uncategorized"),
  location,
  year,
  "coverImageUrl": coverImage.asset->url,
  "firstImageUrl": images[0].asset->url,
  "images": images[].asset->url,
  "textDescriptions": textDescriptions[]{
    label,
    textContent
  }
}`

const viewMoreProjectsQuery = `*[_type == "project" && _id != $excludeId && defined(slug.current)]{
  _id,
  legacyId,
  title,
  "slug": slug.current,
  location,
  "coverImageUrl": coverImage.asset->url,
  "firstImageUrl": images[0].asset->url
}`

const getLegacyFallbackImage = (legacyId) => {
  if (!legacyId || Number.isNaN(Number(legacyId))) return null
  return `/${String(legacyId).padStart(2, '0')}.webp`
}

const normalizeProjectCard = (project) => ({
  id: project.legacyId ?? project._id,
  image:
    project.coverImageUrl ||
    project.firstImageUrl ||
    getLegacyFallbackImage(project.legacyId) ||
    '/01.webp',
  title: project.title || 'Untitled',
  category: project.category || 'Uncategorized',
  year: project.year || '',
  location: project.location || '',
  slug: project.slug,
})

export async function getHomeProjects() {
  const rawProjects = await sanityClient.fetch(projectsHomeQuery)

  return rawProjects.filter((project) => Boolean(project?.slug)).map(normalizeProjectCard)
}

export async function getProjectBySlug(slug) {
  const project = await sanityClient.fetch(projectBySlugQuery, {slug})
  if (!project?.slug) return null

  return {
    ...normalizeProjectCard(project),
    _id: project._id,
    images: Array.isArray(project.images) ? project.images.filter(Boolean) : [],
    textDescriptions: Array.isArray(project.textDescriptions)
      ? project.textDescriptions.filter(
          (item) => item?.label && item?.textContent,
        )
      : [],
  }
}

function pickRandomItems(items, count) {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export async function getRandomViewMoreProjects(excludeId, count = 4) {
  const projects = await sanityClient.fetch(viewMoreProjectsQuery, {excludeId})
  const normalized = projects.map(normalizeProjectCard).filter((project) => Boolean(project.slug))
  return pickRandomItems(normalized, count)
}
