import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconDots,
  IconDownload,
  IconFileText,
  IconRefresh,
  IconSend,
  IconTrash,
} from '@tabler/icons-react';
import {
  deleteDocument,
  toggleClientFacing,
  toggleNeedsAck,
} from '../state/documentStore';
import type { DocumentRecord } from '../types';
import { OpenQuestionPopover } from './OpenQuestionPopover';

type Props = {
  document: DocumentRecord;
  onRequestSend: (doc: DocumentRecord) => void;
  onRequestResend: (doc: DocumentRecord) => void;
};

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function StatusBadge({ doc }: { doc: DocumentRecord }) {
  if (!doc.needsAcknowledgment) return null;
  switch (doc.acknowledgmentStatus) {
    case 'not_requested':
      return (
        <Badge color="gray" variant="light" size="sm">
          Not requested
        </Badge>
      );
    case 'sent':
      return (
        <Badge color="yellow" variant="filled" size="sm">
          Sent
        </Badge>
      );
    case 'acknowledged':
      return (
        <Tooltip label={`Acknowledged ${doc.acknowledgmentCompletedAt ?? ''}`}>
          <Badge color="green" variant="filled" size="sm">
            Acknowledged
          </Badge>
        </Tooltip>
      );
  }
}

export function DocumentRow({ document: doc, onRequestSend, onRequestResend }: Props) {
  const isSystem = doc.systemGenerated;
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: '40px minmax(220px, 1.4fr) minmax(150px, 0.9fr) 1fr 220px 40px',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderBottom: '1px solid #e9ecef',
        background: isSystem ? '#f8f9fc' : 'white',
      }}
    >
      <ThemeIcon size={36} radius="xl" color="blue" variant="filled">
        <IconFileText size={20} />
      </ThemeIcon>

      <Stack gap={2}>
        <Group gap={6} wrap="nowrap">
          <Text fw={600}>{doc.fileName}</Text>
          {isSystem && (
            <>
              <Badge color="blue" variant="light" size="xs">
                Auto-generated
              </Badge>
              <OpenQuestionPopover
                questionId="Q12"
                title="Trip Confirmation deletability"
                body="PRD currently treats the auto-generated Trip Confirmation PDF as non-deletable so the audit trail stays intact. Confirm with the advisory group whether any club needs an exception."
              />
            </>
          )}
        </Group>
        <Group gap={6}>
          <Badge variant="light" color="gray" size="xs">
            {doc.documentType}
          </Badge>
          <Text size="xs" c="dimmed">
            {doc.fileFormat} &middot; {formatSize(doc.fileSizeKb)}
          </Text>
        </Group>
      </Stack>

      <Stack gap={2}>
        <Text size="xs" c="dimmed">
          Uploaded by
        </Text>
        <Text size="sm">{doc.uploadedBy}</Text>
        <Text size="xs" c="dimmed">
          {doc.uploadedAt}
        </Text>
      </Stack>

      <Group gap="md">
        <Tooltip label="Show on consumer Documents tab" withArrow>
          <Switch
            label="Client facing"
            size="xs"
            checked={doc.clientFacing}
            onChange={() => toggleClientFacing(doc.id)}
          />
        </Tooltip>
        <Tooltip label="Render Acknowledge button on consumer side" withArrow>
          <Switch
            label="Needs acknowledgment"
            size="xs"
            checked={doc.needsAcknowledgment}
            onChange={() => toggleNeedsAck(doc.id)}
          />
        </Tooltip>
      </Group>

      <Group gap={6}>
        <StatusBadge doc={doc} />
      </Group>

      <Menu position="bottom-end" withArrow shadow="md">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" aria-label="More actions">
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconDownload size={14} />}>Download</Menu.Item>
          {doc.needsAcknowledgment && doc.acknowledgmentStatus === 'not_requested' && (
            <Menu.Item leftSection={<IconSend size={14} />} onClick={() => onRequestSend(doc)}>
              Send for acknowledgment
            </Menu.Item>
          )}
          {doc.acknowledgmentStatus === 'sent' && (
            <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => onRequestResend(doc)}>
              Resend acknowledgment
            </Menu.Item>
          )}
          <Menu.Item disabled>Reassign scope</Menu.Item>
          {doc.deletableByAgent && (
            <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => deleteDocument(doc.id)}>
              Delete
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
