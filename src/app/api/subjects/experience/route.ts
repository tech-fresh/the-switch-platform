import { NextResponse } from "next/server";
import { getMockQuizQuestion } from "@/modules/quiz/service";
import { getMockRevisionContent } from "@/modules/revision/service";
import { getMockSubjects } from "@/modules/subjects/service";
import { getMockTopicsForSubject } from "@/modules/topics/service";

export async function GET() {
  const subjects = getMockSubjects();
  const topicsBySubject = Object.fromEntries(
    subjects.map((subject) => [subject.subjectId, getMockTopicsForSubject(subject.subjectId)]),
  );
  const allTopics = Object.values(topicsBySubject).flat();
  const revisionByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockRevisionContent(topic.topicId)]),
  );
  const quizByTopic = Object.fromEntries(
    allTopics.map((topic) => [topic.topicId, getMockQuizQuestion(topic.topicId)]),
  );

  return NextResponse.json({
    experience: {
      subjects,
      topicsBySubject,
      revisionByTopic,
      quizByTopic,
    },
  });
}
