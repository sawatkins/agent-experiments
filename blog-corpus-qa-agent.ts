import { tool, RunContext, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";
import { z } from "zod";


// Tool definitions
const getPages = tool({
  name: "getPages",
  description: "Retrieve a list of search result pages based on a query string",
  parameters: z.object({
    query: z.string()
  }),
  execute: async (input: {query: string}) => {
    // TODO: Unimplemented
  },
});
interface BlogCorpusQaAgentContext {
  workflowInputAsText: string;
}
const blogCorpusQaAgentInstructions = (runContext: RunContext<BlogCorpusQaAgentContext>, _agent: Agent<BlogCorpusQaAgentContext>) => {
  const { workflowInputAsText } = runContext.context;
  return `You answer questions about the blogsearch.io page corpus.

Your job:
1. Determine whether the user’s request is about the blog/page dataset.
2. If it is in scope, search the dataset before answering.
3. Read the most relevant pages before writing the final answer.
4. Answer only using information supported by the retrieved pages.
5. Cite the pages you used.
6. If the dataset does not contain enough evidence, say that clearly.
7. If the request is out of scope, say that this agent only answers questions about the blog/page corpus.

Be concise and factual.
Do not invent sources, pages, facts, or quotes.
Prefer searching first rather than guessing. 

${workflowInputAsText}`
}
const blogCorpusQaAgent = new Agent({
  name: "Blog Corpus QA Agent",
  instructions: blogCorpusQaAgentInstructions,
  model: "gpt-5.4",
  tools: [
    getPages
  ],
  modelSettings: {
    parallelToolCalls: true,
    reasoning: {
      effort: "medium",
      summary: "auto"
    },
    store: true
  }
});

type WorkflowInput = { input_as_text: string };


// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("New agent", async () => {
    const state = {

    };
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_69c0a1474da88190b5a014f249e8fba8013278be4fe7e667"
      }
    });
    const blogCorpusQaAgentResultTemp = await runner.run(
      blogCorpusQaAgent,
      [
        ...conversationHistory
      ],
      {
        context: {
          workflowInputAsText: workflow.input_as_text
        }
      }
    );
    conversationHistory.push(...blogCorpusQaAgentResultTemp.newItems.map((item) => item.rawItem));

    if (!blogCorpusQaAgentResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const blogCorpusQaAgentResult = {
      output_text: blogCorpusQaAgentResultTemp.finalOutput ?? ""
    };
  });
}

