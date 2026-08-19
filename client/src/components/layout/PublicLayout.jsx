import { SiteContentProvider } from '../../context/SiteContentContext';
import Layout from './Layout';

export default function PublicLayout() {
  return (
    <SiteContentProvider>
      <Layout />
    </SiteContentProvider>
  );
}
