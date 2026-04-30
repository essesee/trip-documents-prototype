import { Box, Button, Group, Stack, Text } from '@mantine/core';

export function TripFooter() {
  return (
    <Box
      style={{
        background: 'white',
        borderTop: '1px solid #e9ecef',
        padding: '14px 24px',
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xl">
          <Stack gap={0}>
            <Text size="xs" fw={600} c="blue">
              Quoted
            </Text>
            <Text size="xl" fw={700} c="dark.6">
              $1000.00 USD
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text size="xs" fw={600} c="blue">
              Balance Due
            </Text>
            <Text size="xl" fw={700} c="dark.6">
              $1000.00 USD
            </Text>
          </Stack>
        </Group>
        <Group>
          <Button variant="light" color="blue" disabled>
            Add to Trip
          </Button>
          <Button color="blue" disabled>
            Review and Pay
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
