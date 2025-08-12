// Equiz Quântico — MVP focado em mobile
const $ = (s)=>document.querySelector(s);
const el = {
  consent: $('#consent'), quiz: $('#quiz'), result: $('#result'),
  bar: $('#bar'), step: $('#step'), qtitle: $('#qtitle'), opts: $('#opts'),
  back: $('#btnBack'), next: $('#btnNext'),
  archTitle: $('#archTitle'), archCopy: $('#archCopy'), tags: $('#tags'),
  see: $('#btnSee'), retry: $('#btnRetry'), grid: $('#grid'),
  accept: $('#btnAccept'), decline: $('#btnDecline')
};

// Perguntas indiretas (A/B/C/D) — 4 arquétipos
const QUIZ = [
  { q:"No seu ritual diário, o que te coloca em movimento primeiro?",
    opts:[
      {t:"Assumir o controle do dia", a:"Soberana"},
      {t:"Testar uma ideia nova", a:"Visionária"},
      {t:"Cuidar de quem você ama", a:"Romântica"},
      {t:"Escolher o essencial com calma", a:"Eterna"}
    ]},
  { q:"Ao montar um look para hoje, você busca…",
    opts:[
      {t:"Estrutura que impõe respeito", a:"Soberana"},
      {t:"Texturas/recortes inesperados", a:"Visionária"},
      {t:"Delicadeza e aconchego", a:"Romântica"},
      {t:"Linhas limpas que duram", a:"Eterna"}
    ]},
  { q:"Qual elogio te descreve melhor agora?",
    opts:[
      {t:"Imponente", a:"Soberana"},
      {t:"Inventiva", a:"Visionária"},
      {t:"Afetuosa", a:"Romântica"},
      {t:"Elegante", a:"Eterna"}
    ]},
  { q:"Se seu guarda-roupa fosse um mantra, seria…",
    opts:[
      {t:"Presença é proteção", a:"Soberana"},
      {t:"Crio futuros leves", a:"Visionária"},
      {t:"Estética que abraça", a:"Romântica"},
      {t:"Atemporal é liberdade", a:"Eterna"}
    ]},
];

// Cópias "quânticas" — narrativas adaptadas por hesitação
const COPY = {
  Soberana:(sig)=> `Você move o ambiente sem esforço. ${sig.hesita ? "Sua pausa revela sabedoria estratégica — poder que escuta antes de agir." : "Você escolhe e o mundo se organiza."}`,
  Visionária:(sig)=> `Você vê o contorno do amanhã. ${sig.hesita ? "A hesitação foi combustível criativo — sua intuição está desenhando caminhos." : "Seu impulso inaugura possibilidade."}`,
  Romântica:(sig)=> `Você torna o cotidiano mais humano. ${sig.hesita ? "A pausa indica cuidado — sua estética conversa com afeto." : "Você flui com leveza e calor."}`,
  Eterna:(sig)=> `Você escolhe o que permanece. ${sig.hesita ? "Sua calma lapida escolhas — elegância essencial." : "Clareza direta, sem ruído."}`
};

// Curadoria mock (12 itens) — substituirá pela Content API
const CURA = {
  Soberana: [
    {t:"Sobretudo Bell", p:389.90, img:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/sobretudo-bell?utm_source=equiz&utm_medium=quiz&utm_campaign=Soberana"},
    {t:"Pantalona Cely", p:426.70, img:"https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/pantalona-cely?utm_source=equiz&utm_medium=quiz&utm_campaign=Soberana"}
  ],
  Visionária: [
    {t:"Top Ingrid Tech", p:184.20, img:"https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/top-ingrid?utm_source=equiz&utm_medium=quiz&utm_campaign=Visionaria"},
    {t:"Calça Maltha", p:426.70, img:"https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/calca-maltha?utm_source=equiz&utm_medium=quiz&utm_campaign=Visionaria"}
  ],
  Romântica: [
    {t:"Vestido Karin", p:349.90, img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/vestido-karin?utm_source=equiz&utm_medium=quiz&utm_campaign=Romentica"},
    {t:"Top Amora", p:99.90, img:"https://images.unsplash.com/photo-1520975867597-0f5f8d38982b?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/top-amora?utm_source=equiz&utm_medium=quiz&utm_campaign=Romentica"}
  ],
  Eterna: [
    {t:"Camisa Ícone", p:419.90, img:"https://images.unsplash.com/photo-1519741498318-158f6ab2cfeb?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/camisa-icone?utm_source=equiz&utm_medium=quiz&utm_campaign=Eterna"},
    {t:"Tricot Clássico", p:281.20, img:"https://images.unsplash.com/photo-1520975867684-65e0e6b1a6f7?q=80&w=900&auto=format&fit=crop", url:"https://www.anitavoss.com.br/tricot-classico?utm_source=equiz&utm_medium=quiz&utm_campaign=Eterna"}
  ]
};
// duplicar para total ~12 itens
Object.keys(CURA).forEach(k=>{
  const base = CURA[k];
  while(base.length<12){ base.push({...base[base.length%2], t: base[base.length%2].t+" • "+(base.length+1)}) }
});

let allowVoice = false;
let i=0, picks=Array(QUIZ.length).fill(null), scores={"Soberana":0,"Visionária":0,"Romântica":0,"Eterna":0};
let startTs=0, hesitations=0;

function money(n){ try{ return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);}catch{return "R$ "+Number(n).toFixed(2);} }

function show(id){ [el.consent, el.quiz, el.result].forEach(s=>s.classList.add('hidden')); id.classList.remove('hidden'); }

// Consent
el.accept.addEventListener('click', ()=>{ allowVoice = true; begin(); });
el.decline.addEventListener('click', ()=>{ allowVoice = false; begin(); });

function begin(){ i=0; picks.fill(null); Object.keys(scores).forEach(k=>scores[k]=0); hesitations=0; show(el.quiz); renderQ(); }

function renderQ(){
  el.bar.style.width = (i/QUIZ.length*100)+'%';
  el.step.textContent = `Pergunta ${i+1} de ${QUIZ.length}`;
  const q = QUIZ[i]; el.qtitle.textContent = q.q;
  el.opts.innerHTML = q.opts.map((o,idx)=>`<button class="opt" data-idx="${idx}">${o.t}</button>`).join('');
  el.next.disabled = picks[i]===null;
  el.back.disabled = i===0;
  startTs = performance.now();
}

el.opts.addEventListener('click', (ev)=>{
  const btn = ev.target.closest('.opt'); if(!btn) return;
  const idx = Number(btn.dataset.idx);
  [...el.opts.children].forEach(c=>c.classList.remove('selected'));
  btn.classList.add('selected');
  picks[i]=idx; el.next.disabled=false;
});

el.next.addEventListener('click', ()=>{
  if(picks[i]==null) return;
  const dt = (performance.now()-startTs)/1000;
  if(dt>3) hesitations++;
  const choice = QUIZ[i].opts[picks[i]].a;
  scores[choice]++;
  i++;
  if(i<QUIZ.length) renderQ(); else finish();
});
el.back.addEventListener('click', ()=>{ if(i===0) return; i--; renderQ(); });

function finish(){
  const winner = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  const sig = { hesita: hesitations>0, h: hesitations, total: QUIZ.length };
  const txt = COPY[winner](sig);
  show(el.result);
  el.archTitle.textContent = winner;
  el.archCopy.textContent = txt;
  el.tags.innerHTML = [`Afinidade ${scores[winner]}/${QUIZ.length}`, sig.h>0?`Hesitação ×${sig.h}`:"Resposta fluida", "Equiz Quântico"]
    .map(t=>`<span class="tag">${t}</span>`).join('');
  if(allowVoice) speak(`Seu arquétipo é ${winner}. ${txt}`);
}

function speak(text){
  try{
    if('speechSynthesis' in window){
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR'; u.rate = 1; u.pitch = 1;
      window.speechSynthesis.speak(u);
    }
  }catch(e){ console.log('voice fail', e); }
}

el.retry.addEventListener('click', ()=>{ show(el.consent); });

el.see.addEventListener('click', ()=>{
  const arc = el.archTitle.textContent.trim();
  const list = (CURA[arc]||[]).slice(0,12);
  el.grid.innerHTML = list.map(p=>`
    <article class="item">
      <img src="${p.img}" alt="${p.t}" loading="lazy"/>
      <div class="body">
        <div class="title">${p.t}</div>
        <div class="price">${money(p.p)}</div>
      </div>
      <a class="btn cta" href="${p.url}" target="_blank" rel="noopener">Comprar</a>
    </article>
  `).join('');
});

// === AR-lite decorativo sem libs: gradiente animado no canvas ===
(function animateBg(){
  const c = document.getElementById('bg'); if(!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = innerWidth; c.height = innerHeight; }
  addEventListener('resize', resize, {passive:true}); resize();
  let t=0;
  function loop(){
    t+=0.004;
    const w=c.width,h=c.height; const cx=w/2, cy=h/2;
    const g = ctx.createRadialGradient(cx,cy,Math.min(w,h)*0.1*Math.abs(Math.sin(t)), cx,cy,Math.max(w,h));
    g.addColorStop(0, 'rgba(155,123,255,0.55)');
    g.addColorStop(1, 'rgba(0,0,0,0.0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    requestAnimationFrame(loop);
  }
  loop();
})();

// === Simulação 10 usuárias no console ===
(function simulate(){
  const A = ["Soberana","Visionária","Romântica","Eterna"];
  let out = Array.from({length:10}, (_,k)=>`Usuária ${k+1}: ${A[Math.floor(Math.random()*4)]}`);
  console.log("%cSimulação Equiz (10 usuárias):","color:#9b7bff;font-weight:700"); console.log(out.join("\n"));
})();

// === Script TikTok 15s (console) ===
console.log(`TikTok 15s:
0-2s: Close no rosto + texto "Qual é sua essência?"
2-6s: 2 perguntas rápidas na tela com barra preta crescendo
6-10s: Resultado com voz sussurrada "Seu arquétipo é..."
10-15s: 2 looks sugeridos + CTA "Descubra o seu • link na bio"`);
