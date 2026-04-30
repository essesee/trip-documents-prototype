import { Alert, Button, Group } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { OpenQuestionPopover } from './OpenQuestionPopover';

type Props = {
  onResend: () => void;
};

export function ReAckBanner({ onResend }: Props) {
  return (
    <Alert
      color="yellow"
      icon={<IconAlertTriangle size={18} />}
      title="Trip Confirmation changed since last acknowledgment"
      mb="sm"
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <span>
          The customer already acknowledged this document. A new booking grew the PDF. Re-send for
          acknowledgment so the captured evidence covers the latest content.
        </span>
        <Group gap="xs" wrap="nowrap">
          <OpenQuestionPopover
            questionId="Q13"
            title="Re-acknowledgment after the PDF grows"
            body="Should a previously completed acknowledgment carry over when new bookings append to the Trip Confirmation PDF, or does the agent re-send for acknowledgment? The advisory group's call shapes the audit-event volume and the agent's pending queue."
          />
          <Button size="xs" color="yellow" onClick={onResend}>
            Re-send for acknowledgment
          </Button>
        </Group>
      </Group>
    </Alert>
  );
}
