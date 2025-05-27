# Chaneglog & Learnlog

Notable changes and learnings in the AutBot project

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