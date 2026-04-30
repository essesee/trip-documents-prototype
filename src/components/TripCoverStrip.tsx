import { ActionIcon, Avatar, Box, Group, Stack, Text } from '@mantine/core';
import {
  IconArrowLeft,
  IconEdit,
  IconEye,
  IconMail,
  IconNotes,
  IconPhone,
  IconPlayerPlay,
  IconRefresh,
  IconShare,
  IconStar,
} from '@tabler/icons-react';
import type { Trip } from '../types';

type Props = {
  trip: Trip;
};

export function TripCoverStrip({ trip }: Props) {
  return (
    <Box
      style={{
        position: 'relative',
        background:
          'linear-gradient(135deg, rgba(40, 80, 120, 0.55), rgba(20, 60, 100, 0.55)), url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=60") center/cover',
        color: 'white',
        padding: '14px 24px 18px',
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group gap="md" align="center" wrap="nowrap">
          <ActionIcon variant="transparent" color="white" aria-label="Back">
            <IconArrowLeft size={22} />
          </ActionIcon>
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
          <Avatar
            size={40}
            radius="xl"
            src="https://i.pravatar.cc/80?img=47"
            alt={trip.agentName}
          />
          <Stack gap={0}>
            <Text size="xs" tt="uppercase" opacity={0.8}>
              Your Agent
            </Text>
            <Text fw={600}>{trip.agentName}</Text>
          </Stack>
        </Group>

        <Group gap="lg" wrap="nowrap">
          <Group gap={6} wrap="nowrap">
            <IconPhone size={16} />
            <Text size="sm">{trip.agentPhone}</Text>
          </Group>
          <Group gap={6} wrap="nowrap">
            <IconMail size={16} />
            <Text size="sm">{trip.agentEmail}</Text>
          </Group>
        </Group>
      </Group>

      <Group justify="space-between" align="flex-end" mt="md" wrap="nowrap">
        <Stack gap={4}>
          <Group gap={10} align="center" wrap="nowrap">
            <Text size="xl" fw={700} style={{ fontSize: 28, lineHeight: 1 }}>
              {trip.title}
            </Text>
            <Group gap={4} wrap="nowrap">
              {[IconEdit, IconNotes, IconEye, IconPlayerPlay, IconStar, IconRefresh, IconShare].map(
                (Icon, i) => (
                  <ActionIcon
                    key={i}
                    size="sm"
                    radius="xl"
                    variant="white"
                    color="blue"
                    aria-hidden
                  >
                    <Icon size={14} />
                  </ActionIcon>
                ),
              )}
            </Group>
          </Group>
          <Text size="sm" opacity={0.95}>
            {trip.travelerName}
          </Text>
          <Text size="sm" opacity={0.85}>
            {trip.startDate} - {trip.endDate}
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}
