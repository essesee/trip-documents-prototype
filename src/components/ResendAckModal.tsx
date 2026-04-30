import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { resendAck } from '../state/documentStore';
import type { DocumentRecord } from '../types';

type Props = {
  document: DocumentRecord | null;
  onClose: () => void;
};

export function ResendAckModal({ document, onClose }: Props) {
  if (!document) return null;
  return (
    <Modal opened={!!document} onClose={onClose} title="Resend acknowledgment" size="md" centered>
      <Stack gap="md">
        <Text size="sm">
          Resending invalidates the link previously sent for{' '}
          <Text span fw={600}>
            {document.fileName}
          </Text>
          . The traveler gets a fresh email with a new link.
        </Text>
        <Text size="xs" c="dimmed">
          Last sent {document.acknowledgmentRequestedAt}.
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="yellow"
            onClick={() => {
              resendAck(document.id);
              onClose();
            }}
          >
            Resend
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
