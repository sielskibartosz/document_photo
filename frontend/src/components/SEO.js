// SEO.js
// Tytuł i opis każdej strony są w constants/seoPages.json - z tego samego pliku
// scripts/prerender-routes.js generuje statyczny HTML (canonical, Open Graph, treść dla Google).
// Strona jest wybierana po aktualnym adresie, więc /en/ i /uk/ dostają swoje wersje językowe.
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import SEO_PAGES from "../constants/seoPages.json";
import { seoRoute } from "../utils/localizedRoutes";

const SEO = ({ path }) => {
  const { pathname } = useLocation();
  const page = SEO_PAGES[seoRoute(pathname)] || SEO_PAGES[path];
  if (!page) return null;

  return (
    <Helmet>
      <html lang={page.lang || "pl"} />
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {page.noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};

export default SEO;
