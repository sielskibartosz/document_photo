// SEO.js
// Tytuł i opis każdej strony są w constants/seoPages.json - z tego samego pliku
// scripts/prerender-routes.js generuje statyczny HTML (canonical, Open Graph, treść dla Google).
import { Helmet } from "react-helmet";
import SEO_PAGES from "../constants/seoPages.json";

const SEO = ({ path }) => {
  const page = SEO_PAGES[path];
  if (!page) return null;

  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {page.noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};

export default SEO;
