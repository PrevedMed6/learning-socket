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
    function connection(websocketConnection) {
      clients.add(websocketConnection);
      websocketConnection.on("message", function(message) {
        let reply = JSON.parse(message);
        if (reply.type === 'start')
        {
          reply.message = `${reply.user} присоединился к чату!`;
        }
        else if (reply.type === 'stop')
        {
          reply.message = `${reply.user} вышел из чата!`;
        }
        else
        {
          reply.message = `${reply.user}: ${reply.message}`;
        }
        for(let client of clients) {
          client.send(JSON.stringify(reply));
        }
      });
      websocketConnection.on('close', function() {
        clients.delete(websocketConnection);
      });
    });

  return websocketServer;
};
