# Chaneglog & Learnlog

Notable changes and learnings in the AutBot project

### 2025 September 22 - Client v0.4.0
- Migrate client to TypeScript end-to-end following project rules
  - Converted components: `Header`, `Footer`, `SamplePrompts`, `QueryForm`, `ResponseDisplay`, `StructuredResponse`
  - Converted app entry and shell: `main.tsx`, `App.tsx`, barrel `components/index.ts`
  - Converted hooks: `useQuery.ts`, `hooks/index.ts` with strict typings
  - Converted assets and config: `RobotIcon.tsx`, `config.ts`
  - Added image module declarations `src/types/assets.d.ts`
  - Updated dev script to `vite --host 0.0.0.0` for local reliability
  - Ensured no linter errors across new TS files

### 2025 June 3 - Client v0.3.0
- **Major React App Refactoring**: Restructured the entire client-side codebase following React best practices
  - Broke down monolithic `App.jsx` (147 lines) into focused, reusable components
  - Created organized component structure: `Header`, `QueryForm`, `ResponseDisplay`, `Footer`
  - Implemented custom `useQuery` hook for API state management and business logic separation
  - Added clean import/export patterns with index files for better developer experience
  - Applied React principles: single responsibility, composition over inheritance, props down/events up
  - Improved maintainability, testability, and code organization
  - Added component documentation for future development

### 2025 May 27
- Added simple query and response logging and a daily cron job to make daily local copies of heroku logs.

### 2025 May 26
- Organize server code into proper structure and separation of concerns
- Add document weights, to force llama_index to prioritize resume content over fun content. This worked!  Should have set up eval testing earlier.
- Add eval testing to troubleshoot why "What was Autumn's last job" was returning an incorrect answer.  Eval testing resolved the issue!   
  - Could get fancy in the future with OpenAIs eval framework.
  - Played with both plain funciton and logging and with pytest. Will keep both for now. 

### 2025 May 19
- Set up heroku `autbot-backend`
- Set up vercel front end aut-bot.vercel.com

### Init
- Initial project setup with npm create vite@latest using React template
- Tailwind CSS integration
- Python server implementation
  -  (scrap node backend due to preferred LLM tooling in python)
- LlamaIndex integration for RAG with AutData in server-python/data