/* Equiz Products API - Minimal Cloud Run service (Express + CORS)
 * Endpoints:
 *  - GET /health -> {status:"ok"}
 *  - GET /products?arch=Soberana&limit=12 -> curated list
 *
 * Content API integration (optional): add GOOGLE_MERCHANT_ID and grant the service account
 * Shopping Content API permissions; replace the 'loadLocalCatalog' with a call to Google API.
 */
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import process from "process";
const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// --- Helpers
const ARCH_KEYS = ["Soberana","Visionária","Romântica","Eterna"];

function scoreItemByArch(item, arch){
  // basic heuristics by keywords & colors
  const t = (item.title || "" + " " + (item.description||"")).toLowerCase();
  const color = (item.color||"").toLowerCase();
  let s = 0;
  if(arch==="Soberana"){
    if(/alfaiat|blazer|sobretudo|estruturad/.test(t)) s+=3;
    if(/preto|grafite|marinho|vinho/.test(color)) s+=1.5;
  }
  if(arch==="Visionária"){
    if(/recorte|assim|tecnol|estampa|kimono/.test(t)) s+=3;
    if(/prata|metal|azul|verde/.test(color)) s+=1.5;
  }
  if(arch==="Romântica"){
    if(/renda|babado|fluido|macio|po|flor/.test(t)) s+=3;
    if(/rosa|nude|marrom|bege/.test(color)) s+=1.5;
  }
  if(arch==="Eterna"){
    if(/clássic|classico|liso|limp[ao]|linho|atemp/.test(t)) s+=3;
    if(/preto|branco|cinza|marinho|off/.test(color)) s+=1.5;
  }
  // price nudge (prefer mid/high)
  const price = Number(item.priceValue||0);
  if(price>=200) s+=0.8;
  return s;
}

function benefitByArch(item, arch){
  const map = {
    Soberana: "Estrutura que sustenta sua presença sem esforço.",
    "Visionária": "Design que abre conversas e libera sua criatividade.",
    "Romântica": "Texturas gentis que acolhem seu ritmo.",
    "Eterna": "Linhas limpas que atravessam o tempo."
  };
  return map[arch]||"";
}

// Load local sample catalog (works offline / dev)
async function loadLocalCatalog(){
  const p = path.join(__dirname, "products_sample.json");
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw);
}

// TODO: hook to Google Content API (left as placeholder for now)
async function loadCatalog(){
  // If you want to integrate Google Content API here, do it and return unified array.
  return await loadLocalCatalog();
}

// --- Routes
app.get("/health", (req,res)=>{
  res.json({status:"ok", service:"equiz-products", time:new Date().toISOString()});
});

app.get("/products", async (req,res)=>{
  try{
    let arch = req.query.arch || "Eterna";
    if(!ARCH_KEYS.includes(arch)) arch = "Eterna";
    const limit = Math.min(parseInt(req.query.limit||"12",10), 60);
    const cat = await loadCatalog();
    // Score, sort, slice
    const scored = cat.map((it)=> ({
      ...it,
      score: scoreItemByArch(it, arch),
      benefit: it.benefit?.[arch] || benefitByArch(it, arch)
    })).sort((a,b)=> b.score - a.score).slice(0, limit);
    res.json({arch, count: scored.length, items: scored});
  }catch(e){
    console.error(e);
    res.status(500).json({error:"failed", message: String(e)});
  }
});

// Static (to serve minimal demo client if deployed together)
app.use("/", express.static(path.join(__dirname, "../web")));

const port = process.env.PORT || 8080;
app.listen(port, ()=>{
  console.log("Equiz Products API listening on port", port);
});