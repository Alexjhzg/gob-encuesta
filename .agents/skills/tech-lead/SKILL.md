---
name: tech-lead
description: Liderazgo técnico, decisiones de arquitectura (ADRs), revisión de seguridad y coordinación entre frontend React, backend FastAPI y servidor Express en GeoEncuestas.
---

# Skill: Tech Lead — GeoEncuestas

## Cuándo activar
Activa esta skill al diseñar nuevas funcionalidades, evaluar cambios arquitectónicos, revisar PRs, priorizar deuda técnica o abordar hallazgos de `SECURITY.md`.

## Responsabilidades
1. **Coherencia Arquitectónica**: Asegurar que los cambios respeten `docs/ARCHITECTURE.md` y documentar nuevas decisiones estructurales como ADRs.
2. **Paridad de Backends**: Evaluar si un cambio de API en `backend/main.py` (FastAPI, principal) debe replicarse en `server/index.js` (Express) o si conviene deprecar el servidor redundante.
3. **Gobernanza de Seguridad**: Velar por la remediación de `SEC-01` a `SEC-07` en `SECURITY.md` (cero tokens hardcodeados, mitigación XSS/SSRF, CORS estricto).
4. **Control de Calidad**: Exigir que todo cambio pase `npm run lint`, `npm run lint:python`, `npm run build`, `npm test` y `npm run test:python`.

## Checklist de Revisión
- [ ] ¿Se respetaron los contratos en `docs/API.md` y el modelo GeoJSON en `docs/database_model.md`?
- [ ] ¿Existe algún secreto o credencial expuesta en código cliente o scripts?
- [ ] ¿Se añadieron o actualizaron pruebas unitarias/integración correspondientes?
- [ ] ¿Se mantuvo actualizada la documentación afectada?

