import {requireAdmin} from '@/lib/auth';
import {AdminNav} from '@/components/admin/AdminNav';
import {getLeads} from '@/lib/leads';

export default async function PanelLayout({children}:{children:React.ReactNode}){
  await requireAdmin();
  return <div className="adm-shell"><AdminNav newLeads={getLeads().filter(l=>l.status==='new').length}/><main className="adm-main">{children}</main></div>;
}
