const http = require("http");
const { v4: uuidv4 } = require("uuid");
const responseHandle = require("./responseHandle");
const todos = [];

// 取得
const handleGetTodos = (res) => {
  responseHandle(res, "200", todos);
};

// 新增
const handlePostTodo = (res, body) => {
  try {
    const title = JSON.parse(body).title;
    if (title !== undefined) {
      const todo = {
        title: title,
        id: uuidv4(),
      };
      todos.push(todo);
      responseHandle(res, "200", todos);
    } else {
      responseHandle(res, "400", todos);
    }
  } catch (error) {
    responseHandle(res, "400", todos);
  }
};

// 編輯
const handlePatchTodo = (req, res, body) => {
  try {
    const title = JSON.parse(body).title;
    const id = req.url.split("/").pop();
    const index = todos.findIndex((element) => element.id === id);
    if (title !== undefined && index !== -1) {
      todos[index].title = title;
      responseHandle(res, "200", todos);
    } else {
      responseHandle(res, "400", todos);
    }
  } catch (error) {
    responseHandle(res, "400", todos);
  }
};

// 刪除所有
const handleDeleteAllTodos = (res) => {
  todos.length = 0;
  responseHandle(res, "200", todos);
};

// 刪除單筆
const handleDeleteTodo = (req, res) => {
  const id = req.url.split("/").pop();
  const index = todos.findIndex((element) => element.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    responseHandle(res, "200", todos);
  } else {
    responseHandle(res, "400", todos);
  }
};

const handleOptions = (res) => {
  responseHandle(res, "options");
};

const handleNotFound = (res) => {
  responseHandle(res, "404");
};

const requestListener = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 刪除跟編輯網址判斷（單筆）
  const todoRegex = /^\/todos\/[a-zA-Z0-9_-]+$/;

  switch (req.method) {
    case "GET":
      if (req.url === "/todos") {
        handleGetTodos(res);
      } else {
        handleNotFound(res);
      }
      break;
    case "POST":
      if (req.url === "/todos") {
        req.on("end", () => handlePostTodo(res, body));
      } else {
        handleNotFound(res);
      }
      break;
    case "PATCH":
      if (todoRegex.test(req.url)) {
        req.on("end", () => handlePatchTodo(req, res, body));
      } else {
        handleNotFound(res);
      }
      break;
    case "DELETE":
      if (req.url === "/todos") {
        handleDeleteAllTodos(res);
      } else if (todoRegex.test(req.url)) {
        handleDeleteTodo(req, res);
      } else {
        handleNotFound(res);
      }
      break;
    case "OPTIONS":
      handleOptions(res);
      break;
    default:
      handleNotFound(res);
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
