const responseHandle = (res, status, todos) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*", // 允許伺服器、IP 訪問
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json", // JSON 格式
  };

  switch (status) {
    case "200":
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      res.end();
      break;
    case "400":
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: "fails",
          message: "欄位未填寫正確，或無此 todo id",
        })
      );
      res.end();
      break;
    case "options":
      res.writeHead(200, headers);
      res.end();
      break;
    case "404":
      res.writeHead(404, headers);
      res.write(
        JSON.stringify({
          status: "false",
          message: "無此網站路由",
        })
      );
      res.end();
      break;
    default:
  }
};

module.exports = responseHandle;
