import {
  Alert,
  Badge,
  Box,
  Button,
  FileButton,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { IconAlertCircle, IconCloudUpload, IconFile } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { addDocument } from '../state/documentStore';
import type { Booking, DocumentType, FileFormat } from '../types';
import { DOCUMENT_TYPES } from '../types';

type Props = {
  opened: boolean;
  onClose: () => void;
  bookings: Booking[];
};

const TRIP_LEVEL_VALUE = 'trip-level';

const SUPPORTED_FORMATS: FileFormat[] = [
  'PDF',
  'DOC',
  'DOCX',
  'XLS',
  'XLSX',
  'JPG',
  'JPEG',
  'PNG',
  'EML',
  'MSG',
];

const ACCEPT_ATTR = SUPPORTED_FORMATS.map((f) => `.${f.toLowerCase()}`).join(',');

function detectFormat(name: string): FileFormat | null {
  const ext = name.split('.').pop()?.toUpperCase();
  if (!ext) return null;
  return (SUPPORTED_FORMATS as string[]).includes(ext) ? (ext as FileFormat) : null;
}

export function UploadModal({ opened, onClose, bookings }: Props) {
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('Other');
  const [clientFacing, setClientFacing] = useState(false);
  const [needsAck, setNeedsAck] = useState(false);
  const [scope, setScope] = useState<string>(TRIP_LEVEL_VALUE);

  useEffect(() => {
    if (!opened) return;
    setPickedFile(null);
    setDocumentType('Other');
    setClientFacing(false);
    setNeedsAck(false);
    setScope(TRIP_LEVEL_VALUE);
  }, [opened]);

  const detectedFormat = pickedFile ? detectFormat(pickedFile.name) : null;
  const formatUnsupported = pickedFile && !detectedFormat;
  const fileSizeKb = pickedFile ? Math.max(1, Math.round(pickedFile.size / 1024)) : 0;
  const submitDisabled = !pickedFile || !detectedFormat;

  function handleSubmit() {
    if (!pickedFile || !detectedFormat) return;
    addDocument({
      fileName: pickedFile.name,
      documentType,
      fileFormat: detectedFormat,
      fileSizeKb,
      clientFacing,
      needsAcknowledgment: needsAck,
      bookingId: scope === TRIP_LEVEL_VALUE ? undefined : scope,
    });
    onClose();
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Upload document" size="lg" centered>
      <Stack gap="md">
        <FileButton onChange={setPickedFile} accept={ACCEPT_ATTR}>
          {(props) => (
            <Box
              {...props}
              style={{
                border: '2px dashed #ced4da',
                borderRadius: 8,
                padding: 24,
                textAlign: 'center',
                color: '#495057',
                background: pickedFile ? '#eef5ff' : '#f8f9fa',
                cursor: 'pointer',
              }}
            >
              {pickedFile ? (
                <Stack gap={4} align="center">
                  <IconFile size={28} stroke={1.4} />
                  <Group gap={6} justify="center">
                    <Text fw={600}>{pickedFile.name}</Text>
                    {detectedFormat && (
                      <Badge variant="light" color="blue" size="xs">
                        {detectedFormat}
                      </Badge>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed">
                    {fileSizeKb >= 1024
                      ? `${(fileSizeKb / 1024).toFixed(1)} MB`
                      : `${fileSizeKb} KB`}{' '}
                    &middot; click to replace
                  </Text>
                </Stack>
              ) : (
                <Stack gap={4} align="center">
                  <IconCloudUpload size={32} stroke={1.4} />
                  <Text fw={500}>Click to choose a file</Text>
                  <Text size="xs" c="dimmed">
                    Supported: {SUPPORTED_FORMATS.join(', ')}
                  </Text>
                </Stack>
              )}
            </Box>
          )}
        </FileButton>

        {formatUnsupported && (
          <Alert color="red" variant="light">
            That file extension is not supported. Pick one of:{' '}
            {SUPPORTED_FORMATS.join(', ')}.
          </Alert>
        )}

        <Select
          label="Document type"
          data={DOCUMENT_TYPES.map((t) => ({ value: t, label: t }))}
          value={documentType}
          onChange={(v) => v && setDocumentType(v as DocumentType)}
          required
        />

        <Select
          label="Attach to"
          description="Trip-level by default. Pick a booking to scope this document."
          value={scope}
          onChange={(v) => v && setScope(v)}
          data={[
            { value: TRIP_LEVEL_VALUE, label: 'Trip-level' },
            ...bookings.map((b) => ({ value: b.id, label: `${b.productType} · ${b.label}` })),
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
          <Button onClick={handleSubmit} disabled={submitDisabled}>
            Upload
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
