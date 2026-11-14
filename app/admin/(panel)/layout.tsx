import {requireAdmin} from '@/lib/auth';
import {AdminNav} from '@/components/admin/AdminNav';

export default async function PanelLayout({children}:{children:React.ReactNode}){
  await requireAdmin();
  return <div className="adm-shell"><AdminNav/><main className="adm-main">{children}</main></div>;
}
