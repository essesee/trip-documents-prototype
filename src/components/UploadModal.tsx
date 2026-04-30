import {
  Alert,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { IconAlertCircle, IconCloudUpload } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { addDocument } from '../state/documentStore';
import type { Booking, DocumentType, FileFormat } from '../types';
import { DOCUMENT_TYPES } from '../types';

type Props = {
  opened: boolean;
  onClose: () => void;
  bookings: Booking[];
};

const FORMAT_OPTIONS: FileFormat[] = ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'JPG', 'PNG', 'EML', 'MSG'];

const TRIP_LEVEL_VALUE = 'trip-level';

export function UploadModal({ opened, onClose, bookings }: Props) {
  const [fileName, setFileName] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('Other');
  const [fileFormat, setFileFormat] = useState<FileFormat>('PDF');
  const [clientFacing, setClientFacing] = useState(false);
  const [needsAck, setNeedsAck] = useState(false);
  const [scope, setScope] = useState<string>(TRIP_LEVEL_VALUE);

  useEffect(() => {
    if (!opened) return;
    setFileName('');
    setDocumentType('Other');
    setFileFormat('PDF');
    setClientFacing(false);
    setNeedsAck(false);
    setScope(TRIP_LEVEL_VALUE);
  }, [opened]);

  function handleSubmit() {
    if (!fileName.trim()) return;
    addDocument({
      fileName: fileName.endsWith(`.${fileFormat.toLowerCase()}`)
        ? fileName
        : `${fileName}.${fileFormat.toLowerCase()}`,
      documentType,
      fileFormat,
      fileSizeKb: Math.floor(80 + Math.random() * 1200),
      clientFacing,
      needsAcknowledgment: needsAck,
      bookingId: scope === TRIP_LEVEL_VALUE ? undefined : scope,
    });
    onClose();
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Upload document" size="lg" centered>
      <Stack gap="md">
        <Box
          style={{
            border: '2px dashed #ced4da',
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            color: '#495057',
            background: '#f8f9fa',
          }}
        >
          <IconCloudUpload size={32} stroke={1.4} />
          <Text mt={6} fw={500}>
            Drag a file here, or click to choose
          </Text>
          <Text size="xs" c="dimmed">
            Multi-file upload supported. Mocked in this prototype.
          </Text>
        </Box>

        <TextInput
          label="File name"
          placeholder="e.g. Cruise Liability Waiver"
          value={fileName}
          onChange={(e) => setFileName(e.currentTarget.value)}
          required
        />

        <Group grow>
          <Select
            label="Document type"
            data={DOCUMENT_TYPES.map((t) => ({ value: t, label: t }))}
            value={documentType}
            onChange={(v) => v && setDocumentType(v as DocumentType)}
            required
          />
          <Select
            label="File format"
            data={FORMAT_OPTIONS.map((f) => ({ value: f, label: f }))}
            value={fileFormat}
            onChange={(v) => v && setFileFormat(v as FileFormat)}
          />
        </Group>

        <Select
          label="Attach to"
          description="Trip-level by default. Pick a booking to scope this document."
          value={scope}
          onChange={(v) => v && setScope(v)}
          data={[
            { value: TRIP_LEVEL_VALUE, label: 'Trip-level' },
            ...bookings.map((b) => ({ value: b.id, label: b.label })),
          ]}
        />

        <Group grow align="flex-start">
          <Switch
            label="Client facing"
            description="Show on the consumer Documents tab"
            checked={clientFacing}
            onChange={(e) => setClientFacing(e.currentTarget.checked)}
          />
          <Switch
            label="Needs acknowledgment"
            description="Render an Acknowledge button on the consumer side"
            checked={needsAck}
            onChange={(e) => setNeedsAck(e.currentTarget.checked)}
          />
        </Group>

        <Alert color="orange" icon={<IconAlertCircle size={16} />} variant="light">
          Avoid uploading sensitive content (passport copies, credit card images, birth
          certificates). Sensitive-content detection is not in this prototype.
        </Alert>

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!fileName.trim()}>
            Upload
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
