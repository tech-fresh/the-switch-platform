export interface ReinforcementContentSubject {
  subjectId: string;
  name: string;
}

export interface ReinforcementContentTopic {
  topicId: string;
  subjectId: string;
  name: string;
}

export interface ReinforcementExamPaper {
  examId: string;
  subject: string;
}

export interface ReinforcementTimedAssessmentDefinition {
  assessmentId: string;
  subject: string;
}

export interface ReinforcementSavedProgressRecord {
  entityId: string;
  entityType: "exam-session" | "timed-assessment-attempt";
  status: "in-progress" | "paused" | "submitted";
  lastActivityAt: string;
  examProgress?: {
    questionSet: Array<{
      questionId: string;
      topic: string;
      correctOptionId?: string;
    }>;
    questionResponses: Array<{
      questionId: string;
      selectedOptionId?: string;
      workingNotes?: string;
      flagged: boolean;
    }>;
  };
  timedAssessmentProgress?: {
    questionSet: Array<{
      questionId: string;
      topic: string;
      correctOptionId: string;
    }>;
    selectedAnswerIds: string[];
    notes: Record<string, string>;
    bookmarkedQuestionIds: string[];
  };
}

export interface TopicReinforcementSignal {
  subject: string;
  subjectId?: string;
  topic: string;
  topicId?: string;
  href: string;
  weaknessScore: number;
  flaggedCount: number;
  incorrectCount: number;
  unansweredCount: number;
  noteCount: number;
  bookmarkedCount: number;
  reviewItemCount: number;
  evidence: string;
  lastActivityAt?: string;
}

export interface SubjectReinforcementSignal {
  subject: string;
  subjectId?: string;
  href: string;
  recommendedFocus: string;
  recommendedTopicId?: string;
  evidence: string;
  weaknessScore: number;
  reviewItemCount: number;
  activeSessionCount: number;
  submittedSessionCount: number;
  primaryTopic?: TopicReinforcementSignal;
}

export interface AcademicReinforcementOverview {
  subjectSignals: SubjectReinforcementSignal[];
  weakestSubject?: SubjectReinforcementSignal;
  weakestTopic?: TopicReinforcementSignal;
}

interface TopicBucket {
  subject: string;
  subjectId?: string;
  topic: string;
  topicId?: string;
  href: string;
  weaknessScore: number;
  flaggedCount: number;
  incorrectCount: number;
  unansweredCount: number;
  noteCount: number;
  bookmarkedCount: number;
  reviewItemCount: number;
  lastActivityAt?: string;
}

interface SubjectBucket {
  subject: string;
  subjectId?: string;
  href: string;
  weaknessScore: number;
  reviewItemCount: number;
  activeSessionCount: number;
  submittedSessionCount: number;
  topics: Map<string, TopicBucket>;
}

export function buildAcademicReinforcementOverview(input: {
  records: ReinforcementSavedProgressRecord[];
  subjects: ReinforcementContentSubject[];
  topics: ReinforcementContentTopic[];
  examPapers: ReinforcementExamPaper[];
  timedAssessments: ReinforcementTimedAssessmentDefinition[];
}): AcademicReinforcementOverview {
  const subjectBuckets = new Map<string, SubjectBucket>();

  for (const record of input.records) {
    const subjectMatch = getRecordSubject(record, input.examPapers, input.timedAssessments, input.subjects);

    if (!subjectMatch) {
      continue;
    }

    const subjectKey = normalizeLabel(subjectMatch.subject);
    const subjectBucket =
      subjectBuckets.get(subjectKey) ??
      createSubjectBucket(subjectMatch.subject, subjectMatch.subjectId);
    subjectBucket.href = buildSubjectHref(subjectBucket.subjectId);

    if (record.status === "submitted") {
      subjectBucket.submittedSessionCount += 1;
    } else {
      subjectBucket.activeSessionCount += 1;
    }

    const topicSignals = getTopicSignalsForRecord(record, subjectMatch.subject, subjectMatch.subjectId, input.topics);

    for (const signal of topicSignals) {
      const topicKey = normalizeLabel(signal.topic);
      const topicBucket =
        subjectBucket.topics.get(topicKey) ??
        {
          ...signal,
          weaknessScore: 0,
          flaggedCount: 0,
          incorrectCount: 0,
          unansweredCount: 0,
          noteCount: 0,
          bookmarkedCount: 0,
          reviewItemCount: 0,
        };

      topicBucket.weaknessScore += signal.weaknessScore;
      topicBucket.flaggedCount += signal.flaggedCount;
      topicBucket.incorrectCount += signal.incorrectCount;
      topicBucket.unansweredCount += signal.unansweredCount;
      topicBucket.noteCount += signal.noteCount;
      topicBucket.bookmarkedCount += signal.bookmarkedCount;
      topicBucket.reviewItemCount += signal.reviewItemCount;
      topicBucket.lastActivityAt = maxIsoTimestamp(topicBucket.lastActivityAt, signal.lastActivityAt);
      subjectBucket.topics.set(topicKey, topicBucket);
    }

    subjectBucket.weaknessScore = [...subjectBucket.topics.values()].reduce(
      (total, topic) => total + topic.weaknessScore,
      0,
    );
    subjectBucket.reviewItemCount = [...subjectBucket.topics.values()].reduce(
      (total, topic) => total + topic.reviewItemCount,
      0,
    );
    subjectBuckets.set(subjectKey, subjectBucket);
  }

  const subjectSignals = [...subjectBuckets.values()]
    .map((bucket) => buildSubjectSignal(bucket))
    .sort((left, right) => {
      if (right.weaknessScore !== left.weaknessScore) {
        return right.weaknessScore - left.weaknessScore;
      }

      return right.reviewItemCount - left.reviewItemCount;
    });
  const weakestSubject = subjectSignals[0];
  const weakestTopic = subjectSignals
    .map((subject) => subject.primaryTopic)
    .filter((topic): topic is TopicReinforcementSignal => Boolean(topic))
    .sort((left, right) => {
      if (right.weaknessScore !== left.weaknessScore) {
        return right.weaknessScore - left.weaknessScore;
      }

      return right.reviewItemCount - left.reviewItemCount;
    })[0];

  return {
    subjectSignals,
    weakestSubject,
    weakestTopic,
  };
}

function buildSubjectSignal(bucket: SubjectBucket): SubjectReinforcementSignal {
  const primaryTopicBucket = [...bucket.topics.values()].sort((left, right) => {
    if (right.weaknessScore !== left.weaknessScore) {
      return right.weaknessScore - left.weaknessScore;
    }

    return right.reviewItemCount - left.reviewItemCount;
  })[0];
  const primaryTopic = primaryTopicBucket ? buildTopicSignal(primaryTopicBucket) : undefined;

  return {
    subject: bucket.subject,
    subjectId: bucket.subjectId,
    href: bucket.href,
    recommendedFocus: primaryTopic?.topic ?? "Revision practice",
    recommendedTopicId: primaryTopic?.topicId,
    evidence: primaryTopic ? primaryTopic.evidence : "More saved evidence will clarify the next best topic.",
    weaknessScore: bucket.weaknessScore,
    reviewItemCount: bucket.reviewItemCount,
    activeSessionCount: bucket.activeSessionCount,
    submittedSessionCount: bucket.submittedSessionCount,
    primaryTopic: primaryTopic ? buildTopicSignal(primaryTopic) : undefined,
  };
}

function buildTopicSignal(bucket: TopicBucket): TopicReinforcementSignal {
  return {
    ...bucket,
    evidence: buildTopicEvidence(bucket),
  };
}

function getTopicSignalsForRecord(
  record: ReinforcementSavedProgressRecord,
  subject: string,
  subjectId: string | undefined,
  contentTopics: ReinforcementContentTopic[],
): TopicBucket[] {
  if (record.entityType === "exam-session" && record.examProgress) {
    const responseByQuestionId = new Map(
      record.examProgress.questionResponses.map((response) => [response.questionId, response] as const),
    );
    const topicBuckets = new Map<string, TopicBucket>();

    for (const question of record.examProgress.questionSet) {
      const response = responseByQuestionId.get(question.questionId);
      const unanswered = !response?.selectedOptionId;
      const incorrect =
        Boolean(response?.selectedOptionId) &&
        Boolean(question.correctOptionId) &&
        response?.selectedOptionId !== question.correctOptionId;
      const flagged = response?.flagged ?? false;
      const noteCount = response?.workingNotes?.trim() ? 1 : 0;
      const weaknessScore = (incorrect ? 3 : 0) + (unanswered ? 2 : 0) + (flagged ? 2 : 0) + noteCount;

      if (weaknessScore === 0) {
        continue;
      }

      accumulateTopicBucket(topicBuckets, {
        subject,
        subjectId,
        rawTopic: question.topic,
        contentTopics,
        weaknessScore,
        flaggedCount: flagged ? 1 : 0,
        incorrectCount: incorrect ? 1 : 0,
        unansweredCount: unanswered ? 1 : 0,
        noteCount,
        bookmarkedCount: 0,
        reviewItemCount: flagged || incorrect || unanswered ? 1 : 0,
        lastActivityAt: record.lastActivityAt,
      });
    }

    return [...topicBuckets.values()].map(buildTopicSignal);
  }

  if (record.entityType === "timed-assessment-attempt" && record.timedAssessmentProgress) {
    const selectedAnswerByQuestionId = new Map(
      record.timedAssessmentProgress.selectedAnswerIds.map((answerId) => {
        const separatorIndex = answerId.indexOf(":");
        return [
          separatorIndex >= 0 ? answerId.slice(0, separatorIndex) : answerId,
          separatorIndex >= 0 ? answerId.slice(separatorIndex + 1) : "",
        ] as const;
      }),
    );
    const topicBuckets = new Map<string, TopicBucket>();

    for (const question of record.timedAssessmentProgress.questionSet) {
      const selectedOptionId = selectedAnswerByQuestionId.get(question.questionId);
      const unanswered = !selectedOptionId;
      const incorrect = Boolean(selectedOptionId) && selectedOptionId !== question.correctOptionId;
      const bookmarked = record.timedAssessmentProgress.bookmarkedQuestionIds.includes(question.questionId);
      const noteCount = record.timedAssessmentProgress.notes[question.questionId]?.trim() ? 1 : 0;
      const weaknessScore = (incorrect ? 3 : 0) + (unanswered ? 2 : 0) + (bookmarked ? 2 : 0) + noteCount;

      if (weaknessScore === 0) {
        continue;
      }

      accumulateTopicBucket(topicBuckets, {
        subject,
        subjectId,
        rawTopic: question.topic,
        contentTopics,
        weaknessScore,
        flaggedCount: 0,
        incorrectCount: incorrect ? 1 : 0,
        unansweredCount: unanswered ? 1 : 0,
        noteCount,
        bookmarkedCount: bookmarked ? 1 : 0,
        reviewItemCount: incorrect || unanswered || bookmarked ? 1 : 0,
        lastActivityAt: record.lastActivityAt,
      });
    }

    return [...topicBuckets.values()].map(buildTopicSignal);
  }

  return [];
}

function accumulateTopicBucket(
  buckets: Map<string, TopicBucket>,
  input: {
    subject: string;
    subjectId?: string;
    rawTopic: string;
    contentTopics: ReinforcementContentTopic[];
    weaknessScore: number;
    flaggedCount: number;
    incorrectCount: number;
    unansweredCount: number;
    noteCount: number;
    bookmarkedCount: number;
    reviewItemCount: number;
    lastActivityAt?: string;
  },
) {
  const topicMatch = matchTopic(input.subjectId, input.rawTopic, input.contentTopics);
  const topicKey = normalizeLabel(topicMatch?.name ?? input.rawTopic);
  const existing = buckets.get(topicKey);
  const topicBucket: TopicBucket =
    existing ??
    {
      subject: input.subject,
      subjectId: input.subjectId,
      topic: topicMatch?.name ?? input.rawTopic,
      topicId: topicMatch?.topicId,
      href: buildSubjectHref(input.subjectId, topicMatch?.topicId),
      weaknessScore: 0,
      flaggedCount: 0,
      incorrectCount: 0,
      unansweredCount: 0,
      noteCount: 0,
      bookmarkedCount: 0,
      reviewItemCount: 0,
      lastActivityAt: input.lastActivityAt,
    };

  topicBucket.weaknessScore += input.weaknessScore;
  topicBucket.flaggedCount += input.flaggedCount;
  topicBucket.incorrectCount += input.incorrectCount;
  topicBucket.unansweredCount += input.unansweredCount;
  topicBucket.noteCount += input.noteCount;
  topicBucket.bookmarkedCount += input.bookmarkedCount;
  topicBucket.reviewItemCount += input.reviewItemCount;
  topicBucket.lastActivityAt = maxIsoTimestamp(topicBucket.lastActivityAt, input.lastActivityAt);
  buckets.set(topicKey, topicBucket);
}

function getRecordSubject(
  record: ReinforcementSavedProgressRecord,
  examPapers: ReinforcementExamPaper[],
  timedAssessments: ReinforcementTimedAssessmentDefinition[],
  subjects: ReinforcementContentSubject[],
): { subject: string; subjectId?: string } | null {
  if (record.entityType === "exam-session") {
    const paper = examPapers.find((candidate) =>
      record.entityId.startsWith(`${candidate.examId}-session-`),
    );

    if (!paper) {
      return null;
    }

    return {
      subject: paper.subject,
      subjectId: matchSubjectId(paper.subject, subjects),
    };
  }

  const assessment = timedAssessments.find((candidate) =>
    record.entityId.startsWith(`${candidate.assessmentId}-attempt-`),
  );

  if (!assessment) {
    return null;
  }

  return {
    subject: assessment.subject,
    subjectId: matchSubjectId(assessment.subject, subjects),
  };
}

function matchSubjectId(
  subject: string,
  subjects: ReinforcementContentSubject[],
): string | undefined {
  const normalizedSubject = normalizeLabel(subject);

  return subjects.find((candidate) => normalizeLabel(candidate.name).includes(normalizedSubject))?.subjectId;
}

function matchTopic(
  subjectId: string | undefined,
  rawTopic: string,
  topics: ReinforcementContentTopic[],
): ReinforcementContentTopic | undefined {
  const candidateTopics = subjectId
    ? topics.filter((topic) => topic.subjectId === subjectId)
    : topics;
  const normalizedRawTopic = normalizeLabel(rawTopic);
  const exact = candidateTopics.find((topic) => normalizeLabel(topic.name) === normalizedRawTopic);

  if (exact) {
    return exact;
  }

  const fuzzy = candidateTopics
    .map((topic) => ({
      topic,
      score: getTopicMatchScore(normalizeLabel(topic.name), normalizedRawTopic),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score)[0];

  return fuzzy?.topic;
}

function getTopicMatchScore(left: string, right: string): number {
  if (left === right) {
    return 100;
  }

  if (left.includes(right) || right.includes(left)) {
    return 50;
  }

  const leftWords = new Set(left.split(/\s+/));
  const rightWords = new Set(right.split(/\s+/));
  let overlap = 0;

  for (const word of leftWords) {
    if (rightWords.has(word)) {
      overlap += 1;
    }
  }

  return overlap;
}

function createSubjectBucket(subject: string, subjectId?: string): SubjectBucket {
  return {
    subject,
    subjectId,
    href: buildSubjectHref(subjectId),
    weaknessScore: 0,
    reviewItemCount: 0,
    activeSessionCount: 0,
    submittedSessionCount: 0,
    topics: new Map(),
  };
}

function buildTopicEvidence(topic: TopicBucket): string {
  const parts: string[] = [];

  if (topic.incorrectCount > 0) {
    parts.push(`${topic.incorrectCount} incorrect answer${topic.incorrectCount === 1 ? "" : "s"}`);
  }

  if (topic.unansweredCount > 0) {
    parts.push(`${topic.unansweredCount} unanswered question${topic.unansweredCount === 1 ? "" : "s"}`);
  }

  if (topic.flaggedCount > 0) {
    parts.push(`${topic.flaggedCount} flagged review item${topic.flaggedCount === 1 ? "" : "s"}`);
  }

  if (topic.bookmarkedCount > 0) {
    parts.push(`${topic.bookmarkedCount} bookmarked checkpoint item${topic.bookmarkedCount === 1 ? "" : "s"}`);
  }

  if (topic.noteCount > 0) {
    parts.push(`${topic.noteCount} saved note${topic.noteCount === 1 ? "" : "s"}`);
  }

  if (parts.length === 0) {
    return "More saved evidence will clarify the next best topic.";
  }

  return `${parts.join(", ")} point${parts.length === 1 ? "s" : ""} to this as the next reinforcement topic.`;
}

function buildSubjectHref(subjectId?: string, topicId?: string): string {
  if (!subjectId) {
    return "/subjects";
  }

  const searchParams = new URLSearchParams({
    subjectId,
  });

  if (topicId) {
    searchParams.set("topicId", topicId);
  }

  return `/subjects?${searchParams.toString()}`;
}

function maxIsoTimestamp(left?: string, right?: string): string | undefined {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  return left >= right ? left : right;
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}
