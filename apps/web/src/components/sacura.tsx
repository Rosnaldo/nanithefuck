export function Sacura() {
    return (
        <div id="sacura" className="absolute md:bottom-14 bottom-0 w-full h-[400px]">
            <div className="w-full h-full px-8 md:px-16">
            <svg
                viewBox="100 50 600 590"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
            >
                <g>
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


                    {/* <!-- borboleta 1 - rosa, esq alto --> */}
                    <g transform="translate(185,185)" style={{ fill: "rgb(0, 0, 0)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 1, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                        <animateTransform attributeName="transform" type="translate" values="185,185;185,185" dur="0s" repeatCount="indefinite" />
                        <g id="bfly1">
                        <ellipse cx={0} cy={0} rx={8} ry={14} fill="#c060a0" opacity={0.85}><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.4s" repeatCount="indefinite" /></ellipse>
                        <ellipse cx={0} cy={0} rx={8} ry={14} fill="#c060a0" opacity={0.85} transform="rotate(70)"><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.4s" repeatCount="indefinite" additive="sum" /></ellipse>
                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#e090c0" opacity={0.4} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#e090c0" opacity={0.4} transform="rotate(105)" />
                        <circle cx={0} cy={0} r={4} fill="#f0d090" opacity={0.95} />
                        </g>
                    </g>

                    {/* <!-- borboleta 2 - lilás, dir alto --> */}
                    <g transform="translate(590,155)" style={{ fill: "rgb(0, 0, 0)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 1, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                        <g>
                        <ellipse cx={0} cy={0} rx={7.5} ry={12} fill="#b0a0d8" opacity={0.88}><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.7s" begin="0.3s" repeatCount="indefinite" /></ellipse>
                        <ellipse cx={0} cy={0} rx={7.5} ry={12} fill="#b0a0d8" opacity={0.88} transform="rotate(70)"><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.7s" begin="0.3s" repeatCount="indefinite" additive="sum" /></ellipse>
                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#c8b8e8" opacity={0.45} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#c8b8e8" opacity={0.45} transform="rotate(105)" />
                        <circle cx={0} cy={0} r={3.5} fill="#f0d090" opacity={0.95} />
                        </g>
                    </g>

                    {/* <!-- borboleta 3 - rosa, dir meio --> */}
                    <g transform="translate(555,255)" style={{ fill: "rgb(0, 0, 0)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 1, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                        <g>
                        <ellipse cx={0} cy={0} rx={8} ry={13} fill="#c060a0" opacity={0.82}><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.5s" begin="0.6s" repeatCount="indefinite" /></ellipse>
                        <ellipse cx={0} cy={0} rx={8} ry={13} fill="#c060a0" opacity={0.82} transform="rotate(70)"><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.5s" begin="0.6s" repeatCount="indefinite" additive="sum" /></ellipse>
                        <ellipse cx={0} cy={0} rx={6.5} ry={10.5} fill="#e090c0" opacity={0.4} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={6.5} ry={10.5} fill="#e090c0" opacity={0.4} transform="rotate(105)" />
                        <circle cx={0} cy={0} r={4} fill="#f0d090" opacity={0.95} />
                        </g>
                    </g>

                    {/* <!-- borboleta 4 - lilás, esq baixo --> */}
                    <g transform="translate(165,300)" style={{ fill: "rgb(0, 0, 0)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 1, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                        <g>
                        <ellipse cx={0} cy={0} rx={7} ry={11} fill="#b0a0d8" opacity={0.85}><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.8s" begin="0.1s" repeatCount="indefinite" /></ellipse>
                        <ellipse cx={0} cy={0} rx={7} ry={11} fill="#b0a0d8" opacity={0.85} transform="rotate(70)"><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.8s" begin="0.1s" repeatCount="indefinite" additive="sum" /></ellipse>
                        <ellipse cx={0} cy={0} rx={5.5} ry={9} fill="#c8b8e8" opacity={0.42} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={5.5} ry={9} fill="#c8b8e8" opacity={0.42} transform="rotate(105)" />
                        <circle cx={0} cy={0} r={3.5} fill="#f0d090" opacity={0.95} />
                        </g>
                    </g>

                    {/* <!-- borboleta 5 - rosa, centro acima copa --> */}
                    <g transform="translate(400,140)" style={{ fill: "rgb(0, 0, 0)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 1, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                        <g>
                        <ellipse cx={0} cy={0} rx={8.5} ry={14} fill="#c060a0" opacity={0.8}><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.6s" begin="0.5s" repeatCount="indefinite" /></ellipse>
                        <ellipse cx={0} cy={0} rx={8.5} ry={14} fill="#c060a0" opacity={0.8} transform="rotate(70)"><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.6s" begin="0.5s" repeatCount="indefinite" additive="sum" /></ellipse>
                        <ellipse cx={0} cy={0} rx={7} ry={11.5} fill="#e090c0" opacity={0.38} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={7} ry={11.5} fill="#e090c0" opacity={0.38} transform="rotate(105)" />
                        <circle cx={0} cy={0} r={4.5} fill="#f0d090" opacity={0.95} />
                        </g>
                    </g>

                    {/* <!-- borboleta 6 - lilás, dir cima copa --> */}
                    <g transform="translate(510,210)" style={{ fill: "rgb(0, 0, 0)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 1, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                        <g>
                        <ellipse cx={0} cy={0} rx={7.5} ry={12} fill="#b0a0d8" opacity={0.82}><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.9s" begin="0.8s" repeatCount="indefinite" /></ellipse>
                        <ellipse cx={0} cy={0} rx={7.5} ry={12} fill="#b0a0d8" opacity={0.82} transform="rotate(70)"><animateTransform attributeName="transform" type="scale" values="1,1;0.2,1;1,1" keyTimes="0;0.4;1" dur="1.9s" begin="0.8s" repeatCount="indefinite" additive="sum" /></ellipse>
                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#c8b8e8" opacity={0.44} transform="rotate(35)" />
                        <ellipse cx={0} cy={0} rx={6} ry={10} fill="#c8b8e8" opacity={0.44} transform="rotate(105)" />
                        <circle cx={0} cy={0} r={3.5} fill="#f0d090" opacity={0.95} />
                        </g>
                    </g>

                    {/* <!-- pétalas animadas caindo --> */}
                    
                    <ellipse cx={330} cy={340} rx={4} ry={2.8} fill="#f8c0c0" opacity={0} style={{ fill: "rgb(248, 192, 192)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.507766, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                    <animate attributeName="cy" values="340;430" dur="6s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="cx" values="330;362" dur="6s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="opacity" values="0;0.6;0.5;0" keyTimes="0;0.1;0.85;1" dur="6s" repeatCount="indefinite" begin="0s" />
                    <animateTransform attributeName="transform" type="rotate" values="0 330 340;180 362 430" dur="6s" repeatCount="indefinite" begin="0s" />
                    </ellipse>
                    <ellipse cx={400} cy={340} rx={3.5} ry={2.2} fill="#e090c0" opacity={0} style={{ fill: "rgb(224, 144, 192)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.356886, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                    <animate attributeName="cy" values="340;440" dur="7s" repeatCount="indefinite" begin="1.5s" />
                    <animate attributeName="cx" values="400;378" dur="7s" repeatCount="indefinite" begin="1.5s" />
                    <animate attributeName="opacity" values="0;0.6;0.5;0" keyTimes="0;0.1;0.85;1" dur="7s" repeatCount="indefinite" begin="1.5s" />
                    <animateTransform attributeName="transform" type="rotate" values="0 400 340;150 378 440" dur="7s" repeatCount="indefinite" begin="1.5s" />
                    </ellipse>
                    <ellipse cx={468} cy={338} rx={4} ry={2.8} fill="#f8c0c0" opacity={0} style={{ fill: "rgb(248, 192, 192)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.595138, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                    <animate attributeName="cy" values="338;428" dur="5.5s" repeatCount="indefinite" begin="3s" />
                    <animate attributeName="cx" values="468;508" dur="5.5s" repeatCount="indefinite" begin="3s" />
                    <animate attributeName="opacity" values="0;0.6;0.5;0" keyTimes="0;0.1;0.85;1" dur="5.5s" repeatCount="indefinite" begin="3s" />
                    <animateTransform attributeName="transform" type="rotate" values="0 468 338;200 508 428" dur="5.5s" repeatCount="indefinite" begin="3s" />
                    </ellipse>
                    <ellipse cx={358} cy={350} rx={3.5} ry={2.2} fill="#e090c0" opacity={0} style={{ fill: "rgb(224, 144, 192)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.0206083, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                    <animate attributeName="cy" values="350;450" dur="8s" repeatCount="indefinite" begin="0.8s" />
                    <animate attributeName="cx" values="358;323" dur="8s" repeatCount="indefinite" begin="0.8s" />
                    <animate attributeName="opacity" values="0;0.6;0.5;0" keyTimes="0;0.1;0.85;1" dur="8s" repeatCount="indefinite" begin="0.8s" />
                    <animateTransform attributeName="transform" type="rotate" values="0 358 350;130 323 450" dur="8s" repeatCount="indefinite" begin="0.8s" />
                    </ellipse>
                    <ellipse cx={435} cy={345} rx={4} ry={2.8} fill="#f8c0c0" opacity={0} style={{ fill: "rgb(248, 192, 192)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.561015, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }}>
                    <animate attributeName="cy" values="345;435" dur="6.5s" repeatCount="indefinite" begin="2.2s" />
                    <animate attributeName="cx" values="435;460" dur="6.5s" repeatCount="indefinite" begin="2.2s" />
                    <animate attributeName="opacity" values="0;0.6;0.5;0" keyTimes="0;0.1;0.85;1" dur="6.5s" repeatCount="indefinite" begin="2.2s" />
                    <animateTransform attributeName="transform" type="rotate" values="0 435 345;170 460 435" dur="6.5s" repeatCount="indefinite" begin="2.2s" />
                    </ellipse>

                    {/* <!-- borda da bolha --> */}
                    <circle cx={400} cy={320} r={285} fill="url(#bolhaGrad)" stroke="#b8cce8" strokeWidth={1.2} opacity={0.55} style={{ stroke: "rgb(184, 204, 232)", color: "rgb(0, 0, 0)", strokeWidth: "1.2px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.55, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }} />
                    <ellipse cx={300} cy={220} rx={70} ry={28} fill="url(#brilhoGrad)" transform="rotate(-35 300 185)" opacity={0.7} style={{ stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.7, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }} />
                    <ellipse cx={530} cy={220} rx={28} ry={10} fill="#ffffff" opacity={0.18} transform="rotate(20 530 220)" style={{ fill: "rgb(255, 255, 255)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.18, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }} />
                    <ellipse cx={420} cy={615} rx={40} ry={12} fill="#ffffff" opacity={0.08} transform="rotate(-10 420 615)" style={{ fill: "rgb(255, 255, 255)", stroke: "none", color: "rgb(0, 0, 0)", strokeWidth: "1px", strokeLinecap: "butt", strokeLinejoin: "miter", opacity: 0.08, fontFamily: "Anthropic Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "16px", fontWeight: 400, textAnchor: "start", dominantBaseline: "auto" }} />
                </g>
            </svg>
        </div>
        </div>
    )
}
