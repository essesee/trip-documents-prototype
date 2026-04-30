import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AgentDocumentsPage } from './pages/AgentDocumentsPage';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export default function App() {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      <Routes>
        <Route
          path="/trip/:tripSlug/agent-documents"
          element={<AgentDocumentsPage />}
        />
        <Route
          path="/"
          element={<Navigate to="/trip/lucas-family-vacation/agent-documents" replace />}
        />
      </Routes>
    </MantineProvider>
  );
}
