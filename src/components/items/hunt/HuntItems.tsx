"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ItemInteractionProps } from "@/types/items";
import { InteractionModal } from "@/components/ui/InteractionModal";
import { PinPad, CombinationLock } from "@/components/ui/PinPad";
import { MessageReveal } from "@/components/ui/MessageReveal";
import { ItemVisual } from "@/components/items/hunt/ItemVisual";
import { useHuntExplore } from "@/components/hunt/HuntExploreContext";
import { MiniPuzzle, puzzleKindForItem } from "@/components/hunt/MiniPuzzle";
import { cn } from "@/lib/utils";

function ItemShell({
  item,
  mode,
  isSelected,
  onSelect,
  children,
}: ItemInteractionProps & { children?: React.ReactNode }) {
  const isEdit = mode === "edit";
  const isView = mode === "view";

  return (
    <motion.div
      role={isView ? undefined : "button"}
      tabIndex={isView ? undefined : 0}
      className={cn(
        "relative flex flex-col items-center justify-center select-none touch-manipulation w-[72px] h-[72px]",
        isEdit && "group",
        isEdit && isSelected && "ring-2 ring-amber-500 ring-offset-2 ring-offset-amber-100 rounded-xl",
        mode === "explore" && "cursor-pointer hover:scale-105 transition-transform",
        isView && "pointer-events-none"
      )}
      onClick={(e) => {
        if (isView) return;
        e.stopPropagation();
        onSelect?.();
      }}
      onKeyDown={(e) => {
        if (isEdit && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect?.();
        }
      }}
      whileHover={mode === "explore" ? { scale: 1.06 } : undefined}
      whileTap={mode === "explore" ? { scale: 0.96 } : undefined}
    >
      <ItemVisual type={item.item_type} size={56} />
      {isEdit && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-amber-950/75 px-1.5 py-0.5 text-[9px] text-amber-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          drag to move
        </span>
      )}
      {children}
    </motion.div>
  );
}

function useExploreModal(props: ItemInteractionProps) {
  const huntExplore = useHuntExplore();
  const isExplore = props.mode === "explore";

  const open =
    isExplore && huntExplore
      ? huntExplore.activeItemId === props.item.id
      : false;

  const setOpen = (next: boolean) => {
    if (!isExplore || !huntExplore) return;
    if (next) huntExplore.openItem(props.item.id);
    else huntExplore.closeItem();
  };

  return { open, setOpen, isExplore };
}

function ExploreModal({
  props,
  title,
  children,
  onClose,
}: {
  props: ItemInteractionProps;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const { open, setOpen } = useExploreModal(props);

  return (
    <InteractionModal
      open={open}
      onClose={() => {
        onClose?.();
        setOpen(false);
      }}
      title={title}
    >
      {children}
    </InteractionModal>
  );
}

export function LaptopItem(props: ItemInteractionProps) {
  const [unlocked, setUnlocked] = useState(props.isUnlocked);
  const { setOpen } = useExploreModal(props);

  const handlePin = (pin: string) => {
    if (pin === props.item.unlock_config.pin) {
      setUnlocked(true);
      props.onUnlock();
    }
  };

  if (props.mode === "edit") {
    return <ItemShell {...props} />;
  }

  return (
    <>
      <ItemShell {...props} onSelect={() => setOpen(true)} />
      <ExploreModal props={props} title="Laptop">
        {!unlocked && !props.isUnlocked ? (
          <div className="space-y-4">
            <p className="text-sm text-stone-600">Enter PIN to unlock</p>
            <PinPad length={4} onSubmit={handlePin} onCancel={() => setOpen(false)} />
          </div>
        ) : (
          <MessageReveal message={props.item.hidden_message} />
        )}
      </ExploreModal>
    </>
  );
}

export function EnvelopeItem(props: ItemInteractionProps) {
  const [unlocked, setUnlocked] = useState(props.isUnlocked);
  const { setOpen } = useExploreModal(props);

  if (props.mode === "edit") {
    return <ItemShell {...props} />;
  }

  const done = unlocked || props.isUnlocked;

  return (
    <>
      <ItemShell {...props} onSelect={() => setOpen(true)} />
      <ExploreModal props={props} title="Envelope">
        {!done ? (
          <MiniPuzzle
            kind="math"
            onSuccess={() => {
              setUnlocked(true);
              props.onUnlock();
            }}
          />
        ) : (
          <MessageReveal message={props.item.hidden_message} />
        )}
      </ExploreModal>
    </>
  );
}

export function BoxItem(props: ItemInteractionProps) {
  const [unlocked, setUnlocked] = useState(props.isUnlocked);
  const { setOpen } = useExploreModal(props);

  if (props.mode === "edit") {
    return <ItemShell {...props} />;
  }

  return (
    <>
      <ItemShell {...props} onSelect={() => setOpen(true)} />
      <ExploreModal props={props} title="Locked Box">
        {!unlocked && !props.isUnlocked ? (
          <CombinationLockWrapper
            expected={props.item.unlock_config.combination ?? "000"}
            onUnlock={() => {
              setUnlocked(true);
              props.onUnlock();
            }}
          />
        ) : (
          <MessageReveal message={props.item.hidden_message} />
        )}
      </ExploreModal>
    </>
  );
}

function CombinationLockWrapper({
  expected,
  onUnlock,
}: {
  expected: string;
  onUnlock: () => void;
}) {
  return (
    <CombinationLock
      onSubmit={(combo: string) => {
        if (combo === expected) onUnlock();
      }}
    />
  );
}

export function BookItem(props: ItemInteractionProps) {
  const [unlocked, setUnlocked] = useState(props.isUnlocked);
  const { setOpen } = useExploreModal(props);

  if (props.mode === "edit") {
    return <ItemShell {...props} />;
  }

  const done = unlocked || props.isUnlocked;

  return (
    <>
      <ItemShell {...props} onSelect={() => setOpen(true)} />
      <ExploreModal props={props} title="Book">
        {!done ? (
          <MiniPuzzle
            kind="sequence"
            onSuccess={() => {
              setUnlocked(true);
              props.onUnlock();
            }}
          />
        ) : (
          <MessageReveal message={props.item.hidden_message} />
        )}
      </ExploreModal>
    </>
  );
}

export function MugItem(props: ItemInteractionProps) {
  const [lifted, setLifted] = useState(false);
  const [unlocked, setUnlocked] = useState(props.isUnlocked);
  const { setOpen } = useExploreModal(props);

  if (props.mode === "edit") {
    return <ItemShell {...props} />;
  }

  return (
    <>
      <ItemShell {...props} onSelect={() => setOpen(true)} />
      <ExploreModal props={props} title="Coffee Mug">
        {!unlocked && !props.isUnlocked ? (
          <div className="relative h-44 flex flex-col items-center justify-end">
            <motion.div
              drag="y"
              dragConstraints={{ top: -80, bottom: 0 }}
              className="cursor-grab active:cursor-grabbing min-h-[80px]"
              onDragEnd={(_, info) => {
                if (info.offset.y < -40) {
                  setLifted(true);
                  setUnlocked(true);
                  props.onUnlock();
                }
              }}
            >
              <ItemVisual type="mug" size={80} />
            </motion.div>
            {lifted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-0 text-sm text-stone-500"
              >
                Note found underneath!
              </motion.p>
            )}
            <p className="text-xs text-stone-400 mt-2">Drag mug up to reveal</p>
          </div>
        ) : (
          <MessageReveal message={props.item.hidden_message} />
        )}
      </ExploreModal>
    </>
  );
}

export function StickyNoteItem(props: ItemInteractionProps) {
  const [unlocked, setUnlocked] = useState(props.isUnlocked);
  const { setOpen } = useExploreModal(props);

  if (props.mode === "edit") {
    return <ItemShell {...props} />;
  }

  const done = unlocked || props.isUnlocked;
  const kind = puzzleKindForItem(
    props.item.item_type,
    props.item.unlock_config.type
  );

  return (
    <>
      <ItemShell {...props} onSelect={() => setOpen(true)} />
      <ExploreModal props={props} title="Sticky Note">
        {!done ? (
          <MiniPuzzle
            kind={kind}
            onSuccess={() => {
              setUnlocked(true);
              props.onUnlock();
            }}
          />
        ) : (
          <MessageReveal message={props.item.hidden_message} />
        )}
      </ExploreModal>
    </>
  );
}
