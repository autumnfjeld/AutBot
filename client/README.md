# The AutBot Resume App

A personal project to explore Retrieval-Augmented Generation (RAG).  A tool to learn about Autumn's work and life experiences. 

🚧 This is work in progress.  

👩‍🔬 Prototype now live at https://aut-bot.vercel.app/.  



## Deploy on heroku
* Link autbot-backend to git 
  *   `heroku git:remote -a autbot-backend`
* Push subtree to heroku 
  * `git subtree push --prefix server-python heroku main` 
* test `curl https://autbot-backend-f8bf47922e24.herokuapp.com/api/test`
* https://autbot-backend-f8bf47922e24.herokuapp.com/
*  `heroku logs --tail` 