import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/auth';
import AdminLoginClient from './AdminLoginClient';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
    const authenticated = await isAdminRequest();
    if (authenticated) {
        redirect('/admin/dashboard');
    }
    return <AdminLoginClient />;
}
