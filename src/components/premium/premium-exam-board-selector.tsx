"use client";

interface PremiumExamBoardSelectorProps {
  boards: string[];
  selectedBoard?: string;
  onSelect?: (board: string) => void;
}

export function PremiumExamBoardSelector({ boards, selectedBoard, onSelect }: PremiumExamBoardSelectorProps) {
  if (!boards.length) {
    return null;
  }

  const active = selectedBoard ?? boards[0];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Exam board">
      {boards.map((board) => {
        const isActive = board === active;

        return (
          <button
            key={board}
            type="button"
            onClick={() => onSelect?.(board)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-[#6C4EFF] bg-[#6C4EFF]/20 text-white"
                : "border-white/10 bg-[#121826] text-[#9CA3AF] hover:border-white/20 hover:text-white"
            }`}
            aria-pressed={isActive}
          >
            {board}
          </button>
        );
      })}
    </div>
  );
}
