import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetStoreForTests } from '../state/documentStore';
import type { DocumentRecord } from '../types';
import { DocumentRow } from './DocumentRow';

function renderRow(doc: DocumentRecord) {
  return render(
    <MantineProvider>
      <DocumentRow document={doc} onRequestSend={() => {}} onRequestResend={() => {}} />
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

  it('shows the Auto-generated badge for system-generated rows and disables Delete', () => {
    renderRow({
      ...baseDoc,
      systemGenerated: true,
      systemSubtype: 'trip_confirmation',
      deletableByAgent: false,
      uploadedBy: 'System',
    });
    expect(screen.getByText('Auto-generated')).toBeInTheDocument();
    const disabledDelete = screen.getByLabelText('Delete disabled');
    expect(disabledDelete).toBeDisabled();
  });
});
