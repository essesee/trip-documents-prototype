import {
  Badge,
  Button,
  Group,
  Modal,
  Radio,
  Stack,
  Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { reassignScope } from '../state/documentStore';
import type { Booking, DocumentRecord } from '../types';

type Props = {
  document: DocumentRecord | null;
  bookings: Booking[];
  onClose: () => void;
};

const TRIP_LEVEL_VALUE = 'trip-level';

export function ReassignScopeModal({ document, bookings, onClose }: Props) {
  const [value, setValue] = useState<string>(TRIP_LEVEL_VALUE);

  useEffect(() => {
    if (!document) return;
    setValue(document.bookingId ?? TRIP_LEVEL_VALUE);
  }, [document]);

  if (!document) return null;

  const currentScopeLabel =
    document.bookingId
      ? bookings.find((b) => b.id === document.bookingId)?.label ?? document.bookingId
      : 'Trip-level';

  function handleConfirm() {
    if (!document) return;
    reassignScope(document.id, value === TRIP_LEVEL_VALUE ? undefined : value);
    onClose();
  }

  return (
    <Modal opened={!!document} onClose={onClose} title="Reassign scope" size="md" centered>
      <Stack gap="md">
        <Stack gap={2}>
          <Text size="sm" c="dimmed">
            Document
          </Text>
          <Text fw={600}>{document.fileName}</Text>
        </Stack>

        <Stack gap={2}>
          <Text size="sm" c="dimmed">
            Currently attached to
          </Text>
          <Text fw={500}>{currentScopeLabel}</Text>
        </Stack>

        <Radio.Group
          value={value}
          onChange={setValue}
          label="Move this document to"
          description="Trip-level documents apply to the whole trip. Booking-scoped documents only show on that booking's documents tab."
        >
          <Stack gap="xs" mt="xs">
            <Radio
              value={TRIP_LEVEL_VALUE}
              label={
                <Group gap={8}>
                  <Text fw={500}>Trip-level</Text>
                  <Text size="xs" c="dimmed">
                    No specific booking
                  </Text>
                </Group>
              }
            />
            {bookings.map((b) => (
              <Radio
                key={b.id}
                value={b.id}
                label={
                  <Group gap={8} wrap="nowrap">
                    <Badge variant="light" color="blue" size="xs">
                      {b.productType}
                    </Badge>
                    <Text fw={500}>{b.label}</Text>
                    <Text size="xs" c="dimmed" ff="monospace">
                      {b.id}
                    </Text>
                  </Group>
                }
              />
            ))}
          </Stack>
        </Radio.Group>

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={value === (document.bookingId ?? TRIP_LEVEL_VALUE)}
          >
            Reassign
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
