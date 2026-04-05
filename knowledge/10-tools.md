# Herramientas y Stack

Last updated: April 5, 2026

---

## Stack actual

| Herramienta | Costo | Rol |
|-------------|-------|-----|
| Perplexity Max | $200 USD/mes | IA primaria — estrategia, research, escritura, operaciones, memoria, monitoreo, orquestación |
| Claude Max + Claude Code | $200 USD/mes | Desarrollo — construye código, ejecuta tickets, deploya |
| Paperclip | Gratis (self-hosted en Mac Mini) | HQ dashboard — orquestación de agentes, sistema de tickets, visibilidad |
| GoHighLevel | $97 USD/mes | SOLO para Dr. Ramírez (booking de citas + recordatorios). Evaluando reemplazo con Easy!Appointments |
| Google Workspace | ~$7 USD/mes | Email profesional (contacto@luisracosta.com), Meet para llamadas con clientes |
| X Premium | $8 USD/mes | Marca personal en X |
| GitHub | Gratis (org even-admin) | Repositorios de código |
| Todoist | Gratis/existente | Gestión de tareas (simple, directo) |
| TrainingPeaks | ~$20 USD/mes | Gestión de entrenamiento para triatlón |

**DROPPED:** Manus AI ($899 MXN/mes) — completamente removido del stack.

**PLANNED:** HubSpot — CRM personal para gestión de pipeline. Requisito clave: integración.

---

## Arquitectura

| Rol | Herramienta |
|-----|-------------|
| Operador / estratega | [P] Perplexity |
| Hands / builder | Claude Code |
| HQ / orquestación | Paperclip |
| Board / aprobador | Luis |

---

## Infraestructura física

- **Mac Mini (oficina):** servidor siempre encendido — corre Paperclip HQ.
- **Laptop:** trabajo móvil.

---

## Servicios conectados

Gmail + Calendar (gcal), Slack (slack_direct), GitHub (github_mcp_direct), Google Drive, Todoist.

---

## Filosofía de herramientas

"No me importa si es open source, corre local, o si pagamos por ello — lo único que quiero de una herramienta es integración."

- **API-friendly.** Si no tiene API o no se integra con agentes, no sirve.
- **Ecosistemas abiertos > plataformas cerradas.**

---

## Desarrollo

- **Frontend:** React + Tailwind + shadcn/ui
- **Org GitHub:** even-admin
- **Task management:** Todoist — tareas "simples, directas, sin descripción larga"

---

## Monitoreo activo (Perplexity crons)

| Cron | Qué hace | Cuándo |
|------|----------|--------|
| Monday Briefing | Resumen semanal: inbox, calendario, clientes, prioridades | Lunes 8:30 AM CST |

---

## Preferencias de UI

- Clean, blanco, relajado. Estilo Notion/iOS.
- **No** temas oscuros robóticos ni "digital confidential."
- Armonioso, claro, minimalista.
