import './style.css';

const guests=[
  {name:"Ana Lima",a:"🐼",tag:"Aventureira",s:"ok"},{name:"Bruno M.",a:"🐨",tag:"Fotógrafo",s:"ok"},
  {name:"Cami S.",a:"🦊",tag:"Churrasco pro",s:"ok"},{name:"Diego R.",a:"🐧",tag:"DJ do camp",s:"ok"},
  {name:"Elis F.",a:"🦔",tag:"Mestre dos jogos",s:"ok"},{name:"Felipe T.",a:"🐸",tag:"Trilheiro",s:"ok"},
  {name:"Gabi N.",a:"🐰",tag:"Artesanato",s:"ok"},{name:"Henrique B.",a:"🐻",tag:"Churrasqueiro",s:"ok"},
  {name:"Isa P.",a:"🦦",tag:"Yoga & paz",s:"ok"},{name:"João V.",a:"🐺",tag:"Contador de piadas",s:"ok"},
  {name:"Karen L.",a:"🦉",tag:"Cinéfila",s:"ok"},{name:"Lucas A.",a:"🐹",tag:"Gamer",s:"ok"},
  {name:"Mari C.",a:"🦁",tag:"Cantora",s:"ok"},{name:"Nath O.",a:"🐙",tag:"Cozinheira",s:"ok"},
  {name:"Otto G.",a:"🦜",tag:"Viajante",s:"ok"},{name:"Paula S.",a:"🐳",tag:"Podcaster",s:"ok"},
  {name:"Rafa M.",a:"🦌",tag:"Esportista",s:"ok"},{name:"Sofia E.",a:"🐝",tag:"Botanista",s:"ok"},
  {name:"Thiago W.",a:"🦋",tag:"Desenhista",s:"wait"},{name:"Vera L.",a:"🐠",tag:"Escritora",s:"wait"},
  {name:"Will K.",a:"🦩",tag:"Surfista",s:"wait"},{name:"Xena P.",a:"🐢",tag:"Meditação",s:"wait"},
  {name:"Yuri D.",a:"🦭",tag:"Músico",s:"wait"},
] as Guest[];

type GuestStatus = "ok" | "wait";

interface Guest {
  a: string; // avatar (iniciais)
  name: string;
  tag: string;
  s: GuestStatus;
}

interface GuestGridProps {
  guests: Guest[];
}

const bgs: string[] = [
  "#dde8f5",
  "#ece8f5",
  "#e8f0e0",
  "#fdf0e8",
  "#f5e8f0",
];

export function GuestGrid({ guests }: GuestGridProps) {
  return (
    <div className='guest-grid' id="guestGrid">
      {guests.map((guest, i) => (
        <div key={guest.name} className="guest-card glass">
          
          <div
            className="avatar"
            style={{ background: bgs[i % bgs.length] }}
          >
            {guest.a}
          </div>

          <div className="gname">{guest.name}</div>
          <div className="gtag">{guest.tag}</div>

          <span
            className={`gstatus ${
              guest.s === "ok" ? "sok" : "swait"
            }`}
          >
            {guest.s === "ok" ? "Confirmado" : "Aguardando"}
          </span>

        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <div id="site-bg">
                <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                {/* <!-- base neutra quente --> */}
                <rect width="1400" height="900" fill="#f0ede6"/>

                {/* <!-- sacura --> */}
                <g transform="translate(450, 250) scale(0.8)">
                    {/* <!-- tronco e galhos --> */}
                    <rect x={386} y={340} width={12} height={260} rx={5} fill="#4a2810" />
                    <rect x={388} y={420} width={8} height={180} rx={3} fill="#3a2010" opacity={0.7} />
                    <path d="M394 355 Q340 325 300 305 Q280 295 260 310 Q290 320 310 335 Q350 350 388 365Z" fill="#7a5030" opacity={0.9} />
                    <path d="M394 372 Q450 342 490 327 Q510 317 530 329 Q500 337 480 350 Q445 365 392 378Z" fill="#6a4020" opacity={0.8} />
                    <path d="M392 395 Q330 365 285 348 Q260 338 245 350 Q275 360 300 375 Q338 392 390 405Z" fill="#7a5030" opacity={0.85} />
                    <path d="M392 415 Q460 388 505 372 Q525 363 540 374 Q512 383 490 396 Q454 412 391 422Z" fill="#6a4020" opacity={0.75} />

                    {/* <!-- copa sakura --> */}
                    <circle cx={320} cy={292} r={62} fill="#e04050" opacity={0.22} />
                    <circle cx={360} cy={275} r={55} fill="#e04050" opacity={0.24} />
                    <circle cx={400} cy={268} r={58} fill="#e04050" opacity={0.26} />
                    <circle cx={440} cy={275} r={54} fill="#e04050" opacity={0.24} />
                    <circle cx={475} cy={292} r={58} fill="#e04050" opacity={0.22} />

                    <circle cx={340} cy={315} r={52} fill="#c060a0" opacity={0.2} />
                    <circle cx={380} cy={302} r={56} fill="#c060a0" opacity={0.22} />
                    <circle cx={420} cy={300} r={58} fill="#e04050" opacity={0.25} />
                    <circle cx={458} cy={312} r={52} fill="#c060a0" opacity={0.2} />

                    <circle cx={310} cy={322} r={45} fill="#e04050" opacity={0.18} />
                    <circle cx={490} cy={320} r={48} fill="#e04050" opacity={0.18} />

                    <circle cx={355} cy={330} r={50} fill="#f8c0c0" opacity={0.2} />
                    <circle cx={400} cy={325} r={54} fill="#f8c0c0" opacity={0.22} />
                    <circle cx={442} cy={330} r={50} fill="#f8c0c0" opacity={0.2} />

                    <circle cx={290} cy={305} r={40} fill="#e04050" opacity={0.16} />
                    <circle cx={510} cy={308} r={42} fill="#e04050" opacity={0.16} />

                    <circle cx={370} cy={258} r={44} fill="#c060a0" opacity={0.18} />
                    <circle cx={428} cy={258} r={44} fill="#c060a0" opacity={0.18} />

                    {/* <!-- flores detalhadas --> */}
                    <ellipse cx={340} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(-20 340 288)" />
                    <ellipse cx={340} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(25 340 288)" />
                    <ellipse cx={340} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(70 340 288)" />
                    <ellipse cx={340} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(115 340 288)" />
                    <ellipse cx={340} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(160 340 288)" />
                    <circle cx={340} cy={288} r={3.5} fill="#f0d090" />

                    <g opacity={0.9}>
                        <ellipse cx={400} cy={275} rx={5.5} ry={4.5} fill="#e090c0" transform="rotate(0 400 275)" />
                        <ellipse cx={400} cy={275} rx={5.5} ry={4.5} fill="#e090c0" transform="rotate(45 400 275)" />
                        <ellipse cx={400} cy={275} rx={5.5} ry={4.5} fill="#e090c0" transform="rotate(90 400 275)" />
                        <ellipse cx={400} cy={275} rx={5.5} ry={4.5} fill="#e090c0" transform="rotate(135 400 275)" />
                        <ellipse cx={400} cy={275} rx={5.5} ry={4.5} fill="#e090c0" transform="rotate(180 400 275)" />
                        <circle cx={400} cy={275} r={4} fill="#f0d090" />
                    </g>

                    <g opacity={0.9}>
                        <ellipse cx={458} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(15 458 288)" />
                        <ellipse cx={458} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(60 458 288)" />
                        <ellipse cx={458} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(105 458 288)" />
                        <ellipse cx={458} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(150 458 288)" />
                        <ellipse cx={458} cy={288} rx={5} ry={4} fill="#f8c0c0" transform="rotate(195 458 288)" />
                        <circle cx={458} cy={288} r={3.5} fill="#f0d090" />
                    </g>

                    <g opacity={0.8}>
                        <ellipse cx={372} cy={308} rx={4.5} ry={3.5} fill="#e090c0" transform="rotate(-10 372 308)" />
                        <ellipse cx={372} cy={308} rx={4.5} ry={3.5} fill="#e090c0" transform="rotate(35 372 308)" />
                        <ellipse cx={372} cy={308} rx={4.5} ry={3.5} fill="#e090c0" transform="rotate(80 372 308)" />
                        <ellipse cx={372} cy={308} rx={4.5} ry={3.5} fill="#e090c0" transform="rotate(125 372 308)" />
                        <ellipse cx={372} cy={308} rx={4.5} ry={3.5} fill="#e090c0" transform="rotate(170 372 308)" />
                        <circle cx={372} cy={308} r={3} fill="#f0d090" />
                    </g>

                    <g opacity={0.8}>
                        <ellipse cx={426} cy={308} rx={4.5} ry={3.5} fill="#f8c0c0" transform="rotate(5 426 308)" />
                        <ellipse cx={426} cy={308} rx={4.5} ry={3.5} fill="#f8c0c0" transform="rotate(50 426 308)" />
                        <ellipse cx={426} cy={308} rx={4.5} ry={3.5} fill="#f8c0c0" transform="rotate(95 426 308)" />
                        <ellipse cx={426} cy={308} rx={4.5} ry={3.5} fill="#f8c0c0" transform="rotate(140 426 308)" />
                        <ellipse cx={426} cy={308} rx={4.5} ry={3.5} fill="#f8c0c0" transform="rotate(185 426 308)" />
                        <circle cx={426} cy={308} r={3} fill="#f0d090" />
                    </g>

                    <g opacity={0.75}>
                        <ellipse cx={316} cy={312} rx={4} ry={3} fill="#f8c0c0" transform="rotate(10 316 312)" />
                        <ellipse cx={316} cy={312} rx={4} ry={3} fill="#f8c0c0" transform="rotate(55 316 312)" />
                        <ellipse cx={316} cy={312} rx={4} ry={3} fill="#f8c0c0" transform="rotate(100 316 312)" />
                        <ellipse cx={316} cy={312} rx={4} ry={3} fill="#f8c0c0" transform="rotate(145 316 312)" />
                        <ellipse cx={316} cy={312} rx={4} ry={3} fill="#f8c0c0" transform="rotate(190 316 312)" />
                        <circle cx={316} cy={312} r={2.8} fill="#f0d090" />
                    </g>

                    <g opacity={0.75}>
                        <ellipse cx={483} cy={312} rx={4} ry={3} fill="#e090c0" transform="rotate(-5 483 312)" />
                        <ellipse cx={483} cy={312} rx={4} ry={3} fill="#e090c0" transform="rotate(40 483 312)" />
                        <ellipse cx={483} cy={312} rx={4} ry={3} fill="#e090c0" transform="rotate(85 483 312)" />
                        <ellipse cx={483} cy={312} rx={4} ry={3} fill="#e090c0" transform="rotate(130 483 312)" />
                        <ellipse cx={483} cy={312} rx={4} ry={3} fill="#e090c0" transform="rotate(175 483 312)" />
                        <circle cx={483} cy={312} r={2.8} fill="#f0d090" />
                    </g>

                    {/* <!-- pétalas caídas --> */}
                    <circle cx={290} cy={355} r={5} fill="#e04050" opacity={0.5} />
                    <circle cx={310} cy={368} r={4} fill="#f8c0c0" opacity={0.55} />
                    <circle cx={270} cy={372} r={3.5} fill="#e090c0" opacity={0.5} />
                    <circle cx={330} cy={378} r={3} fill="#e04050" opacity={0.45} />

                    <circle cx={468} cy={352} r={5} fill="#e04050" opacity={0.5} />
                    <circle cx={488} cy={365} r={4} fill="#f8c0c0" opacity={0.55} />
                    <circle cx={508} cy={358} r={3.5} fill="#e090c0" opacity={0.45} />
                    <circle cx={448} cy={370} r={4} fill="#e04050" opacity={0.45} />

                    <circle cx={355} cy={375} r={3.5} fill="#f8c0c0" opacity={0.4} />
                    <circle cx={415} cy={372} r={4} fill="#e090c0" opacity={0.4} />
                    <circle cx={438} cy={378} r={3} fill="#f8c0c0" opacity={0.38} />
                    <circle cx={368} cy={382} r={3} fill="#e04050" opacity={0.38} />

                    <circle cx={220} cy={340} r={3.5} fill="#f8c0c0" opacity={0.35} />
                    <circle cx={560} cy={345} r={3.5} fill="#e090c0" opacity={0.35} />

                    <circle cx={240} cy={390} r={3} fill="#e04050" opacity={0.3} />
                    <circle cx={545} cy={385} r={3} fill="#f8c0c0" opacity={0.3} />

                    {/* <!-- borboleta 1 - rosa, cima esq --> */}
                    <g transform="translate(300 210)">
                        <ellipse cx={0} cy={0} rx={8} ry={14} fill="#c060a0" opacity={0.85} />
                        <ellipse cx={0} cy={0} rx={8} ry={14} fill="#c060a0" opacity={0.85} transform="rotate(70)" />

                        <circle cx={0} cy={0} r={4} fill="#f0d090" opacity={0.95} />

                        <ellipse cx={0} cy={0} rx={6.5} ry={11} fill="#e090c0" opacity={0.4} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={6.5} ry={11} fill="#e090c0" opacity={0.4} transform="rotate(105)" />
                    </g>

                    <g transform="translate(230 290)">
                        <ellipse cx={0} cy={0} rx={7.5} ry={12} fill="#b0a0d8" opacity={0.88} />
                        <ellipse cx={0} cy={0} rx={7.5} ry={12} fill="#b0a0d8" opacity={0.88} transform="rotate(70)" />

                        <circle cx={0} cy={0} r={3.5} fill="#f0d090" opacity={0.95} />

                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#c8b8e8" opacity={0.45} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#c8b8e8" opacity={0.45} transform="rotate(105)" />
                    </g>

                    {/* borboleta 3 */}
                    <g transform="translate(400 180)">
                        <ellipse cx={0} cy={0} rx={8} ry={13} fill="#c060a0" opacity={0.82} />
                        <ellipse cx={0} cy={0} rx={8} ry={13} fill="#c060a0" opacity={0.82} transform="rotate(70)" />
                        <circle cx={0} cy={0} r={4} fill="#f0d090" opacity={0.95} />
                        <ellipse cx={0} cy={0} rx={6.5} ry={10.5} fill="#e090c0" opacity={0.4} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={6.5} ry={10.5} fill="#e090c0" opacity={0.4} transform="rotate(105)" />
                    </g>

                    {/* borboleta 4 */}
                    <g transform="translate(500 210)">
                        <ellipse cx={0} cy={0} rx={7} ry={11} fill="#b0a0d8" opacity={0.85} />
                        <ellipse cx={0} cy={0} rx={7} ry={11} fill="#b0a0d8" opacity={0.85} transform="rotate(70)" />
                        <circle cx={0} cy={0} r={3.5} fill="#f0d090" opacity={0.95} />
                        <ellipse cx={0} cy={0} rx={5.5} ry={9} fill="#c8b8e8" opacity={0.42} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={5.5} ry={9} fill="#c8b8e8" opacity={0.42} transform="rotate(105)" />
                    </g>

                    {/* borboleta 5 */}
                    <g transform="translate(570 280)">
                        <ellipse cx={0} cy={0} rx={8.5} ry={14} fill="#c060a0" opacity={0.8} />
                        <ellipse cx={0} cy={0} rx={8.5} ry={14} fill="#c060a0" opacity={0.8} transform="rotate(70)" />
                        <circle cx={0} cy={0} r={4.5} fill="#f0d090" opacity={0.95} />
                        <ellipse cx={0} cy={0} rx={7} ry={11.5} fill="#e090c0" opacity={0.38} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={7} ry={11.5} fill="#e090c0" opacity={0.38} transform="rotate(105)" />
                    </g>

                    {/* <!-- pétalas animadas caindo --> */}
                    
                    <ellipse cx={330} cy={340} rx={4} ry={2.8} fill="#f8c0c0" opacity={0.6} />
                    <ellipse cx={400} cy={345} rx={3.5} ry={2.2} fill="#e090c0" opacity={0.6} />
                    <ellipse cx={468} cy={338} rx={4} ry={2.8} fill="#f8c0c0" opacity={0.55} />
                    <ellipse cx={358} cy={352} rx={3.5} ry={2.2} fill="#e090c0" opacity={0.55} />
                    <ellipse cx={435} cy={348} rx={4} ry={2.8} fill="#f8c0c0" opacity={0.55} />
                </g>

                {/* <!-- hills suaves neutros --> */}
                <ellipse cx="200" cy="900" rx="420" ry="190" fill="#e0d8c8" opacity=".5"/>
                <ellipse cx="900" cy="920" rx="650" ry="210" fill="#d8d0c0" opacity=".35"/>
                <ellipse cx="1300" cy="880" rx="380" ry="170" fill="#ddd5c5" opacity=".4"/>

                {/* <!-- === BAMBUS laterais + centro === --> */}
                {/* <!-- esq baixo --> */}
                <rect x="75" y="370" width="9" height="530" rx="4" fill="#9ab87a" opacity=".3"/>
                <rect x="89" y="410" width="7" height="490" rx="3" fill="#88a868" opacity=".25"/>
                <rect x="74" y="450" width="11" height="3" rx="1" fill="#6a9848" opacity=".3"/>
                <rect x="74" y="560" width="11" height="3" rx="1" fill="#6a9848" opacity=".3"/>
                <ellipse cx="63" cy="440" rx="20" ry="6" fill="#98c070" opacity=".28" transform="rotate(-30 63 440)"/>

                {/* <!-- bambu centro-esq --> */}
                <rect x="340" y="600" width="8" height="300" rx="4" fill="#9ab87a" opacity=".2"/>
                <rect x="338" y="660" width="10" height="3" rx="1" fill="#6a9848" opacity=".2"/>
                <ellipse cx="328" cy="650" rx="18" ry="6" fill="#a0c878" opacity=".18" transform="rotate(-28 328 650)"/>

                {/* <!-- === ELEMENTOS AZUIS === --> */}
                {/* <!-- bolinha azul topo esq --> */}
                <circle cx="320" cy="60" r="28" fill="#b8cce8" opacity=".35"/>
                <circle cx="320" cy="60" r="18" fill="#9ab8e0" opacity=".2"/>
                {/* <!-- arco azul meio dir --> */}
                <path d="M1220 350 Q1280 280 1340 350" fill="none" stroke="#7a9acc" stroke-width="3" opacity=".35" stroke-linecap="round"/>
                <path d="M1230 370 Q1290 300 1350 370" fill="none" stroke="#9ab8e0" stroke-width="2" opacity=".25" stroke-linecap="round"/>

            
                {/* <!-- === ELEMENTOS LILÁS / ROXO === --> */}
                {/* <!-- bolinha lilás dir alto --> */}
                <circle cx="1050" cy="100" r="36" fill="#c8b8e8" opacity=".3"/>
                <circle cx="1050" cy="100" r="22" fill="#b0a0d8" opacity=".2"/>

                {/* <!-- === ELEMENTOS BRANCOS / NEUTROS === --> */}
                {/* <!-- anel branco fundo esq --> */}
                <circle cx="260" cy="770" r="40" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>
                <circle cx="260" cy="770" r="26" fill="none" stroke="#fff" stroke-width="2" opacity=".2"/>

                {/* <!-- === ELEMENTOS PRETOS (linhas finas elegantes) === --> */}
                {/* <!-- linha diagonal preta suave topo --> */}
                <line x1="430" y1="20" x2="520" y2="110" stroke="#2e2820" stroke-width="1" opacity=".1" stroke-linecap="round"/>
                <line x1="445" y1="20" x2="535" y2="110" stroke="#2e2820" stroke-width="1" opacity=".07" stroke-linecap="round"/>
                {/* <!-- pontinho preto trio esq --> */}
                <circle cx="190" cy="320" r="4" fill="#2e2820" opacity=".15"/>
                <circle cx="204" cy="312" r="3" fill="#2e2820" opacity=".12"/>
                <circle cx="196" cy="332" r="2.5" fill="#2e2820" opacity=".1"/>
                {/* <!-- pontinho preto dir baixo --> */}
                <circle cx="1150" cy="580" r="4.5" fill="#2e2820" opacity=".14"/>
                <circle cx="1164" cy="570" r="3" fill="#2e2820" opacity=".1"/>
                {/* <!-- linha ondulada preta suave centro baixo --> */}
                <path d="M580 860 Q620 848 660 860 Q700 872 740 860" fill="none" stroke="#2e2820" stroke-width="1.2" opacity=".1" stroke-linecap="round"/>
                </svg>
            </div>

            

            <section id="guests">
                <div className="sec-label">Lista de convidados</div>
                <div className="sec-title">Quem vai aparecer?</div>
                <div className="sec-sub">18 confirmados · 5 aguardando resposta</div>
                <GuestGrid guests={guests} />
            </section>
            
            <hr className="divider"/>

            <section id="tickets">
            <div className="sec-label">Ingressos</div>
            <div className="sec-title">Garanta sua vaga</div>
            <div className="sec-sub">Escolha o tipo de ingresso que combina com você.</div>
            <div className="counter-bar glass">
                <div><div className="clabel">Vagas preenchidas</div><div className="cnum">19 / 30</div></div>
                <div className="pbar"><div className="pfill"></div></div>
                <div style={{ fontSize: "12px", color: "var(--tl)" }}>11 vagas restantes</div>
            </div>
            <div className="ticket-grid">
                <div className="ticket glass">
                <div className="ticket-top">
                    <div className="tbadge bg">Básico</div>
                    <div className="ticket-name">Visitante</div>
                    <div className="ticket-desc">Só sábado, sem pernoite. Perfeito pra dar uma chegada!</div>
                    <div className="tfeat"><span className="fd"></span>Acesso sábado</div>
                    <div className="tfeat"><span className="fd"></span>Almoço & churrasco</div>
                    <div className="tfeat"><span className="fd"></span>Todas as atividades</div>
                </div>
                <div className="ticket-bottom">
                    <div className="tprice"><sup>R$</sup>45</div>
                    <button className="tbtn">Comprar</button>
                </div>
                </div>
                <div className="ticket glass">
                <div className="ticket-top">
                    <div className="tbadge bp">Popular</div>
                    <div className="ticket-name">Full Weekend</div>
                    <div className="ticket-desc">Sábado e domingo com direito a camping na chácara.</div>
                    <div className="tfeat"><span className="fd"></span>Acesso 2 dias</div>
                    <div className="tfeat"><span className="fd"></span>Café, almoço & churrasco</div>
                    <div className="tfeat"><span className="fd"></span>Área de camping</div>
                    <div className="tfeat"><span className="fd"></span>Kit boas-vindas</div>
                </div>
                <div className="ticket-bottom">
                    <div className="tprice"><sup>R$</sup>90</div>
                    <button className="tbtn">Comprar</button>
                </div>
                </div>
                <div className="ticket glass">
                <div className="ticket-top">
                    <div className="tbadge ba">VIP</div>
                    <div className="ticket-name">Quarto na Casa</div>
                    <div className="ticket-desc">Todo conforto: quarto compartilhado na casa da chácara.</div>
                    <div className="tfeat"><span className="fd"></span>Acesso 2 dias</div>
                    <div className="tfeat"><span className="fd"></span>Quarto compartilhado</div>
                    <div className="tfeat"><span className="fd"></span>Café da manhã especial</div>
                    <div className="tfeat"><span className="fd"></span>Kit premium</div>
                </div>
                <div className="ticket-bottom">
                    <div className="tprice"><sup>R$</sup>140</div>
                    <button className="tbtn">Comprar</button>
                </div>
                </div>
            </div>
            </section>
        </main>
    )
}
