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
                ? "border-[#0f766e]/30 bg-[#0f766e]/10 text-[#0f766e]"
                : "border-[#ddd3c6] bg-white text-[#52646a] hover:border-[#0f766e]/25 hover:text-[#163038]"
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
