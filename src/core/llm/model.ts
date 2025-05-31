import Anthropic from "@anthropic-ai/sdk";

export interface LLMModel {
    createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): Promise<string>;
    getModel(): string;
}