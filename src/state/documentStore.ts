import { useSyncExternalStore } from 'react';
import type { Booking, DocumentRecord, DocumentType, FileFormat, Trip } from '../types';
import { SEED_BOOKINGS, SEED_DOCUMENTS, SEED_TRIP } from '../data/seed';

type DocumentState = {
  trip: Trip;
  bookings: Booking[];
  documents: DocumentRecord[];
};

let state: DocumentState = {
  trip: SEED_TRIP,
  bookings: [...SEED_BOOKINGS],
  documents: SEED_DOCUMENTS.map((d) => ({ ...d })),
};

const listeners = new Set<() => void>();
const ackTimers = new Map<string, ReturnType<typeof setTimeout>>();

function notify() {
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useDocumentStore<T>(selector: (s: DocumentState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

export function getState(): DocumentState {
  return state;
}

export function getDocument(id: string): DocumentRecord | undefined {
  return state.documents.find((d) => d.id === id);
}

function update(updater: (s: DocumentState) => DocumentState) {
  state = updater(state);
  notify();
}

function patchDocument(id: string, patch: Partial<DocumentRecord>) {
  update((s) => ({
    ...s,
    documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
  }));
}

export function toggleClientFacing(id: string) {
  const doc = getDocument(id);
  if (!doc) return;
  patchDocument(id, { clientFacing: !doc.clientFacing });
}

export function toggleNeedsAck(id: string) {
  const doc = getDocument(id);
  if (!doc) return;
  const next = !doc.needsAcknowledgment;
  patchDocument(id, {
    needsAcknowledgment: next,
    acknowledgmentStatus: next ? doc.acknowledgmentStatus : 'not_requested',
  });
}

const ACK_SIMULATION_DELAY_MS = 3000;

function scheduleSimulatedAck(id: string) {
  const existing = ackTimers.get(id);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(() => {
    const doc = getDocument(id);
    if (!doc || doc.acknowledgmentStatus !== 'sent') return;
    patchDocument(id, {
      acknowledgmentStatus: 'acknowledged',
      acknowledgmentCompletedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      pdfDirtySincePreviousAck: false,
    });
    ackTimers.delete(id);
  }, ACK_SIMULATION_DELAY_MS);
  ackTimers.set(id, timer);
}

export function sendForAck(id: string) {
  const doc = getDocument(id);
  if (!doc || !doc.needsAcknowledgment) return;
  patchDocument(id, {
    acknowledgmentStatus: 'sent',
    acknowledgmentRequestedAt: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    acknowledgmentRequestedBy: state.trip.agentName,
    acknowledgmentLinkToken: `tok-${Date.now()}`,
    acknowledgmentCompletedAt: undefined,
  });
  scheduleSimulatedAck(id);
}

export function resendAck(id: string) {
  const doc = getDocument(id);
  if (!doc || doc.acknowledgmentStatus !== 'sent') return;
  patchDocument(id, {
    acknowledgmentRequestedAt: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    acknowledgmentLinkToken: `tok-${Date.now()}`,
  });
  scheduleSimulatedAck(id);
}

export type AddDocumentInput = {
  fileName: string;
  documentType: DocumentType;
  fileFormat: FileFormat;
  fileSizeKb: number;
  clientFacing: boolean;
  needsAcknowledgment: boolean;
  bookingId?: string;
};

export function addDocument(input: AddDocumentInput) {
  const newDoc: DocumentRecord = {
    id: `doc-${Date.now()}`,
    fileName: input.fileName,
    documentType: input.documentType,
    fileFormat: input.fileFormat,
    fileSizeKb: input.fileSizeKb,
    uploadedBy: state.trip.agentName,
    uploadedAt: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    systemGenerated: false,
    deletableByAgent: true,
    clientFacing: input.clientFacing,
    needsAcknowledgment: input.needsAcknowledgment,
    acknowledgmentStatus: 'not_requested',
    bookingId: input.bookingId,
  };
  update((s) => ({ ...s, documents: [...s.documents, newDoc] }));
  return newDoc;
}

export function deleteDocument(id: string) {
  const doc = getDocument(id);
  if (!doc) return;
  if (!doc.deletableByAgent) {
    throw new Error('Document is not deletable by agent');
  }
  update((s) => ({ ...s, documents: s.documents.filter((d) => d.id !== id) }));
}

const SIMULATED_BOOKING_ADDITIONS = [
  {
    id: 'bk-sim-1',
    label: 'Cozumel Catamaran Snorkel',
    startDate: 'Feb 7 2026',
    endDate: 'Feb 7 2026',
  },
  {
    id: 'bk-sim-2',
    label: 'Grand Cayman Stingray City',
    startDate: 'Feb 9 2026',
    endDate: 'Feb 9 2026',
  },
  {
    id: 'bk-sim-3',
    label: 'Princess Premier Beverage Package',
    startDate: 'Feb 5 2026',
    endDate: 'Feb 12 2026',
  },
];

export function simulateNewBooking() {
  const next = SIMULATED_BOOKING_ADDITIONS[state.bookings.length - SEED_BOOKINGS.length] ?? {
    id: `bk-sim-${Date.now()}`,
    label: 'Additional booking',
    startDate: 'Feb 8 2026',
    endDate: 'Feb 8 2026',
  };
  update((s) => {
    const tripConfirmation = s.documents.find(
      (d) => d.systemSubtype === 'trip_confirmation',
    );
    return {
      ...s,
      bookings: [...s.bookings, next],
      documents: s.documents.map((d) => {
        if (d.id !== tripConfirmation?.id) return d;
        const wasAcknowledged = d.acknowledgmentStatus === 'acknowledged';
        return {
          ...d,
          fileSizeKb: d.fileSizeKb + 42,
          uploadedAt: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          pdfDirtySincePreviousAck: wasAcknowledged ? true : d.pdfDirtySincePreviousAck,
        };
      }),
    };
  });
}

export function resetStoreForTests() {
  for (const t of ackTimers.values()) clearTimeout(t);
  ackTimers.clear();
  state = {
    trip: SEED_TRIP,
    bookings: [...SEED_BOOKINGS],
    documents: SEED_DOCUMENTS.map((d) => ({ ...d })),
  };
}
