import type { LearningLoopStage } from "@/modules/learning-loop/types";
import { getLearningLoopStageLabel } from "@/modules/learning-loop/vocabulary";

const LOOP_STAGES: LearningLoopStage[] = [
  "learn",
  "question",
  "feedback",
  "progress",
  "next",
  "complete",
];

interface LearningLoopStepRailProps {
  stage: LearningLoopStage;
}

export function LearningLoopStepRail({ stage }: LearningLoopStepRailProps) {
  const activeIndex = LOOP_STAGES.indexOf(stage);

  return (
    <nav aria-label="Learning loop progress" className="flex flex-wrap gap-2">
      {LOOP_STAGES.map((loopStage, index) => {
        const isActive = loopStage === stage;
        const isComplete = index < activeIndex;

        return (
          <span
            key={loopStage}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
              isActive
                ? "bg-teal-800 text-white"
                : isComplete
                  ? "bg-teal-100 text-teal-900"
                  : "bg-stone-100 text-stone-600"
            }`}
          >
            {getLearningLoopStageLabel(loopStage)}
          </span>
        );
      })}
    </nav>
  );
}
