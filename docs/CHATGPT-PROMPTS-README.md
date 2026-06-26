# ChatGPT Prompt Pack

Use these files when you want to paste a high-context prompt into ChatGPT without rebuilding the project story from scratch.

## Files

- `CHATGPT-PROJECT-AUDIT-PROMPT.md`
  Use this when you want ChatGPT to analyze the project, identify gaps, review architecture, or propose code/documentation changes.

- `CHATGPT-WEBSITE-STREAMLINE-PROMPT.md`
  Use this when you want ChatGPT to improve website look-and-feel, streamline layouts, refine marketing surfaces, or propose front-end changes.

## How to use

1. Open the prompt file you need.
2. Paste the whole file into ChatGPT.
3. Add your specific task at the bottom, for example:

```text
Task:
Review the homepage and dashboard experience. Propose concrete changes to make the marketing story clearer without breaking onboarding or the signed-in shell.
```

4. If you want ChatGPT to work from current code, also paste:
   - relevant file contents
   - screenshots
   - terminal output
   - specific route URLs

## Important

These prompts are tuned to the current repo truth:

- current MVP closeout is complete
- Priorities A-D are closed
- Priority E is deferred scope only unless explicitly reopened
- onboarding stays at 8 steps and builds the dashboard
- Mock Idea / Study Atelier is the active visual direction for student-facing UI
