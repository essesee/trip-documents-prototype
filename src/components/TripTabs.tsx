import { Box, Group, Tooltip } from '@mantine/core';
import {
  IconBookmark,
  IconCash,
  IconFileDescription,
  IconHistory,
  IconMap,
  IconNotes,
  IconUsers,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';

type TabDef = {
  key: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  enabled?: boolean;
};

const TAB_ICON_SIZE = 18;

const TABS: TabDef[] = [
  { key: 'itinerary', label: 'Itinerary', icon: <IconMap size={TAB_ICON_SIZE} /> },
  { key: 'trip-cost', label: 'Trip Cost', icon: <IconCash size={TAB_ICON_SIZE} /> },
  { key: 'documents', label: 'Documents', icon: <IconBookmark size={TAB_ICON_SIZE} /> },
  { key: 'travelers', label: 'Travelers', icon: <IconUsers size={TAB_ICON_SIZE} /> },
  { key: 'agent-notes', label: 'Agent Notes', icon: <IconNotes size={TAB_ICON_SIZE} /> },
  {
    key: 'agent-documents',
    label: 'Agent Documents',
    icon: <IconFileDescription size={TAB_ICON_SIZE} />,
    active: true,
    enabled: true,
  },
  { key: 'audit-log', label: 'Audit Log', icon: <IconHistory size={TAB_ICON_SIZE} /> },
];

export function TripTabs() {
  return (
    <Box style={{ background: 'white', padding: '8px 24px', borderBottom: '1px solid #e9ecef' }}>
      <Group gap="xs" wrap="nowrap">
        {TABS.map((tab) => {
          const node = (
            <Group
              key={tab.key}
              gap={6}
              wrap="nowrap"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: tab.active ? '#1971c2' : 'transparent',
                color: tab.active ? 'white' : tab.enabled ? '#212529' : '#868e96',
                cursor: tab.enabled ? 'pointer' : 'not-allowed',
                opacity: tab.enabled ? 1 : 0.7,
                fontSize: 14,
                fontWeight: tab.active ? 600 : 500,
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
            </Group>
          );
          if (tab.enabled) return node;
          return (
            <Tooltip key={tab.key} label="Out of scope for this prototype" withArrow>
              {node}
            </Tooltip>
          );
        })}
      </Group>
    </Box>
  );
}
