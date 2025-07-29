import { redirect } from 'next/navigation';

const AdminPage = () => {
  redirect('/admin/users'); // Redirect to the users page
};

export default AdminPage;
