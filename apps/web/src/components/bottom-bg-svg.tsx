import { useIsMobile } from "@/hooks/useIsMobile";
import { Sacura } from "./sacura";

export function BottomBgSvg() {
    const isMobile = useIsMobile()

    return (
        <div id="bottom-bg-svg" className="absolute bottom-0 left-0 w-full h-[135vh] z-0 pointer-events-none overflow-hidden">
            <Sacura />

            <svg className="w-full h-full absolute top-0 left-0">
                {/* <!-- hills suaves neutros --> */}
                <ellipse cx="200" cy="1000" rx="420" ry="190" fill="#e0d8c8" opacity=".5"/>
                <ellipse cx="900" cy="1020" rx="650" ry="210" fill="#d8d0c0" opacity=".35"/>
                <ellipse cx="1300" cy="1080" rx="380" ry="170" fill="#ddd5c5" opacity=".4"/>

                {/* <!-- === BAMBUS laterais + centro === --> */}
                {/* <!-- esq baixo --> */}
                {!isMobile && (
                    <>
                        <rect x="75" y="370" width="9" height="530" rx="4" fill="#9ab87a" opacity=".3"/>
                        <rect x="89" y="410" width="7" height="490" rx="3" fill="#88a868" opacity=".25"/>
                        <rect x="74" y="450" width="11" height="3" rx="1" fill="#6a9848" opacity=".3"/>
                        <rect x="74" y="560" width="11" height="3" rx="1" fill="#6a9848" opacity=".3"/>
                        <ellipse cx="63" cy="440" rx="20" ry="6" fill="#98c070" opacity=".28" transform="rotate(-30 63 440)"/>
                    </>
                )}

                {/* <!-- bambu centro-esq --> */}
                {!isMobile && (
                    <>
                        <rect x="340" y="600" width="8" height="300" rx="4" fill="#9ab87a" opacity=".2"/>
                        <rect x="338" y="660" width="10" height="3" rx="1" fill="#6a9848" opacity=".2"/>
                        <ellipse cx="328" cy="650" rx="18" ry="6" fill="#a0c878" opacity=".18" transform="rotate(-28 328 650)"/>
                    </>
                )}

                {/* <!-- === ELEMENTOS AZUIS === --> */}
                {/* <!-- bolinha azul topo esq --> */}
                <circle cx="320" cy="300" r="28" fill="#b8cce8" opacity=".35"/>
                <circle cx="320" cy="300" r="18" fill="#9ab8e0" opacity=".2"/>

                {/* <!-- arco azul meio dir --> */}
                <path d="M1220 350 Q1280 280 1340 350" fill="none" stroke="#7a9acc" stroke-width="3" opacity=".35" stroke-linecap="round"/>
                <path d="M1230 370 Q1290 300 1350 370" fill="none" stroke="#9ab8e0" stroke-width="2" opacity=".25" stroke-linecap="round"/>

                {/* <!-- === ELEMENTOS LILÁS / ROXO === --> */}
                {/* <!-- bolinha lilás dir alto --> */}
                <circle cx="1050" cy="450" r="36" fill="#c8b8e8" opacity=".3"/>
                <circle cx="1050" cy="450" r="22" fill="#b0a0d8" opacity=".2"/>

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
    )
}
