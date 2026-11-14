import {getContent} from '@/lib/content';
import {saveFaqs,saveSteps} from '../../actions';
import {Msg,Field,type SP} from '@/components/admin/Bits';

export const metadata={title:'FAQs & steps'};

export default function Faqs({searchParams}:{searchParams:SP}){
  const {faqs,steps}=getContent();
  const rows=[...faqs,{q:'',a:''},{q:'',a:''}];
  const stepRows=[...steps,{title:'',body:''}];
  return <>
    <div className="adm-top"><div><h1>FAQs & steps</h1><p>The first five FAQs also appear on the homepage.</p></div></div>
    <Msg searchParams={searchParams}/>
    <form action={saveFaqs} className="adm-card adm-form">
      <h2>Frequently asked questions</h2>
      {rows.map((f,i)=><div key={i} className={`adm-faq ${f.q?'':'new'}`}>
        <Field label={f.q?`Question ${i+1}`:'New question (leave empty to skip)'}><input type="text" name="q" maxLength={300} defaultValue={f.q}/></Field>
        <Field label="Answer"><textarea name="a" rows={3} maxLength={2000} defaultValue={f.a}/></Field>
        {f.q&&<label className="adm-check"><input type="checkbox" name="delete" value={i}/> Delete this question</label>}
      </div>)}
      <div className="adm-actions"><button className="adm-btn" type="submit">Save FAQs</button></div>
    </form>
    <form action={saveSteps} className="adm-card adm-form">
      <h2>“How it works” steps</h2>
      <p className="adm-help" style={{marginTop:-6}}>Shown on the homepage and the How It Works page. Clear a step’s title to remove it.</p>
      {stepRows.map((s,i)=><div key={i} className={`adm-faq ${s.title?'':'new'}`}>
        <Field label={s.title?`Step ${i+1}`:'New step (leave empty to skip)'}><input type="text" name="title" maxLength={120} defaultValue={s.title}/></Field>
        <Field label="Text"><textarea name="body" rows={2} maxLength={400} defaultValue={s.body}/></Field>
      </div>)}
      <div className="adm-actions"><button className="adm-btn" type="submit">Save steps</button></div>
    </form>
  </>;
}
