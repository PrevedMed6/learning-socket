const ws = new require('ws');
const queryString = new require('query-string');
const clients = new Set();

module.exports.websockets = (expressServer) => {
  const websocketServer = new ws.Server({
    noServer: true,
    path: "/ws",
  });
  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      clients.add(websocketConnection);
      websocketConnection.on("message", function(message) {
        let reply = JSON.parse(message);
        console.log(reply.type);
        if (reply.type === 'start')
        {
          reply.message = `${reply.message} присоединился к чату!`;
        }
       // message = message.slice(0, 500);
        for(let client of clients) {
          console.log(reply.message);
          client.send(reply.message);
        }
      });
      websocketConnection.on('close', function() {
        console.log(`подключение закрыто`);
        clients.delete(websocketConnection);
      });
    });

  return websocketServer;
};
