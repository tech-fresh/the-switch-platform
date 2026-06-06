import examSupportGuides from "@/data/exam-support-guides.json";
import supportResources from "@/data/support-resources.json";
import type { ExamSupportGuide, SupportHubData, SupportResource, UrgentHelpOption } from "./types";

const urgentHelp: UrgentHelpOption[] = [
  {
    optionId: "childline-now",
    name: "Childline",
    actionText: "Talk to a counsellor any time if things feel too much.",
    contactLabel: "Call 0800 1111",
    url: "https://www.childline.org.uk/get-support/1-2-1-counsellor-chat/",
    lastReviewedAt: "2026-06-06",
  },
  {
    optionId: "shout-now",
    name: "Shout",
    actionText: "Text support if you need help getting to a calmer place right now.",
    contactLabel: "Text SHOUT to 85258",
    url: "https://giveusashout.org/get-help/",
    lastReviewedAt: "2026-06-06",
  },
  {
    optionId: "nhs-urgent",
    name: "NHS urgent mental health help",
    actionText: "If you need urgent mental health support, use the NHS route to urgent help.",
    contactLabel: "Find urgent NHS help",
    url: "https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/",
    lastReviewedAt: "2026-06-06",
  },
];

export async function getSupportHubData(): Promise<SupportHubData> {
  return {
    title: "Trusted support links for young people, including exam stress help and urgent support routes.",
    description:
      "This support area is signposting only. It links to NHS services and established UK charities so students can find trusted help without the product pretending to be counselling or crisis care.",
    safetyNotice:
      "This route does not offer live counselling or emergency response. If you feel unsafe or need urgent help, use one of the urgent support options straight away and speak to a trusted adult, teacher, or school support lead.",
    urgentHelp,
    examSupportGuides: examSupportGuides as ExamSupportGuide[],
    trustedResources: supportResources as SupportResource[],
  };
}
