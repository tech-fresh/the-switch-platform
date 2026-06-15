export type OperationsStatus = "healthy" | "warning" | "critical";

export interface OperationsDomainSummary {
  domainId: "auth" | "persistence" | "saved-progress" | "assessments" | "exams" | "editorial";
  label: string;
  status: OperationsStatus;
  headline: string;
  detail: string;
  metricLabel: string;
  metricValue: string;
}

export interface OperationsAlert {
  alertId: string;
  severity: "warning" | "critical";
  title: string;
  detail: string;
  recommendedAction: string;
}

export interface OperationsPerformanceBudget {
  budgetId: string;
  label: string;
  status: "within-budget" | "watch";
  currentValue: string;
  targetValue: string;
  detail: string;
}

export interface OperationsRecoveryItem {
  itemId: string;
  label: string;
  status: "ready" | "watch";
  detail: string;
}

export interface OperationsOverview {
  generatedAt: string;
  overallStatus: OperationsStatus;
  alertCount: number;
  domains: OperationsDomainSummary[];
  alerts: OperationsAlert[];
  performanceBudgets: OperationsPerformanceBudget[];
  recoveryReadiness: OperationsRecoveryItem[];
}
