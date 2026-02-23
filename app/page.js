import HomePageClient from './components/HomePageClient';
import { getHomeProjects } from './lib/sanity/projects';

const VALID_HOME_VIEWS = new Set(['fullscreen', 'grid', 'list']);

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const requestedView = resolvedSearchParams?.view;
  const initialView = VALID_HOME_VIEWS.has(requestedView) ? requestedView : 'fullscreen';
  const projects = await getHomeProjects();

  return <HomePageClient projects={projects} initialView={initialView} />;
}
