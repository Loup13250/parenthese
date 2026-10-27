import { getGalleryPosts } from '@/lib/data';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Galerie Cabine | Admin La Parenthèse Harmonieuse',
};

export default async function GaleriePage() {
    const posts = await getGalleryPosts();
    return <GalleryClient posts={posts} />;
}
