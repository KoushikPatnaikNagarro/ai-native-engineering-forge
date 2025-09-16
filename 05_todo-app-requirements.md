# To-Do App Requirements

## 1. Objective

Provide a frictionless, no-login to-do app that allows users to quickly note tasks and manage them with minimal effort. The emphasis is on simplicity, clarity, and speed, giving users an easy way to jot reminders and track their state.


## 2. Persona / User Role

**Note Taker**

Anyone who needs to capture reminders or quick tasks without overhead.

**Goal:** jot something instantly, keep track of what's done, and see what's pending.

## 3. Core Functional Expectations

- **Add a Task:** Instantly add tasks through a simple text input.
- **Statuses:** Tasks can be in two states — Open or Completed.
- **Bulk Update:** User can mark multiple open tasks as completed at once.
- **Reopen:** Removing "mark as complete" reverts a task to Open.
- **Filter:** Simple view toggle between All, Open, and Completed.
- **Sorting:** Tasks/cards appear in the order they were added (chronological).
- **Clear Completed Tasks:** User can clear all completed tasks and they should no longer appear on UI. 

## 4. Constraints and Assumptions

### Constraints:
- No authentication or login.
- No advanced features (tags, groups, reordering, due dates, persistence).
- Tasks are session-based and may not persist after refresh.

### Assumptions:
- Users prioritize speed over organization.
- Tasks are short-term, lightweight reminders.
- Minimal features = less cognitive load and faster adoption.

## 5. Targeted User Experience
The user experience should mimic https://todomvc.com/examples/react/dist/

## 6. Success Criteria

- **Ease of Addition:** Task can be added in seconds with zero setup.
- **Update Flow:** Bulk completion and reopening are intuitive and quick. 
- **Clarity:** Users can filter to see exactly what they need (All, Open, Completed).
- **Reliability:** Task list always reflects user's last actions, sorted by time of addition.

## Contact Information

For any questions or clarifications regarding these requirements, please feel free to reach out to the appropriate team member:

- **Chief Coordinator:** mansi.gupta06@nagarro.com
- **Specifier:** koushik.patnaik@nagarro.com
- **Designer:** hamdur.rahman@nagarro.com  
- **Builder:** anup.vasudeva@nagarro.com
