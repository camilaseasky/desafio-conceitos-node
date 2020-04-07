const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeRepositoryId(request, response, next){
    const { id } = request.params;

    if(!isUuid(id)){
      return response.status(400).json({ error: 'Repository ID is not valid!'});
    }

    return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {id: uuid(), url , title, techs , likes: 0 };

  repositories.push(repository);
  
  return response.json(repository);

});

app.put("/repositories/:id",validadeRepositoryId, (request, response) => {
    const { url, title, techs } = request.body;
    const { id } = request.params;

    repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if(repositoryIndex < 0){
      return response.status(400).json({error: 'Repository ID não encontrado!'});
    }

    repository = repositories[repositoryIndex];
    repository.url = url;
    repository.title = title;
    repository.techs = techs;
    
    repositories[repositoryIndex] = repository;

    return response.json(repository);

});

app.delete("/repositories/:id", validadeRepositoryId, (request, response) => {
    const { id } = request.params;

    repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if(repositoryIndex < 0){
      return response.status(400).json({error: 'Repository ID não encontrado!'});
    }

    repositories.splice(repositoryIndex,1);
    return response.status(204).send()
});

app.post("/repositories/:id/like", validadeRepositoryId, (request, response) => {
    const { id } = request.params;

    repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if(repositoryIndex < 0){
      return response.status(400).json({error: 'Repository ID não encontrado!'});
    }

    repository = repositories[repositoryIndex];
    repository.likes = repository.likes+1;

    repositories[repositoryIndex] = repository;

    return response.json(repository);

});

module.exports = app;
