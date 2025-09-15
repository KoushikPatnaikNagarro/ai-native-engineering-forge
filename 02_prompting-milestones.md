# Your Pathway to Prompting Mastery

## Objective

We are practicing a fast, practical way to get from a raw prompt to a compact instruction set that works across similar-intent tasks. Across three short milestones, participants first learn the loop on a simple task, then apply it to a second and third task with the same goal shape (e.g., "summarize X," "generate stories for Y"), until it becomes obvious which parts of the prompt stay the same (the core) and which parts change (the slots/variables).

## Why this matters

- **Faster to quality:** Less time "fiddling," more time getting usable outputs.
- **Transferable know-how:** You leave with a prompt that others can use by filling a few slots.
- **Clear thinking:** Forces crisp task definition and lightweight evaluation of what actually improved results.
- **Team fit:** A shared structure (core + slots) makes collaboration and handoffs simpler—without mandating a rigid format.

## The core loop (simple and repeatable)

Identify the task → Prompt → Reflect → Refine → Repeat as needed

- **Identify the task:** One plain sentence stating the intended outcome and who it's for.
- **Prompt:** Write a simple prompt and run it once
- **Reflect:** Note what's off (missing constraints, wrong tone/format, weak context)
- **Refine:** Edit only what those gaps demand; run again. Avoid wholesale rewrites
- **Repeat:** Cycle until you feel the output is valuable

## Milestone 1 — Learn to Iterate

What we're doing: Pick a straightforward task and run the core loop multiple times. Start with a rough prompt, test it, spot what's wrong, fix only those specific issues, and repeat until it works reliably.

Why it matters: Builds the foundational skill of evidence-based refinement rather than guessing what might work better.

What you preserve: All prompt versions, each output, your reasoning for each change made, and the final working prompt with example output.

Success indicator: You can run your final prompt 3 times and get consistently useful results.

Reflection: What surprised you most about how the prompt evolved?

## Milestone 2 — Practice Transfer

What we're doing: Take your final prompt from Milestone 1 and run it directly on a new but similar-intent task. When gaps appear, iterate using the same loop approach.

Why it matters: Reveals how much of your prompt structure transfers to similar tasks, making future work faster and building confidence in your approach.

What you preserve: The adapted prompt, outputs from both tasks, and a change register documenting what you modified and why.

Success indicator: The second task worked with fewer iterations than the first.

Reflection: How much easier was it to get a working result compared to Milestone 1?

## Milestone 3 — Extract the Pattern

What we're doing: Apply your prompt to a third similar task, run the loop, then step back and identify what never changed across all three tasks (the Core) versus what always needed adjustment (the Slots).

Why it matters: Creates a reusable template that teammates can use by simply filling in their specific details, without rewriting core instructions.

What you preserve: The generalized template (Core + labeled Slots), fill-in guidance for each slot, and a worked example showing the template in action.

Success indicator: Someone else can use your template without asking you for clarification.

Reflection: What would you tell someone else about the difference between the Core and Slots?

## Prompting Best Practices

Essential guidelines to help you write effective prompts and avoid common pitfalls. These practices reinforce the core loop methodology and provide practical reference points for your prompting work.

### Do's

Positive behaviors that consistently lead to better prompts and more reliable outputs.

- **Do** test your prompt multiple times before calling it final
- **Do** be specific about format, tone, and audience
- **Do** include concrete examples when the task is complex
- **Do** preserve all your iterations - they show your thinking process
- **Do** state exactly what success looks like
- **Do** build incrementally - add one constraint at a time
- **Do** provide enough context for the AI to understand your domain
- **Do** specify the role or perspective you want the AI to take

### Don'ts

Common mistakes that can derail your prompting efforts and waste time.

- **Don't** rewrite from scratch when you hit a problem - debug instead
- **Don't** use vague language like "make it better" or "optimize this"
- **Don't** assume the AI knows your context without explaining it
- **Don't** add every possible constraint upfront - start simple
- **Don't** ignore consistent patterns in failed outputs
- **Don't** mix multiple unrelated tasks in one prompt
- **Don't** forget to specify output length or scope
- **Don't** use jargon without defining it first

### Gotchas

Subtle traps and counterintuitive behaviors that can catch even experienced prompters off guard.

- **The first good result might not be repeatable** - always test consistency
- **What works for you might not work for your teammate** - different mental models need different prompts
- **Longer prompts aren't always better** - sometimes you're just adding noise
- **Context from earlier in the conversation can interfere** - start fresh when testing
- **The AI might latch onto one example and ignore instructions** - balance examples with clear rules
- **Asking for "creative" output often produces generic results** - be specific about what kind of creativity
- **The AI may hallucinate facts confidently** - always verify claims and citations
- **Order matters** - the AI pays more attention to information that comes later in the prompt

## Elements of a Good Prompt

The building blocks that make prompts clear, actionable, and effective. Use these as a checklist when crafting or refining your prompts.

### 1. Clear Task Definition
- What exactly you want done (not "improve this" but "rewrite this email to sound more professional")
- Single, focused objective - tackle one main task per prompt rather than mixing "summarize this AND create action items AND suggest improvements"
- Avoid vague verbs like "optimize," "enhance," or "make better" - use specific action words like "rewrite," "extract," "format"

### 2. Context & Background
- Relevant domain information - if discussing medical terms, mention it's for healthcare professionals vs. general audience
- Situational details the AI needs to know - "this is for a quarterly board presentation" vs. "this is for internal team use"
- Why this task matters and how it fits into the bigger picture - helps the AI prioritize what's most important

### 3. Role/Perspective
- Who should the AI act as (expert, beginner, specific professional) - "act as a senior marketing manager" vs. "act as someone new to this topic"
- What lens to view the problem through - analytical, creative, practical, strategic
- The expertise level and mindset to adopt - formal consultant vs. friendly colleague vs. technical specialist

### 4. Input Specifications
- What you're providing (document, data, scenario) - "the attached 10-page report" or "the following customer feedback data"
- Any constraints or formats for the input material - "focus only on sections 2-4" or "ignore the appendices"
- How the AI should interpret or handle the input - "treat these as raw notes" vs. "these are final requirements"

### 5. Output Format
- Structure requirements (bullet points, paragraph, table, JSON) - be specific about hierarchy, numbering, sections
- Length expectations and scope - "3-5 bullet points" vs. "2-page detailed analysis" vs. "one paragraph summary"
- Style, tone, and formatting guidelines - professional/casual, technical/simple, persuasive/informative

### 6. Audience Definition
- Who will consume this output - "C-level executives," "new team members," "technical engineers"
- Their level of expertise and familiarity with the topic - beginners need definitions, experts want advanced insights
- What they care about most and need to know - executives want business impact, engineers want technical details

### 7. Success Criteria
- What "good" looks like with specific quality measures - "covers all 5 key points," "uses data to support claims"
- Examples of desired outcomes - "like this sample output" or "should enable the reader to make a decision"
- How to recognize when the task is complete - clear finish line rather than open-ended improvement

### 8. Constraints & Boundaries
- What NOT to include or avoid - "don't mention competitors by name" or "avoid technical jargon"
- Any limitations or requirements to follow - word limits, compliance rules, brand guidelines
- Clear scope boundaries and exclusions - "focus only on Q3 data, ignore Q4 projections"

### 9. Examples (when helpful)
- Good examples of desired output for complex tasks - actual samples of what success looks like
- Bad examples to avoid and why they don't work - "not like this because it's too vague/long/technical"
- Edge cases to consider and handle appropriately - unusual scenarios that might confuse the AI

### 10. Verification Instructions
- How to check the output quality and accuracy - "verify all statistics" or "ensure consistent terminology"
- What specific elements to validate - facts, format, tone, completeness, logical flow
- Quality checkpoints and review criteria - "does it answer the original question?" "can someone act on this?"

## Example: Ideal Prompt Structure

Here's a complete example showing how to apply the elements above when summarizing a product requirements document:

---

**Task:** Create an executive summary of the attached product requirements document for our quarterly product review meeting.

**Role:** Act as a senior product manager preparing a briefing for C-level executives who need to make go/no-go decisions on this feature.

**Context:** This is a new mobile payment feature for our fintech app. The full PRD is 25 pages and covers technical specifications, user stories, and implementation details. The executive team has 15 minutes to review this before the product review meeting next Tuesday, where they'll decide on budget allocation and timeline approval.

**Input:** The attached PRD document - focus on sections 1-3 (Overview, Business Case, User Requirements) and section 7 (Success Metrics). Ignore the technical architecture details in sections 4-6.

**Output Format:** 
- Executive summary format
- Exactly 4 sections: Problem Statement, Solution Overview, Business Impact, Resource Requirements
- 3-4 bullet points per section
- 1 page maximum
- Professional, concise tone

**Audience:** CEO, CPO, and Head of Engineering - they understand our business model but need the technical complexity translated into business terms. They care most about revenue impact, user adoption potential, and development effort required.

**Success Criteria:**
- Enables executives to understand the feature value in under 5 minutes
- Provides enough detail to make a funding decision
- Highlights any major risks or dependencies
- Includes specific metrics and timelines

**Constraints:**
- Don't include technical jargon or implementation details
- Don't mention competitor features by name
- Keep financial projections conservative
- Avoid marketing language - stick to facts and data

**Verification:** The summary should answer: What problem does this solve? How much will it cost? What's the expected return? When can we deliver it?

---

This prompt incorporates all 10 elements and gives the AI everything needed to create exactly what's required.
