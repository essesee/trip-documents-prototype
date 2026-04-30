import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetStoreForTests } from '../state/documentStore';
import type { DocumentRecord } from '../types';
import { DocumentRow } from './DocumentRow';

function renderRow(doc: DocumentRecord) {
  return render(
    <MantineProvider>
      <DocumentRow
        document={doc}
        bookings={[
          {
            id: 'bk-1',
            productType: 'Cruise',
            label: 'Test Cruise',
            startDate: 'Feb 5 2026',
            endDate: 'Feb 12 2026',
          },
        ]}
        onRequestSend={() => {}}
        onRequestResend={() => {}}
        onRequestReassign={() => {}}
      />
    </MantineProvider>,
  );
}

const baseDoc: DocumentRecord = {
  id: 'doc-test',
  fileName: 'Test Document.pdf',
  documentType: 'Voucher',
  fileFormat: 'PDF',
  fileSizeKb: 100,
  uploadedBy: 'Kimberly Stevens',
  uploadedAt: 'Feb 1 2026',
  systemGenerated: false,
  deletableByAgent: true,
  clientFacing: true,
  needsAcknowledgment: false,
  acknowledgmentStatus: 'not_requested',
};

describe('DocumentRow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStoreForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the file name, document type, and uploader', () => {
    renderRow(baseDoc);
    expect(screen.getByText('Test Document.pdf')).toBeInTheDocument();
    expect(screen.getByText('Voucher')).toBeInTheDocument();
    expect(screen.getByText('Kimberly Stevens')).toBeInTheDocument();
  });

  it('hides the acknowledgment status badge when needs_acknowledgment is off', () => {
    renderRow(baseDoc);
    expect(screen.queryByText('Not requested')).not.toBeInTheDocument();
    expect(screen.queryByText('Sent')).not.toBeInTheDocument();
    expect(screen.queryByText('Acknowledged')).not.toBeInTheDocument();
  });

  it('shows Not requested when needs_acknowledgment is on and status is not_requested', () => {
    renderRow({ ...baseDoc, needsAcknowledgment: true, acknowledgmentStatus: 'not_requested' });
    expect(screen.getByText('Not requested')).toBeInTheDocument();
  });

  it('shows Sent badge when status is sent', () => {
    renderRow({ ...baseDoc, needsAcknowledgment: true, acknowledgmentStatus: 'sent' });
    expect(screen.getByText('Sent')).toBeInTheDocument();
  });

  it('shows Acknowledged badge when status is acknowledged', () => {
    renderRow({
      ...baseDoc,
      needsAcknowledgment: true,
      acknowledgmentStatus: 'acknowledged',
      acknowledgmentCompletedAt: 'Feb 1 2026 6:42 PM',
    });
    expect(screen.getByText('Acknowledged')).toBeInTheDocument();
  });

  it('shows the Auto-generated badge and the Q12 callout for system-generated rows', () => {
    renderRow({
      ...baseDoc,
      systemGenerated: true,
      systemSubtype: 'trip_confirmation',
      deletableByAgent: false,
      uploadedBy: 'System',
    });
    expect(screen.getByText('Auto-generated')).toBeInTheDocument();
    expect(screen.getByLabelText('Open question Q12')).toBeInTheDocument();
  });

  it('shows Trip-level when no booking is attached', () => {
    renderRow(baseDoc);
    expect(screen.getByText('Trip-level')).toBeInTheDocument();
  });

  it('shows the booking product type and label when a booking is attached', () => {
    renderRow({ ...baseDoc, bookingId: 'bk-1' });
    expect(screen.getByText('Attached to')).toBeInTheDocument();
    expect(screen.getByText('Cruise')).toBeInTheDocument();
    expect(screen.getByText('Test Cruise')).toBeInTheDocument();
  });
});
