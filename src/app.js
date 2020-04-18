const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  if (! title || ! url || ! techs ) { 
    response.status(400).json({
      "error": "required params: 'title', 'url', 'techs'",
      ...request.body
    })
  }

  const repo = {
    id : uuid(),
    title,
    url,
    techs,
    likes : 0
  }

  repositories.push(repo);

  response.status(201).json(repo);
  // TODO
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = {
    id : uuid(),
    title,
    url,
    techs,
    likes : 0
  }

  if (! title || ! url || ! techs ) { 
    response.status(400).json({
      "error": "required params: 'title', 'url', 'techs'",
      ...repo
    })
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < -1) {
    response.status(400).json({ error: 'repository not found!'});
  }

  const repository = { 
    id,
    title, 
    url, 
    techs
  }

  repositories[repositoryIndex] = repository;

  response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    response.status(400).json({error: "repository not found!"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params; 

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    response.status(400).json({"error": "repository not found!"});
  } 

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);

});

module.exports = app;
