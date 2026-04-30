import { Box, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { sendForAck } from '../state/documentStore';
import type { DocumentRecord, Trip } from '../types';
import { OpenQuestionPopover } from './OpenQuestionPopover';

type Props = {
  document: DocumentRecord | null;
  trip: Trip;
  onClose: () => void;
};

export function SendForAckModal({ document, trip, onClose }: Props) {
  if (!document) return null;
  return (
    <Modal opened={!!document} onClose={onClose} title="Send for acknowledgment" size="md" centered>
      <Stack gap="md">
        <Box>
          <Text size="sm" c="dimmed">
            Document
          </Text>
          <Text fw={600}>{document.fileName}</Text>
        </Box>

        <Box>
          <Text size="sm" c="dimmed">
            Traveler
          </Text>
          <Text fw={500}>
            {trip.travelerName} &middot; {trip.travelerEmail}
          </Text>
        </Box>

        <Box>
          <Text size="sm" c="dimmed">
            Document hash
          </Text>
          <Text size="sm" ff="monospace">
            sha256:placeholder-{document.id.slice(-8)}
          </Text>
        </Box>

        <Group gap={6} align="center">
          <Text size="xs" c="dimmed">
            Captured on completion: time stamp, traveler identifier, IP, user agent, document hash.
          </Text>
          <OpenQuestionPopover
            questionId="Q11"
            title="Acknowledgment evidence threshold"
            body="The MVP captures time stamp, traveler identifier, IP, user agent, and document hash. Pilot club legal still needs to confirm whether this bar is enough for chargeback defense."
          />
        </Group>

        <Text size="xs" c="dimmed">
          The link does not expire. Resend invalidates the previous link and issues a new one.
        </Text>

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => {
              sendForAck(document.id);
              onClose();
            }}
          >
            Send for acknowledgment
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
