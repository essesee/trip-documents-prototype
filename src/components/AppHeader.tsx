import { ActionIcon, Box, Group, Indicator, Text } from '@mantine/core';
import {
  IconBell,
  IconLuggage,
  IconMenu2,
  IconUser,
} from '@tabler/icons-react';
import type { Trip } from '../types';

type Props = {
  trip: Trip;
  quotedCount: number;
  confirmedCount: number;
};

export function AppHeader({ trip, quotedCount, confirmedCount }: Props) {
  return (
    <Box
      style={{
        background: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '12px 24px',
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
          <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Menu">
            <IconMenu2 size={22} />
          </ActionIcon>
          <Group gap={6} wrap="nowrap">
            <Text
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                color: '#c8102e',
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              AAA
            </Text>
            <Text fw={600}>Agent</Text>
          </Group>
        </Group>

        <Group gap="md" wrap="nowrap">
          <Group gap={8} wrap="nowrap">
            <IconLuggage size={20} stroke={1.6} />
            <Box>
              <Text size="sm" fw={700} lh={1.1}>
                Current Trip ({quotedCount} Quoted - {confirmedCount} Confirmed)
              </Text>
              <Text size="xs" c="dimmed" lh={1.1}>
                {trip.travelerName.split(',')[1]?.trim()} {trip.travelerName.split(',')[0]} {trip.startDate.replace('th', '').replace(' 2026', '/26')} - {trip.endDate.replace('th', '').replace(' 2026', '/26')}
              </Text>
            </Box>
          </Group>
          <Indicator color="red" size={8} processing>
            <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Notifications">
              <IconBell size={22} />
            </ActionIcon>
          </Indicator>
          <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Account">
            <IconUser size={22} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}
