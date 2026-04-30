# Trip Document Management Prototype

Agent-side prototype for the v6 PRD `Trip Based Document Management and Customer Acknowledgment`. Renders the **Agent Documents** tab on a single trip detail page (`Lucas Family Vacation`) with the two-flag model (`client_facing`, `needs_acknowledgment`), the auto-generated Trip Confirmation PDF, and the agent-triggered acknowledgment lifecycle.

Built for an advisory group walkthrough (ACA, ACE, MWG, NE).

## Run

```bash
npm install
npm run dev
```

Lands at `http://localhost:5173/trip/lucas-family-vacation/agent-documents`.

## What is interactive

- Toggle `Client facing` and `Needs acknowledgment` on any row.
- Send for ack on a row with `needs_acknowledgment` on. Status flips to `Sent`. After ~3 seconds, a simulated traveler ack flips it to `Acknowledged`.
- Resend on a `Sent` row invalidates the prior link.
- Upload a new document. Choose document type, optional booking picker (Trip-level or one of the bookings on the trip).
- Delete on agent uploads (Trip Confirmation row is non-deletable per PRD).
- Card overflow menu: `Simulate new booking added` grows the Trip Confirmation PDF; if it was previously acknowledged, a re-ack banner appears.

## Open PRD questions surfaced inline

Small info icons open popovers explaining each open question:

- Re-ack banner → Q13 (re-ack after PDF grows)
- Disabled Delete on Trip Confirmation row → Q12 (deletability)
- Send for ack modal evidence note → Q11 (evidence threshold)

The prototype takes a stance on Q8 (per-trip ack scope, one growing PDF).

## Stack

- Vite 7 + React 18 + TypeScript
- Mantine v7 (bare, no Nomad)
- React Router v6
- In-memory `useSyncExternalStore` store at `src/state/documentStore.ts`
- Vitest

## What's mocked

In-memory state only. No persistence, no backend, no real file storage, no real ack tokens, no email.
