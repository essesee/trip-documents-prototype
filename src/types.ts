export type DocumentType =
  | 'Invoice'
  | 'Voucher'
  | 'Itinerary'
  | 'Insurance Letter'
  | 'Signed Agreement'
  | 'Correspondence'
  | 'Confirmation'
  | 'Quote'
  | 'Destination Guide'
  | 'Other';

export const DOCUMENT_TYPES: DocumentType[] = [
  'Invoice',
  'Voucher',
  'Itinerary',
  'Insurance Letter',
  'Signed Agreement',
  'Correspondence',
  'Confirmation',
  'Quote',
  'Destination Guide',
  'Other',
];

export type AckStatus = 'not_requested' | 'sent' | 'acknowledged';

export type FileFormat = 'PDF' | 'DOC' | 'DOCX' | 'XLS' | 'XLSX' | 'JPG' | 'JPEG' | 'PNG' | 'EML' | 'MSG';

export type Booking = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
};

export type Trip = {
  id: string;
  slug: string;
  title: string;
  travelerName: string;
  startDate: string;
  endDate: string;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  travelerEmail: string;
};

export type DocumentRecord = {
  id: string;
  fileName: string;
  documentType: DocumentType;
  fileFormat: FileFormat;
  fileSizeKb: number;
  uploadedBy: string;
  uploadedAt: string;
  systemGenerated: boolean;
  systemSubtype?: 'trip_confirmation';
  deletableByAgent: boolean;
  clientFacing: boolean;
  needsAcknowledgment: boolean;
  acknowledgmentStatus: AckStatus;
  acknowledgmentRequestedAt?: string;
  acknowledgmentCompletedAt?: string;
  bookingId?: string;
  pdfDirtySincePreviousAck?: boolean;
};
