import { Box, Button, Group, Menu, Text } from '@mantine/core';
import { IconChevronDown, IconFilePlus, IconLuggage, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import {
  simulateNewBooking,
  useDocumentStore,
} from '../state/documentStore';
import type { DocumentRecord } from '../types';
import { DocumentRow } from './DocumentRow';
import { ReAckBanner } from './ReAckBanner';
import { ResendAckModal } from './ResendAckModal';
import { SendForAckModal } from './SendForAckModal';
import { UploadModal } from './UploadModal';
import { resendAck } from '../state/documentStore';

export function AgentDocumentsCard() {
  const trip = useDocumentStore((s) => s.trip);
  const bookings = useDocumentStore((s) => s.bookings);
  const documents = useDocumentStore((s) => s.documents);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [sendTarget, setSendTarget] = useState<DocumentRecord | null>(null);
  const [resendTarget, setResendTarget] = useState<DocumentRecord | null>(null);

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
            <Menu position="bottom-end" withArrow shadow="md">
              <Menu.Target>
                <Button variant="white" color="blue" px={8} aria-label="More actions">
                  <IconChevronDown size={16} />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Dev affordances</Menu.Label>
                <Menu.Item
                  leftSection={<IconLuggage size={14} />}
                  onClick={() => simulateNewBooking()}
                >
                  Simulate new booking added ({bookings.length} on trip)
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item disabled>Reassign scope on selected</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <Box>
          {documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              onRequestSend={(d) => setSendTarget(d)}
              onRequestResend={(d) => setResendTarget(d)}
            />
          ))}
        </Box>
      </Box>

      <UploadModal opened={uploadOpen} onClose={() => setUploadOpen(false)} bookings={bookings} />
      <SendForAckModal document={sendTarget} trip={trip} onClose={() => setSendTarget(null)} />
      <ResendAckModal document={resendTarget} onClose={() => setResendTarget(null)} />
    </Box>
  );
}
