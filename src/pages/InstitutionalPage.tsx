import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleHelp,
  Cookie,
  Cpu,
  FileText,
  Headphones,
  Newspaper,
  PackageSearch,
  Recycle,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type InstitutionalPageId =
  | "sobre"
  | "trabalhe-conosco"
  | "blog"
  | "sustentabilidade"
  | "ajuda"
  | "rastrear-pedido"
  | "trocas-e-devolucoes"
  | "contato"
  | "privacidade"
  | "termos"
  | "cookies"
  | "garantia";

interface ContentSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

interface PageContent {
  group: string;
  title: string;
  intro: string;
  icon: LucideIcon;
  sections: ContentSection[];
  cta?: { label: string; to: string };
  references?: { label: string; href: string }[];
}

const content: Record<Exclude<InstitutionalPageId, "blog">, PageContent> = {
  sobre: {
    group: "Institucional",
    title: "Tecnologia para ir além.",
    intro: "A Nexora é um e-commerce de tecnologia pensado para aproximar pessoas de componentes, periféricos e soluções para seus setups.",
    icon: Building2,
    sections: [
      { title: "Nossa proposta", paragraphs: ["Reunimos produtos de tecnologia em um catálogo simples de explorar, com informações para ajudar você a comparar e escolher.", "A experiência da loja conecta catálogo, conta, carrinho e acompanhamento dos pedidos em um só lugar."] },
      { title: "Uma experiência clara", paragraphs: ["Queremos que cada etapa seja fácil de entender: encontrar um produto, consultar seus detalhes e acompanhar o pedido depois da compra."] },
      { title: "O que você encontra", paragraphs: ["Hardware, componentes e periféricos para diferentes necessidades, do upgrade de uma máquina à montagem de um setup completo."] },
    ],
    cta: { label: "Explorar produtos", to: "/produtos" },
  },
  "trabalhe-conosco": {
    group: "Institucional",
    title: "Trabalhe conosco",
    intro: "Gostaria de contribuir com a experiência Nexora? Conte um pouco sobre você e sua área de interesse.",
    icon: Users,
    sections: [
      { title: "Oportunidades", paragraphs: ["No momento, esta página não divulga vagas abertas. Quando houver uma oportunidade, as informações da posição e as instruções para candidatura serão publicadas aqui."] },
      { title: "Quer se apresentar?", paragraphs: ["A página de contato reúne as opções de navegação e atendimento atualmente disponíveis no site. Como o projeto ainda não possui e-mail ou formulário de contato configurado, não conseguimos receber currículos por este canal."] },
    ],
    cta: { label: "Ver informações de contato", to: "/contato" },
  },
  sustentabilidade: {
    group: "Institucional",
    title: "Tecnologia com responsabilidade",
    intro: "A sustentabilidade é um compromisso contínuo que deve acompanhar as escolhas de produto, embalagem e uso da tecnologia.",
    icon: Recycle,
    sections: [
      { title: "Escolhas que duram", paragraphs: ["Escolher componentes compatíveis com a necessidade e fazer upgrades planejados pode ajudar a prolongar o uso de um equipamento."] },
      { title: "Uso e descarte conscientes", paragraphs: ["Equipamentos eletrônicos não devem ser descartados junto ao lixo comum. Procure pontos de coleta e programas de logística reversa disponíveis na sua região.", "Esta página apresenta diretrizes gerais; ainda não há metas ambientais ou programas próprios da Nexora publicados no projeto."] },
      { title: "Evolução transparente", paragraphs: ["Quando iniciativas e resultados próprios forem definidos, eles poderão ser apresentados com informações verificáveis nesta página."] },
    ],
    cta: { label: "Conhecer o catálogo", to: "/produtos" },
  },
  ajuda: {
    group: "Atendimento",
    title: "Central de ajuda",
    intro: "Encontre orientações sobre cadastro, compras e acompanhamento de pedidos na Nexora.",
    icon: CircleHelp,
    sections: [],
  },
  "rastrear-pedido": {
    group: "Atendimento",
    title: "Acompanhe seu pedido",
    intro: "Consulte os pedidos da sua conta e veja o status mais recente registrado na loja.",
    icon: PackageSearch,
    sections: [
      { title: "Como consultar", paragraphs: ["Entre na sua conta e abra a página Meus pedidos. Ela mostra os pedidos associados ao seu usuário, seus itens, valores e status."] },
      { title: "Sobre o rastreamento da entrega", paragraphs: ["O sistema atual apresenta o status do pedido, mas não possui integração com transportadora nem código de rastreio externo. Quando essa informação não estiver disponível em Meus pedidos, a loja ainda não a oferece pelo site."] },
    ],
    cta: { label: "Abrir meus pedidos", to: "/pedidos" },
  },
  "trocas-e-devolucoes": {
    group: "Atendimento",
    title: "Trocas e devoluções",
    intro: "Veja orientações gerais para solicitar ajuda com uma compra ou produto.",
    icon: Truck,
    sections: [
      { title: "Compras feitas pela internet", paragraphs: ["Para compras realizadas fora do estabelecimento comercial, o Código de Defesa do Consumidor prevê o direito de arrependimento no prazo de 7 dias, contado da assinatura ou do recebimento do produto, conforme o caso. Os valores pagos devem ser devolvidos nos termos da lei."] },
      { title: "Produto com defeito", paragraphs: ["Se notar um problema, mantenha a nota ou comprovante da compra e procure o canal de atendimento indicado nos documentos da compra. Os prazos e as alternativas dependem do tipo de produto e da situação."] },
      { title: "Como pedir orientação", paragraphs: ["A aplicação ainda não tem um formulário de troca/devolução. Consulte seus pedidos na conta e use o canal oficial informado na confirmação da compra para receber instruções."] },
    ],
    references: [{ label: "Código de Defesa do Consumidor — art. 49", href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" }],
    cta: { label: "Ver meus pedidos", to: "/pedidos" },
  },
  contato: {
    group: "Atendimento",
    title: "Fale conosco",
    intro: "Estamos preparando os canais de atendimento da Nexora. Confira abaixo as opções já disponíveis no site.",
    icon: Headphones,
    sections: [
      { title: "Pedidos e compras", paragraphs: ["Clientes com conta podem consultar os pedidos e seus status na área Meus pedidos."] },
      { title: "Dúvidas frequentes", paragraphs: ["A Central de ajuda reúne orientações sobre cadastro, pedidos e a experiência de compra."] },
      { title: "Canais diretos", paragraphs: ["Este projeto ainda não tem endereço de e-mail, telefone, WhatsApp ou formulário de contato configurado. Para assuntos relacionados a uma compra, consulte também os dados de atendimento presentes na confirmação ou nos documentos do pedido."] },
    ],
    cta: { label: "Acessar a Central de ajuda", to: "/ajuda" },
  },
  privacidade: {
    group: "Políticas",
    title: "Privacidade e dados pessoais",
    intro: "Esta página resume os dados solicitados pelas funções atuais da loja e os cuidados esperados no uso dessas informações.",
    icon: ShieldCheck,
    sections: [
      { title: "Dados usados pela loja", paragraphs: ["O cadastro solicita nome, e-mail, CPF e endereço. A conta também se relaciona a informações de carrinho e pedidos para permitir que essas funções operem."] },
      { title: "Finalidade e acesso", paragraphs: ["Essas informações são utilizadas no contexto das funções de cadastro, autenticação, compra e consulta de pedidos. Não informe sua senha a terceiros e use uma senha exclusiva para sua conta."] },
      { title: "Seus direitos", paragraphs: ["A LGPD prevê direitos como confirmação e acesso aos dados, correção de informações, portabilidade nos termos aplicáveis e eliminação nas hipóteses previstas em lei. O exercício pode estar sujeito a verificação de identidade e a obrigações legais de conservação."] },
      { title: "Contato e atualização", paragraphs: ["O projeto ainda não informa a identificação completa do controlador nem um canal dedicado a solicitações de privacidade. Esses dados devem ser definidos e publicados pelo operador da loja antes da operação comercial."] },
    ],
    references: [{ label: "Lei Geral de Proteção de Dados — Lei nº 13.709/2018", href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" }],
  },
  termos: {
    group: "Políticas",
    title: "Termos de uso",
    intro: "Estas orientações descrevem o uso do site Nexora e das funções disponíveis nesta versão.",
    icon: FileText,
    sections: [
      { title: "Uso da conta", paragraphs: ["Ao criar uma conta, mantenha seus dados atualizados e proteja suas credenciais. A conta é pessoal e as ações realizadas após autenticação são associadas ao usuário conectado."] },
      { title: "Catálogo e pedidos", paragraphs: ["As páginas de produtos exibem informações disponibilizadas pela loja. Disponibilidade, preço e condições devem ser conferidos durante a compra e na confirmação do pedido.", "A página Meus pedidos apresenta os registros e status disponíveis na conta. Ela não fornece rastreamento de transportadora nesta versão."] },
      { title: "Uso adequado", paragraphs: ["Não use o site para atividades ilícitas, tentativa de acesso não autorizado ou ações que prejudiquem a operação e outros usuários."] },
      { title: "Atualizações", paragraphs: ["Os termos podem ser atualizados quando as funções ou informações da loja mudarem. A versão vigente deve ser consultada nesta página."] },
    ],
  },
  cookies: {
    group: "Políticas",
    title: "Política de cookies e armazenamento local",
    intro: "Explicamos a diferença entre cookies e o armazenamento usado pelas funções atuais do site.",
    icon: Cookie,
    sections: [
      { title: "Cookies", paragraphs: ["O código atual do frontend não define cookies próprios nem integra uma ferramenta de analytics ou publicidade. Recursos de terceiros adicionados futuramente podem alterar esse cenário e devem ser informados antes de serem utilizados."] },
      { title: "Armazenamento local", paragraphs: ["A sessão autenticada utiliza armazenamento local do navegador para guardar o token de acesso da conta. Esse mecanismo é diferente de um cookie e pode ser removido nas configurações do navegador; ao removê-lo, talvez seja necessário entrar novamente."] },
      { title: "Controle do navegador", paragraphs: ["O navegador permite limpar dados locais e controlar cookies. Bloquear armazenamento necessário pode afetar o login e outras funções da loja."] },
    ],
    references: [{ label: "Guia da ANPD sobre cookies e proteção de dados", href: "https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf" }],
  },
  garantia: {
    group: "Políticas",
    title: "Garantia legal",
    intro: "A garantia legal é assegurada pela legislação e não depende de uma promessa adicional da loja.",
    icon: Wrench,
    sections: [
      { title: "Prazos para reclamar de vícios aparentes", paragraphs: ["O Código de Defesa do Consumidor estabelece prazo de 30 dias para produtos e serviços não duráveis e 90 dias para produtos e serviços duráveis. Em caso de vício oculto, a contagem começa quando o problema fica evidente."] },
      { title: "Garantia contratual", paragraphs: ["Alguns produtos podem contar com garantia contratual oferecida pelo fabricante ou fornecedor. Quando aplicável, consulte o certificado e as condições entregues com o produto; ela complementa a garantia legal."] },
      { title: "Como buscar atendimento", paragraphs: ["Guarde o comprovante da compra e a documentação do produto. O projeto ainda não possui um fluxo próprio para abrir chamados de garantia; use o canal oficial indicado nos documentos ou na confirmação da compra."] },
    ],
    references: [{ label: "Código de Defesa do Consumidor — arts. 26 e 50", href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" }],
    cta: { label: "Consultar meus pedidos", to: "/pedidos" },
  },
};

const faqs = [
  { question: "Como acompanho um pedido?", answer: "Acesse Meus pedidos com sua conta. A página mostra o status registrado pela loja; esta versão não possui rastreamento externo da transportadora." },
  { question: "Preciso de uma conta para comprar?", answer: "As funções de carrinho, checkout e pedidos exigem autenticação. Você pode criar uma conta pela página de cadastro." },
  { question: "Onde vejo o status do pedido?", answer: "Na área Meus pedidos. Os status disponíveis podem incluir pendente, pago, enviado, entregue ou cancelado." },
  { question: "Como atualizo meus dados?", answer: "Entre na conta e acesse Meu perfil para consultar e editar as informações disponíveis." },
  { question: "Como solicito uma troca ou devolução?", answer: "Consulte a página Trocas e devoluções e os dados de atendimento presentes na confirmação da compra. O site ainda não tem um formulário próprio para solicitações." },
];

const blogCards = [
  { icon: Cpu, category: "Componentes", title: "Como escolher componentes para seu próximo upgrade", text: "Um guia introdutório para pensar em compatibilidade, objetivo de uso e orçamento antes de atualizar o computador." },
  { icon: Sparkles, category: "Armazenamento", title: "SSD NVMe e SATA: entendendo as diferenças", text: "Conheça os formatos e interfaces mais comuns e o que conferir na placa-mãe antes da compra." },
  { icon: Recycle, category: "Setup", title: "Fluxo de ar e organização do gabinete", text: "Noções básicas de ventilação, espaço interno e organização para uma montagem mais simples de manter." },
];

export function InstitutionalPage({ page }: { page: InstitutionalPageId }) {
  if (page === "blog") return <BlogPage />;
  if (page === "ajuda") return <HelpPage />;
  const pageContent = content[page];

  const Icon = pageContent.icon;
  return (
    <main className="min-h-[60vh]">
      <PageHero group={pageContent.group} title={pageContent.title} intro={pageContent.intro} icon={Icon} />
      <div className="section-container max-w-5xl py-10 sm:py-14">
        <Breadcrumbs title={pageContent.title} />
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {pageContent.sections.map((section, index) => (
            <Card key={section.title} className="border-border/60 bg-card/40">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg border border-nexora/25 bg-nexora/10 text-nexora"><span className="text-sm font-semibold">{String(index + 1).padStart(2, "0")}</span></span><h2 className="text-lg font-semibold">{section.title}</h2></div>
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets ? <ul className="list-disc space-y-2 pl-5">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {pageContent.references ? <div className="mt-6 rounded-xl border border-border/50 bg-secondary/20 p-4"><p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Referências oficiais</p><ul className="mt-2 space-y-1">{pageContent.references.map((reference) => <li key={reference.href}><a href={reference.href} target="_blank" rel="noreferrer" className="text-sm text-nexora underline-offset-4 hover:underline">{reference.label}<span className="sr-only"> (abre em nova aba)</span></a></li>)}</ul></div> : null}
        {pageContent.cta ? <Button render={<Link to={pageContent.cta.to} />} className="mt-7 bg-nexora text-primary-foreground hover:bg-nexora/90">{pageContent.cta.label}<ArrowRight className="size-4" data-icon="inline-end" /></Button> : null}
      </div>
    </main>
  );
}

function PageHero({ group, title, intro, icon: Icon }: { group: string; title: string; intro: string; icon: LucideIcon }) {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-secondary/20">
      <div className="pointer-events-none absolute inset-0 grid-pattern" />
      <div className="pointer-events-none absolute -top-32 right-1/4 size-96 rounded-full bg-nexora/8 blur-3xl" />
      <div className="section-container relative py-12 md:py-16">
        <div className="flex max-w-3xl items-start gap-4 sm:gap-6"><span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10 text-nexora sm:size-14"><Icon className="size-5 sm:size-6" /></span><div><Badge variant="nexora" className="mb-3">{group}</Badge><h1 className="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p></div></div>
      </div>
    </section>
  );
}

function Breadcrumbs({ title }: { title: string }) {
  return <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground"><Link to="/" className="hover:text-nexora">Início</Link><span aria-hidden="true">/</span><span className="truncate text-foreground">{title}</span></nav>;
}

function BlogPage() {
  return (
    <main className="min-h-[60vh]">
      <PageHero group="Institucional" title="Blog de tecnologia" intro="Conteúdo demonstrativo com ideias e explicações para ajudar você a planejar o próximo setup." icon={Newspaper} />
      <div className="section-container max-w-6xl py-10 sm:py-14"><Breadcrumbs title="Blog de tecnologia" /><div className="mt-5 flex items-start gap-2 rounded-xl border border-nexora/20 bg-nexora/5 p-4 text-sm text-muted-foreground"><Newspaper className="mt-0.5 size-4 shrink-0 text-nexora" /><p>Os cards abaixo são exemplos editoriais estáticos; ainda não há um sistema de publicação de artigos conectado.</p></div><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{blogCards.map(({ icon: Icon, category, title, text }) => <Card key={title} className="group border-border/60 bg-card/40 transition-colors hover:border-nexora/30"><CardContent className="flex h-full flex-col p-5 sm:p-6"><span className="mb-5 flex size-11 items-center justify-center rounded-xl border border-nexora/25 bg-nexora/10 text-nexora"><Icon className="size-5" /></span><Badge variant="secondary" className="mb-3 w-fit">{category}</Badge><h2 className="text-lg font-semibold leading-snug group-hover:text-nexora">{title}</h2><p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{text}</p><div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground"><CheckCircle2 className="size-3.5 text-nexora" />Conteúdo demonstrativo</div></CardContent></Card>)}</div><Button render={<Link to="/produtos" />} variant="outline" className="mt-7"><ArrowLeft className="size-4" data-icon="inline-start" />Voltar ao catálogo</Button></div>
    </main>
  );
}

function HelpPage() {
  return (
    <main className="min-h-[60vh]">
      <PageHero group="Atendimento" title="Central de ajuda" intro="Respostas para as dúvidas mais comuns sobre a sua conta, compras e pedidos." icon={CircleHelp} />
      <div className="section-container max-w-4xl py-10 sm:py-14"><Breadcrumbs title="Central de ajuda" /><div className="mt-6 space-y-3">{faqs.map((faq) => <details key={faq.question} className="group rounded-xl border border-border/60 bg-card/40 p-4 open:border-nexora/30 sm:p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:hidden [&::-webkit-details-marker]:hidden"><span>{faq.question}</span><ArrowRight className="size-4 shrink-0 text-nexora transition-transform group-open:rotate-90" /></summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{faq.answer}</p></details>)}</div><div className="mt-7 rounded-xl border border-border/50 bg-secondary/20 p-5"><div className="flex items-start gap-3"><ShieldQuestion className="mt-0.5 size-5 shrink-0 text-nexora" /><div><h2 className="font-semibold">Ainda precisa de ajuda?</h2><p className="mt-1 text-sm text-muted-foreground">Consulte seus pedidos ou veja os canais de atendimento atualmente disponíveis.</p><div className="mt-4 flex flex-wrap gap-2"><Button render={<Link to="/pedidos" />} className="bg-nexora text-primary-foreground hover:bg-nexora/90">Meus pedidos</Button><Button render={<Link to="/contato" />} variant="outline">Fale conosco</Button></div></div></div></div></div>
    </main>
  );
}

