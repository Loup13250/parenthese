import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFoundView from '@/components/NotFoundView';
import { getSiteInfo } from '@/lib/data';

export const metadata = {
  title: 'Page non trouvée | La Parenthèse Harmonieuse',
  description: "Cette page est introuvable. Retrouvez l'ensemble de nos soins, massages et rituels bien-être chez La Parenthèse Harmonieuse à Salon-de-Provence.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  let siteInfo = null;
  try {
    siteInfo = await getSiteInfo();
  } catch (e) {
    console.error('Error loading siteInfo for 404 page:', e);
  }

  return (
    <>
      <Header siteInfo={siteInfo} />
      <div className="public-page-wrapper">
        <NotFoundView siteInfo={siteInfo} />
      </div>
      <Footer siteInfo={siteInfo} />
    </>
  );
}
