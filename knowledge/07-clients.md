# Clientes

Last updated: April 5, 2026

---

## Dr. Luis Alberto Ramírez López — Neurocirugía

| Campo | Detalle |
|-------|---------|
| Retainer | $12,000 MXN/mes |
| Status | Activo |
| Especialidad | Neurocirujano |
| Ubicaciones | Faro del Mayab, Star Médica (Mérida) |
| Relación | Es mi padre. Tratar con profesionalismo. |
| Comunicación | TODO vía WhatsApp |
| Website | dr-luis-merida (deployed) |

### Infraestructura actual

**GHL:** solo para booking de citas y recordatorios/seguimientos. No se usa para CRM completo.
- **Problema abierto:** el Dr. quiere notificaciones en el teléfono cuando alguien agenda. LeadConnector app es una basura para esto.
- **Alternativa en evaluación:** Easy!Appointments (GitHub, self-hosted, Google Calendar sync, notificaciones por email)

**Emails automatizados activos:**
- Confirmación de cita
- Recordatorio 2 días antes
- Post-visita: gracias + solicitud de reseña en Google

**ISSUE ABIERTO:** El link de reseña Google en el email post-visita tiene un placeholder roto: `[LINK_RESENA_GOOGLE]` — necesita corregirse.

### Documentación existente
GHL prompts, workflows de launch, mapa de operaciones y copy de emails documentados.

### Estrategia
**Fundamentos primero, automatización después.**

Las secretarias mantienen su proceso de agendar citas. NO las reemplazamos. Construimos el ecosistema digital alrededor de ellas.

### Pipeline GHL (diseñado)
1. Nuevo lead
2. Contactado
3. Cita agendada
4. No se presentó / Reagendar
5. Consulta inicial
6. En estudios
7. Candidato a cirugía
8. Cirugía programada
9. Posoperatorio
10. Alta / Mantenimiento

---

## Servimueble

| Campo | Detalle |
|-------|---------|
| Retainer | $12,000 MXN/mes |
| Status | Activo |
| Tipo | Empresa de muebles en Mérida |
| Responsable | Diego — maneja esta cuenta de forma independiente |

Luis solo hace check-in ocasional y ayuda cuando se necesita. Esta es la cuenta de Diego.

---

## Notas globales

- Toda comunicación con clientes es por WhatsApp
- Deliverables siempre en español mexicano
- Nunca enviar comunicaciones a clientes sin revisión explícita de Luis
