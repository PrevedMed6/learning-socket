const express = require("express");
const mongoose = require("mongoose");
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const websockets = require("./websokets/webSocket");
const app = express();
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs.engine(
  {
      layoutsDir: "views/layouts",
      defaultLayout: "layout",
      extname: "hbs",
  }
))

//маршрутизация
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use(express.static(__dirname + '/public'));
app.use("/", function(_, response){
  response.render("home.hbs");
});

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

mongoose.connect("mongodb://localhost:27017/chatdb", { useUnifiedTopology: true }, function(err){
    if(err) return console.log(err);
    const server = app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
    websockets.websockets(server);
});
