Here’s a clear, well-structured, and concise `README.md` file for your AI-native project. It includes a detailed overview of the phases, generated artifacts, and how the project meets advanced AI-native evaluation criteria.

---

# 🧠 AI-Native SDLC Automation Project

## Overview

This project reimagines the traditional software development lifecycle (SDLC) using an **AI-first approach**. It automates the transformation of high-level design inputs into complete application code through three distinct phases:

---

## 🚀 Project Workflow

### **Phase 1: Requirements Generation**
**Input:** '05_todo-app-requirements.md' placed in high_level_design_folder  
**Output Folder:** `specification/`

Artifacts generated:
- `functional_overview.md`: Summarizes the system's purpose and key functionalities.
- `task_breakdown.csv`: Structured breakdown of tasks, modules, and responsibilities.

---

### **Phase 2: Design Artifacts Creation**
**Input:** `design_prompt.md`  
**Output Folders & Files:**
- `accessibility-guidelines.md`: Accessibility standards and compliance notes.
- `assets/`: Design assets (icons, images, etc.).
- `components/`: UI components and reusable design elements.
- `design-specifications.md`: Detailed design rules and layout specifications.
- `files.txt`: List of all design-related files.
- `handoff-documentation.md`: Developer-ready documentation for implementation.
- `user-flows/`: Visual and textual user journey maps.
- `wireframes/`: Low-fidelity wireframes for each screen or module.

---

### **Phase 3: Application Generation**
**Input:** `coding_prompt.md`  
**Output:** Full application codebase generated in the same workspace, aligned with the design and requirements and tests generated.

---

## ✅ AI-Native Approach

### **Process Transformation**
- ✅ Fundamentally different from traditional SDLC workflows.
- ✅ Achieves high-quality outputs in a fraction of manual time.
- ✅ Entirely AI-led with human strategic oversight.

### **Prompting Excellence**
- ✅ Structured, reusable, and domain-specific prompts.
- ✅ Consistent quality across multiple runs.
- ✅ Prompts demonstrate mastery of the core loop: `prompt → output → refinement`.

### **Iteration Maturity**
- ✅ Documented refinement cycles with clear gap → fix reasoning.
- ✅ Evident learning and targeted improvements.
- ✅ Traceable evolution from rough drafts to polished deliverables.

### **AI-Human Collaboration**
- ✅ AI handles generation; humans guide strategy and validation.
- ✅ Effective use of AI strengths: speed, pattern recognition, and scale.
- ✅ Human input focused on refinement and direction.

### **Workflow Innovation**
- ✅ Eliminates traditional bottlenecks and handoff delays.
- ✅ Scalable across domains and teams.
- ✅ Reusable templates and prompt patterns.
- ✅ Redefines how SDLC is executed.

---

## 🌟 Innovation Strategy

### **Future-Proofing**
- ✅ Generic prompts to cater to other quick app development requirements
- ✅ Designed to create apps based on minimal input in high level 

### **Surprise Factor**
- ✅ Improved UI/UX seamlessly based on concise user input in prompt eg- bubbles up Open ToDo and pushes completed todos at the bottom
- ✅ Interactive design and Nagarro based UI/UX design guidelines
- ✅ Create App each story wise example - S05 by giving the Story id

### **Cross-Pathway Integration**
- ✅ Artifacts seamlessly feed into subsequent SDLC phases.
- ✅ Bridges gaps between design, development, and documentation.

### **Novel AI Applications**
- ✅ Uses AI in unexplored ways for SDLC automation.
- ✅ Discovers new prompt patterns and interaction models.



---

## 📁 Folder Structure

```
workspace/
├── high_level_requirements
    ├── 05_todo-app-requirements.md
├── specification/
│   ├── functional_overview.md
│   └── task_breakdown.csv
├── design/
│   ├── accessibility-guidelines.md
│   ├── assets/
│   ├── components/
│   ├── design-specifications.md
│   ├── files.txt
│   ├── handoff-documentation.md
│   ├── user-flows/
│   └── wireframes/
├── application/
│   └── [Generated Codebase]
├── prompts
    ├── requirement_analysis_prompt.md
    ├── design_prompt.md
    └── coding_prompt.md
```

---

## 📌 How to Use

1. Place your high-level requirements in `high_level_requirements` folder`.
2. Run  `prompts/01_requirement-analysis-prompt.md` to generate requirements.
3. Use `prompts/02_design_prompt.md` to initiate Phase 2 and generate design artifacts.
4. Use `prompts/03_coding_prompt.md` to trigger Phase 3 and generate the application.

---