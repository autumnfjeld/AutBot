# The AutBot Resume App

A personal project to explore Retrieval-Augmented Generation (RAG).  A tool to learn about Autumn's work and life experiences. 


👩‍🔬 Live at https://autbot.vercel.app/.  

Check out the [the AutBot issues]([url](https://github.com/autumnfjeld/AutBot/issues)) if you want to see what's coming next. Add an issue if you want to give me feedback.   


## Local Dev

### React App
* `npm install`
* `npm run dev`
* Client uns on port 5432, http://localhost:5432

### Python server
* `python3 -m venv venvautbot`
* `source venvautbot/bin/activate`
* `pip install -r requirements.txt`
* `uvicorn main:app --reload --host 0.0.0.0 --port 3001`
* ping server
  ```
     curl -X POST http://localhost:3001/api/query \
     -H "Content-Type: application/json" \
     -d '{"query":"What did Autumn do well?"}'
  ```


## Production

## Deploy frontend on vercel
* On push to github.com, vercell will auto-detect the push and start a new deployment. Magic. 


## Deploy backend on heroku
* Link autbot-backend to git 
  *   `heroku git:remote -a autbot-backend`
* Push subtree to heroku 
  * `git subtree push --prefix server-python heroku main` 
* test `curl https://autbot-backend-f8bf47922e24.herokuapp.com/api/test`
* https://autbot-backend-f8bf47922e24.herokuapp.com/
*  `heroku logs --tail` 
*  Get a log dump `heroku logs --app autbot-backend | grep "AUTBOT" > logs-{date}.txt`
