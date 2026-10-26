import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import p1 from "@/assets/01_GIBI.png.asset.json";
import p2 from "@/assets/02_GIBI.png.asset.json";
import p3 from "@/assets/03_gibi.png.asset.json";
import p4 from "@/assets/04_gibi.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PCJ — Portal de Conhecimento Jurídico | O Direito para todos" },
      {
        name: "description",
        content:
          "Portal de educação jurídica acessível e visual. Conheça o gibi jurídico “Concessão Judicial de Seguro de Vida”.",
      },
      { property: "og:title", content: "PCJ — Portal de Conhecimento Jurídico" },
      {
        property: "og:description",
        content: "O Direito explicado de forma que todos entendam — conheça nosso gibi jurídico autoral.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PAGES = [
  { src: p1.url, alt: "Página 1 do gibi: a avó, a neta e a negativa do seguro" },
  { src: p2.url, alt: "Página 2 do gibi" },
  { src: p3.url, alt: "Página 3 do gibi" },
  { src: p4.url, alt: "Página 4 do gibi" },
];

/** Preço editável: preencha quando definido (ex.: "R$ 00,00"). */
const GIBI_PRICE: string | null = null;

const NAV = [
  { href: "#inicio", label: "Início" },
  { href: "#conhecimento", label: "Conhecimento Jurídico" },
  { href: "#gibi", label: "Nosso Gibi" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

const TOPICS = [
  { tag: "Seguros", title: "Seguro de vida: quando a negativa é indevida" },
  { tag: "Direitos básicos", title: "Como funciona um processo judicial" },
  { tag: "Consumidor", title: "Seus direitos diante de empresas e contratos" },
  { tag: "Família", title: "Herança, beneficiários e sucessão" },
  { tag: "Glossário", title: "Termos jurídicos em linguagem simples" },
  { tag: "Materiais", title: "Guias e materiais educativos para baixar" },
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="PCJ — Início">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-sm border font-display text-lg font-bold ${
          light ? "border-gold text-gold" : "border-primary bg-primary text-gold"
        }`}
      >
        PCJ
      </span>
      <span className="min-w-0 leading-tight">
        <span className={`block truncate font-display text-lg font-semibold ${light ? "text-navy-foreground" : "text-primary"}`}>
          Portal de Conhecimento Jurídico
        </span>
      </span>
    </a>
  );
}

function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
      <h2 id={id} className="text-4xl font-semibold text-primary md:text-5xl">{title}</h2>
    </div>
  );
}

function BtnPrimary({ href, children, onClick }: { href?: string; children: React.ReactNode; onClick?: () => void }) {
  const cls =
    "inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-gold/40 transition hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
  return href ? <a href={href} className={cls}>{children}</a> : <button onClick={onClick} className={cls}>{children}</button>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-foreground/80 transition hover:text-primary">{n.label}</a>
          ))}
          <BtnPrimary href="#gibi">Conheça o Gibi</BtnPrimary>
        </nav>
        <button
          className="rounded-sm border border-border px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen(!open)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="menu-mobile" className="border-t border-border px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-3">
            {NAV.map((n) => (
              <li key={n.href}><a href={n.href} onClick={() => setOpen(false)} className="block py-1">{n.label}</a></li>
            ))}
            <li><BtnPrimary href="#gibi">Conheça o Gibi</BtnPrimary></li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Educação jurídica acessível</p>
        <h1 className="text-5xl font-semibold leading-[1.05] text-primary md:text-7xl">
          O Direito explicado de forma que <em className="text-gold">todos</em> entendam.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          O PCJ é um portal de conhecimento jurídico visual e acessível — onde histórias em quadrinhos e
          conteúdos claros aproximam você dos seus direitos.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <BtnPrimary href="#gibi">Conhecer nosso gibi</BtnPrimary>
          <a href="#conhecimento" className="inline-flex items-center px-2 py-3 text-sm font-semibold text-primary underline decoration-gold underline-offset-8">
            Explorar conteúdos
          </a>
        </div>
      </div>
      <div className="relative mx-auto h-[420px] w-full max-w-md md:h-[520px]">
        <img src={PAGES[1].src} alt={PAGES[1].alt} className="absolute left-0 top-8 w-3/5 -rotate-6 rounded-sm shadow-xl ring-1 ring-border" />
        <img src={PAGES[0].src} alt={PAGES[0].alt} fetchPriority="high" className="absolute right-0 top-0 w-3/5 rotate-3 rounded-sm shadow-2xl ring-1 ring-gold/50" />
      </div>
    </section>
  );
}

function Gibi() {
  const [active, setActive] = useState(0);
  const buy = () =>
    toast("Compra em breve", { description: "O pagamento será habilitado em breve. Entre em contato para reservar seu exemplar." });
  return (
    <section id="gibi" aria-labelledby="gibi-t" className="border-y border-border bg-secondary/60">
      <div className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle id="gibi-t" eyebrow="Nosso Gibi" title="Concessão Judicial de Seguro de Vida" />
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mx-auto max-w-md overflow-hidden rounded-sm bg-card shadow-xl ring-1 ring-border">
              <img src={PAGES[active].src} alt={PAGES[active].alt} className="h-auto w-full" />
            </div>
            <div className="mt-5 flex justify-center gap-3" role="list" aria-label="Prévia de páginas">
              {PAGES.map((p, i) => (
                <button
                  key={p.src}
                  onClick={() => setActive(i)}
                  aria-label={`Ver página ${i + 1}`}
                  aria-pressed={active === i}
                  className={`w-16 overflow-hidden rounded-sm ring-2 transition ${active === i ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={p.src} alt="" loading="lazy" className="w-full" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-8 grid aspect-[3/4] w-40 place-items-center rounded-sm border-2 border-dashed border-gold/60 p-3 text-center text-xs text-muted-foreground">
              Espaço reservado para a capa
            </div>
            <p className="text-lg leading-relaxed text-foreground/85">
              Uma narrativa jurídica que acompanha a negativa de um seguro de vida, a atuação dos advogados,
              o processo judicial e a conquista do direito da beneficiária — contada em quadrinhos, com
              linguagem simples e envolvente.
            </p>
            <ol className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {["A negativa do seguro", "A atuação dos advogados", "O processo judicial", "O direito conquistado"].map((s, i) => (
                <li key={s} className="flex gap-2 rounded-sm bg-card p-3 ring-1 ring-border">
                  <span className="font-display font-bold text-gold">0{i + 1}</span>{s}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <p className="font-display text-3xl font-semibold text-primary">{GIBI_PRICE ?? "Preço a definir"}</p>
              <BtnPrimary onClick={buy}>Comprar agora</BtnPrimary>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Knowledge() {
  return (
    <section id="conhecimento" aria-labelledby="kn-t" className="mx-auto max-w-7xl px-5 py-20">
      <SectionTitle id="kn-t" eyebrow="Conhecimento Jurídico" title="Explicações claras para o dia a dia" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => (
          <li key={t.title} className="group flex flex-col rounded-sm border border-border bg-card p-6 transition hover:border-gold">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">{t.tag}</span>
            <h3 className="mt-3 text-2xl font-semibold text-primary">{t.title}</h3>
            <span className="mt-6 text-sm text-muted-foreground">Em breve</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-t" className="mx-auto max-w-7xl px-5 pb-20">
      <div className="grid gap-8 border-t border-border pt-16 md:grid-cols-[1fr_2fr]">
        <h2 id="sobre-t" className="text-4xl font-semibold text-primary">Sobre o PCJ</h2>
        <p className="text-lg leading-relaxed text-foreground/85">
          Acreditamos que conhecer os próprios direitos não deveria ser privilégio. O Portal de Conhecimento
          Jurídico une rigor e didática para transformar temas complexos em conteúdos visuais, acessíveis e
          confiáveis.
        </p>
      </div>
    </section>
  );
}

function Marquee() {
  const loop = [...PAGES, ...PAGES];
  return (
    <section aria-label="Páginas do gibi" className="overflow-hidden bg-navy py-10">
      <div className="marquee flex w-max gap-6 motion-reduce:w-full motion-reduce:overflow-x-auto motion-reduce:px-5">
        {loop.map((p, i) => (
          <img
            key={i}
            src={p.src}
            alt={i < PAGES.length ? p.alt : ""}
            aria-hidden={i >= PAGES.length}
            loading="lazy"
            className="h-56 w-auto shrink-0 rounded-sm object-contain ring-1 ring-gold/40 md:h-72"
          />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contato" className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 border-t border-gold/20 px-5 py-14 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-navy-foreground/70">Educação jurídica acessível, visual e para todos.</p>
        </div>
        <nav aria-label="Rodapé">
          <h3 className="mb-3 text-lg text-gold">Navegação</h3>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => <li key={n.href}><a href={n.href} className="hover:text-gold">{n.label}</a></li>)}
          </ul>
        </nav>
        <div>
          <h3 className="mb-3 text-lg text-gold">Contato</h3>
          <p className="text-sm text-navy-foreground/70">E-mail e telefone em breve.</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 border-t border-gold/20 px-5 py-6 text-xs text-navy-foreground/60">
        <span>© {new Date().getFullYear()} PCJ — Portal de Conhecimento Jurídico</span>
        <span className="flex gap-5"><span>Política de Privacidade (em breve)</span><span>Termos de Uso (em breve)</span></span>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Gibi />
        <Knowledge />
        <About />
        <Marquee />
      </main>
      <Footer />
      <Toaster position="bottom-center" />
    </>
  );
}
