# Tax-Loss Harvesting Engine Automatizado

Monitora prejuízos, executa vendas fiscais e repõe exposição com ativos correlacionados.

## Stack

- Node.js, PostgreSQL, APIs bancárias/corretora

## Wash Sale

Regras programadas (BR/US configuráveis):

- Janela de 30 dias antes/depois (EUA) — ver `config/wash_sale.yaml`
- Bloqueio de recompra do mesmo ticker
- Permite substituto com correlação > threshold e sector match

## Correlação de substitutos

```
substitute = argmax corr(asset, candidate) 
  s.t. corr > 0.85 AND sector(asset) ≈ sector(candidate)
```

Ex.: FII tijolo A → FII tijolo B (não o mesmo CNPJ do fundo).

## Testes de segurança de capital

```bash
npm test
```

Cobertura: nunca vender abaixo de margem, limites de concentração, idempotência de ordens.

## API

```bash
npm run dev
POST /api/harvest/run { "portfolio_id": "...", "tax_year": 2026 }
```

Documentação: [docs/WASH_SALE.md](docs/WASH_SALE.md) | [docs/CORRELATION.md](docs/CORRELATION.md)
