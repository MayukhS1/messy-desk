import type { DeskItem } from "@/types/database";
import { HUNT_TARGET_COUNT } from "@/lib/constants";

export type DeskSetupTask = {
  id: "arrange" | "messages" | "targets" | "publish";
  text: string;
  completed: boolean;
};

export function resolveTargetIds(
  items: DeskItem[],
  targetIds?: string[] | null
): string[] {
  if (targetIds != null) return targetIds;
  return items.filter((i) => i.is_hunt_target).map((i) => i.id);
}

export function getTargetItems(items: DeskItem[], targetIds: string[]) {
  return items.filter((i) => targetIds.includes(i.id));
}

/** Shared rules for the room checklist and publish gate (excluding the publish step itself). */
export function evaluateDeskSetup(
  items: DeskItem[],
  targetIds?: string[] | null,
  published = false
) {
  const ids = resolveTargetIds(items, targetIds);
  const targets = getTargetItems(items, ids);

  const hasItems = items.length > 0;
  const hasAnyHiddenMessage = items.some((i) => i.hidden_message.trim().length > 0);
  const huntTargetCount = items.filter((i) => i.is_hunt_target).length;
  const hasEnoughTargets = huntTargetCount >= HUNT_TARGET_COUNT;
  const hasHiddenMessagesOnTargets =
    targets.length > 0 &&
    targets.every((t) => t.hidden_message.trim().length > 0);
  const targetsHaveClues =
    ids.length >= HUNT_TARGET_COUNT &&
    targets.every(
      (t) =>
        Boolean(t.label?.trim()) &&
        Boolean(t.hint?.trim()) &&
        t.hidden_message.trim().length > 0
    );

  const canPublish = hasItems && hasHiddenMessagesOnTargets && targetsHaveClues;

  const tasks: DeskSetupTask[] = [
    {
      id: "arrange",
      text: "Arrange items on your desk",
      completed: hasItems,
    },
    {
      id: "messages",
      text: "Write hidden messages inside them",
      completed: hasAnyHiddenMessage,
    },
    {
      id: "targets",
      text: `Pick ${HUNT_TARGET_COUNT} hunt targets with clues`,
      completed: hasEnoughTargets,
    },
    {
      id: "publish",
      text: "Publish so your partner can hunt",
      completed: published,
    },
  ];

  const completedPrerequisiteCount = tasks
    .slice(0, 3)
    .filter((t) => t.completed).length;

  return {
    tasks,
    canPublish,
    hasItems,
    hasHiddenMessages: hasHiddenMessagesOnTargets,
    hasAnyHiddenMessage,
    targetsHaveClues,
    targetCount: ids.length,
    targetIds: ids,
    completedPrerequisiteCount,
    totalPrerequisiteCount: 3,
  };
}

export function publishBlockedReason(
  items: DeskItem[],
  targetIds?: string[] | null
): string | null {
  const setup = evaluateDeskSetup(items, targetIds);
  if (setup.canPublish) return null;
  if (!setup.hasItems) return "Add at least one item to your desk.";
  if (!setup.hasHiddenMessages) {
    return "Write a secret message on each hunt target.";
  }
  if (setup.targetCount < HUNT_TARGET_COUNT) {
    return `Mark ${HUNT_TARGET_COUNT} hunt targets (${setup.targetCount}/${HUNT_TARGET_COUNT}).`;
  }
  return "Each hunt target needs a clue label, hint, and secret message.";
}
