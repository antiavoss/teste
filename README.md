# Equiz Suite (API + Web demo)

Este repositório contém:
- **api/** — Cloud Run API (Express) com `/health` e `/products?arch=Soberana`.
- **web/** — Página estática que consome a API e mostra os produtos.

## Rodar localmente
```bash
cd api
npm install
npm start
# http://localhost:8080/health
# http://localhost:8080/products?arch=Soberana
```
Abra `web/index.html` em um navegador; por padrão ele chama `http://localhost:8080/products?...`

## Deploy no Cloud Run (resumo)
1. Suba este repositório no GitHub.
2. No Cloud Run, escolha "Implantação contínua a partir do GitHub".
3. Em variáveis de ambiente, acrescente `GOOGLE_MERCHANT_ID` (opcional por enquanto).
4. Conclua o deploy. Teste:
   - `https://<servico>.run.app/health`
   - `https://<servico>.run.app/products?arch=Eterna`

> A integração com a **Google Content API** pode ser adicionada dentro de `loadCatalog()`.
> Enquanto isso, a API usa `products_sample.json` como fallback.