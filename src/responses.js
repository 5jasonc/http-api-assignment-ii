const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const respond = (request, response, statusCode, content, contentType) => {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

const respondMeta = (request, response, statusCode, contentType) => {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  if (request.method === 'GET') return respond(request, response, 200, JSON.stringify(responseJSON), 'application/json');
  return respondMeta(request, response, 200, 'application/json');
};

const addUser = (request, response, params) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  if (!params.name || !params.age) {
    responseJSON.id = 'missingParams';
    return respond(request, response, 400, JSON.stringify(responseJSON), 'application/json');
  }

  let responseCode = 201;

  if (users[params.name]) {
    responseCode = 204;
  } else {
    users[params.name] = {};
  }

  users[params.name].name = params.name;
  users[params.name].age = params.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(request, response, responseCode, JSON.stringify(responseJSON), 'application/json');
  }

  return respondMeta(request, response, responseCode, 'application/json');
};

const getNotReal = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found',
  };

  if (request.method === 'GET') return respond(request, response, 404, JSON.stringify(responseJSON), 'application/json');
  return respondMeta(request, response, 404, 'application/json');
};

const getIndex = (request, response) => {
  respond(request, response, 200, index, 'text/html');
};

const getStyle = (request, response) => {
  respond(request, response, 200, style, 'text/css');
};

module.exports = {
  getIndex,
  getStyle,
  getNotReal,
  getUsers,
  addUser,
};
