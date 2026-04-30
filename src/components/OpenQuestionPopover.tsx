import { ActionIcon, Box, Popover, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
  questionId: string;
  title: string;
  body: string;
};

export function OpenQuestionPopover({ questionId, title, body }: Props) {
  const [opened, setOpened] = useState(false);
  return (
    <Popover opened={opened} onChange={setOpened} width={320} position="top" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          color="orange"
          size="sm"
          aria-label={`Open question ${questionId}`}
          onClick={() => setOpened((o) => !o)}
        >
          <IconInfoCircle size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap={6}>
          <Box>
            <Text size="xs" tt="uppercase" fw={700} c="orange">
              PRD open question {questionId}
            </Text>
            <Text size="sm" fw={600}>
              {title}
            </Text>
          </Box>
          <Text size="sm" c="dimmed">
            {body}
          </Text>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
