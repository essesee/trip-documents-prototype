import { Box, Button, Group, Text } from '@mantine/core';
import { IconFilePlus, IconLuggage, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import {
  resendAck,
  simulateNewBooking,
  useDocumentStore,
} from '../state/documentStore';
import type { DocumentRecord } from '../types';
import { DocumentRow } from './DocumentRow';
import { ReAckBanner } from './ReAckBanner';
import { ReassignScopeModal } from './ReassignScopeModal';
import { ResendAckModal } from './ResendAckModal';
import { SendForAckModal } from './SendForAckModal';
import { UploadModal } from './UploadModal';

export function AgentDocumentsCard() {
  const trip = useDocumentStore((s) => s.trip);
  const bookings = useDocumentStore((s) => s.bookings);
  const documents = useDocumentStore((s) => s.documents);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [sendTarget, setSendTarget] = useState<DocumentRecord | null>(null);
  const [resendTarget, setResendTarget] = useState<DocumentRecord | null>(null);
  const [reassignTarget, setReassignTarget] = useState<DocumentRecord | null>(null);

  const tripConfirmation = documents.find((d) => d.systemSubtype === 'trip_confirmation');
  const showReAckBanner =
    !!tripConfirmation && tripConfirmation.pdfDirtySincePreviousAck === true;

  return (
    <Box style={{ background: '#f1f3f5', padding: 24 }}>
      {showReAckBanner && tripConfirmation && (
        <ReAckBanner onResend={() => resendAck(tripConfirmation.id)} />
      )}

      <Box style={{ background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <Group
          justify="space-between"
          wrap="nowrap"
          style={{
            background: '#1f3a64',
            color: 'white',
            padding: '14px 20px',
          }}
        >
          <Group gap={10}>
            <IconFilePlus size={22} />
            <Text fw={700} size="lg">
              Agent Documents
            </Text>
          </Group>
          <Group gap="xs">
            <Button
              variant="white"
              color="yellow"
              leftSection={<IconLuggage size={16} />}
              onClick={() => simulateNewBooking()}
            >
              What if a booking is added?
            </Button>
            <Button variant="white" color="blue" leftSection={<IconFilePlus size={16} />}>
              Create Proposal
            </Button>
            <Button
              color="blue"
              leftSection={<IconUpload size={16} />}
              onClick={() => setUploadOpen(true)}
            >
              Upload
            </Button>
          </Group>
        </Group>

        <Box>
          {documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              onRequestSend={(d) => setSendTarget(d)}
              onRequestResend={(d) => setResendTarget(d)}
              onRequestReassign={(d) => setReassignTarget(d)}
            />
          ))}
        </Box>
      </Box>

      <UploadModal opened={uploadOpen} onClose={() => setUploadOpen(false)} bookings={bookings} />
      <SendForAckModal document={sendTarget} trip={trip} onClose={() => setSendTarget(null)} />
      <ResendAckModal document={resendTarget} onClose={() => setResendTarget(null)} />
      <ReassignScopeModal
        document={reassignTarget}
        bookings={bookings}
        onClose={() => setReassignTarget(null)}
      />
    </Box>
  );
}
