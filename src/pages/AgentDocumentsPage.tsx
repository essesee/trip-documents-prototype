import { Box } from '@mantine/core';
import { AgentDocumentsCard } from '../components/AgentDocumentsCard';
import { AppHeader } from '../components/AppHeader';
import { TripCoverStrip } from '../components/TripCoverStrip';
import { TripFooter } from '../components/TripFooter';
import { TripTabs } from '../components/TripTabs';
import { useDocumentStore } from '../state/documentStore';

export function AgentDocumentsPage() {
  const trip = useDocumentStore((s) => s.trip);
  const bookings = useDocumentStore((s) => s.bookings);

  return (
    <Box style={{ minHeight: '100vh', background: '#f1f3f5', display: 'flex', flexDirection: 'column' }}>
      <AppHeader trip={trip} quotedCount={bookings.length} confirmedCount={bookings.length} />
      <TripCoverStrip trip={trip} />
      <TripTabs />
      <Box style={{ flex: 1 }}>
        <AgentDocumentsCard />
      </Box>
      <TripFooter />
    </Box>
  );
}
