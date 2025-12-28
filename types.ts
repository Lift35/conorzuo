export interface StructuredPrompt {
  system_role: string;
  context_variables: string;
  instructions_constraints: string;
  few_shot_examples: string;
  reasoning_strategy: string;
  output_format: string;
}

export enum ReasoningStrategy {
  COT = "Chain of Thought (CoT)",
  STEP_BACK = "Step-back Prompting",
  SELF_CONSISTENCY = "Self-consistency"
}

export interface PromptGenerationRequest {
  rawPrompt: string;
  strategies: ReasoningStrategy[];
}

export interface GeneratedResult {
  structured: StructuredPrompt;
  rawJson: string;
}
