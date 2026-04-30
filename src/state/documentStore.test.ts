import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addDocument,
  deleteDocument,
  getDocument,
  getState,
  resendAck,
  resetStoreForTests,
  sendForAck,
  simulateNewBooking,
  toggleClientFacing,
  toggleNeedsAck,
} from './documentStore';

describe('documentStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStoreForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('toggleClientFacing flips the flag', () => {
    const before = getDocument('doc-2')!.clientFacing;
    toggleClientFacing('doc-2');
    expect(getDocument('doc-2')!.clientFacing).toBe(!before);
  });

  it('toggleNeedsAck flips the flag and resets status when turning off', () => {
    expect(getDocument('doc-2')!.needsAcknowledgment).toBe(false);
    toggleNeedsAck('doc-2');
    expect(getDocument('doc-2')!.needsAcknowledgment).toBe(true);
    expect(getDocument('doc-2')!.acknowledgmentStatus).toBe('not_requested');
    toggleNeedsAck('doc-2');
    expect(getDocument('doc-2')!.acknowledgmentStatus).toBe('not_requested');
  });

  it('sendForAck transitions to sent then to acknowledged after the simulated delay', () => {
    toggleNeedsAck('doc-2');
    sendForAck('doc-2');
    expect(getDocument('doc-2')!.acknowledgmentStatus).toBe('sent');
    expect(getDocument('doc-2')!.acknowledgmentLinkToken).toBeTruthy();
    vi.advanceTimersByTime(3100);
    expect(getDocument('doc-2')!.acknowledgmentStatus).toBe('acknowledged');
    expect(getDocument('doc-2')!.acknowledgmentCompletedAt).toBeTruthy();
  });

  it('sendForAck is a no-op when needs_acknowledgment is off', () => {
    sendForAck('doc-2');
    expect(getDocument('doc-2')!.acknowledgmentStatus).toBe('not_requested');
  });

  it('resendAck refreshes the token and re-arms the simulated ack', () => {
    const sent = getDocument('doc-6')!;
    expect(sent.acknowledgmentStatus).toBe('sent');
    const previousToken = sent.acknowledgmentLinkToken;
    resendAck('doc-6');
    const updated = getDocument('doc-6')!;
    expect(updated.acknowledgmentStatus).toBe('sent');
    expect(updated.acknowledgmentLinkToken).not.toBe(previousToken);
    vi.advanceTimersByTime(3100);
    expect(getDocument('doc-6')!.acknowledgmentStatus).toBe('acknowledged');
  });

  it('simulateNewBooking grows the Trip Confirmation PDF and flags re-ack when previously acknowledged', () => {
    const conf = getDocument('doc-1')!;
    const baselineSize = conf.fileSizeKb;
    simulateNewBooking();
    expect(getDocument('doc-1')!.fileSizeKb).toBeGreaterThan(baselineSize);
    expect(getDocument('doc-1')!.pdfDirtySincePreviousAck).toBeFalsy();

    // Acknowledge the Trip Confirmation, then add another booking
    toggleNeedsAck('doc-1');
    sendForAck('doc-1');
    vi.advanceTimersByTime(3100);
    expect(getDocument('doc-1')!.acknowledgmentStatus).toBe('acknowledged');

    simulateNewBooking();
    expect(getDocument('doc-1')!.pdfDirtySincePreviousAck).toBe(true);
  });

  it('deleteDocument removes agent uploads and refuses non-deletable rows', () => {
    const beforeCount = getState().documents.length;
    deleteDocument('doc-2');
    expect(getState().documents.length).toBe(beforeCount - 1);
    expect(() => deleteDocument('doc-1')).toThrow();
  });

  it('addDocument appends a row with provided defaults', () => {
    const beforeCount = getState().documents.length;
    addDocument({
      fileName: 'New Voucher.pdf',
      documentType: 'Voucher',
      fileFormat: 'PDF',
      fileSizeKb: 120,
      clientFacing: false,
      needsAcknowledgment: false,
    });
    expect(getState().documents.length).toBe(beforeCount + 1);
    const last = getState().documents[getState().documents.length - 1];
    expect(last.fileName).toBe('New Voucher.pdf');
    expect(last.deletableByAgent).toBe(true);
  });
});
