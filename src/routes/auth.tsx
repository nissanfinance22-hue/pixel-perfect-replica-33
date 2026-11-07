import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft, Delete, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { unlockAdmin } from '@/lib/gate.functions';
import logo from '@/assets/pcj-logo-book.png';

export const Route = createFileRoute('/auth')({
  head: () => ({ meta: [
    { title: 'PCJ — Acesso do administrador' },
    { name: 'description', content: 'Digite o código de acesso para entrar na administração do PCJ.' },
    { property: 'og:title', content: 'PCJ — Administração' },
    { property: 'og:description', content: 'Acesso administrativo por código numérico.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex' },
  ] }),
  component: Auth,
});

const MAX = 14;

function Auth() {
  const navigate = useNavigate();
  const unlock = useServerFn(unlockAdmin);
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [granted, setGranted] = useState(false);

  const press = (d: string) => { if (busy || granted) return; setError(false); setPin(p => (p.length < MAX ? p + d : p)); };
  const back = () => { setError(false); setPin(p => p.slice(0, -1)); };

  async function submit() {
    if (!pin || busy) return;
    setBusy(true);
    try {
      const { ok } = await unlock({ data: { pin } });
      if (ok) { setGranted(true); setTimeout(() => navigate({ to: '/admin' }), 2600); }
      else { setError(true); setPin(''); }
    } catch { setError(true); setPin(''); }
    finally { setBusy(false); }
  }

  if (granted) return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-navy-foreground">
      <div className="granted-ring flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold">
        <ShieldCheck className="h-14 w-14 text-gold" />
      </div>
      <p className="granted-line mt-8 text-xs uppercase tracking-[0.4em] text-gold">Acesso liberado</p>
      <h1 className="granted-name mt-4 font-display text-5xl italic sm:text-6xl">Bem-vindo, Administrador</h1>
      <p className="granted-line mt-4 text-sm text-navy-foreground/70">Portal de Conhecimento Jurídico</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-navy px-6 py-8 text-navy-foreground">
      <Button asChild variant="ghost" className="text-navy-foreground"><Link to="/"><ArrowLeft />Voltar</Link></Button>
      <div className="mx-auto max-w-xs py-6 text-center">
        <img src={logo} width={1024} height={1024} alt="PCJ" className="mx-auto h-28 w-28 object-contain" />
        <LockKeyhole className="mx-auto mb-2 mt-4 text-gold" />
        <h1 className="text-3xl">Código de acesso</h1>
        <div className={`my-6 flex h-6 flex-wrap items-center justify-center gap-2 ${error ? 'pin-shake' : ''}`} aria-live="polite">
          {Array.from({ length: MAX }).map((_, i) => (
            <span key={i} className={`h-3 w-3 rounded-full border border-gold/60 transition ${i < pin.length ? 'bg-gold' : ''}`} />
          ))}
        </div>
        <p className="mb-4 h-5 text-sm text-destructive">{error ? 'Código incorreto. Tente novamente.' : ''}</p>
        <div className="grid grid-cols-3 gap-3">
          {['1','2','3','4','5','6','7','8','9'].map(d => (
            <Button key={d} type="button" variant="ghost" onClick={() => press(d)} className="h-16 rounded-full border border-gold/30 text-2xl text-navy-foreground hover:bg-gold/10">{d}</Button>
          ))}
          <Button type="button" variant="ghost" aria-label="Apagar" onClick={back} className="h-16 rounded-full text-navy-foreground"><Delete /></Button>
          <Button type="button" variant="ghost" onClick={() => press('0')} className="h-16 rounded-full border border-gold/30 text-2xl text-navy-foreground hover:bg-gold/10">0</Button>
          <Button type="button" onClick={submit} disabled={!pin || busy} className="h-16 rounded-full bg-gold text-navy hover:bg-gold/90">{busy ? '…' : 'OK'}</Button>
        </div>
      </div>
    </main>
  );
}
