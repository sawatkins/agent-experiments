import { runWorkflow } from "./blog-corpus-qa-agent";

const prompt = process.argv.slice(2).join(" ").trim();

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in the environment.");
  process.exit(1);
}

if (!prompt) {
  console.error('Usage: bun run dev -- "your question about the blog corpus"');
  process.exit(1);
}

const result = await runWorkflow({ input_as_text: prompt });
console.log(result.output_text);
