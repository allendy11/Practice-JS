const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const static = require("koa-static");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");

const userRouter = require("./routes/user.routes");

const PORT = 8080;
const buildPath = path.resolve(__dirname, "../../client/build");

const app = new Koa();

// cors
app.use(
  cors({
    origin: "*",
    method: ["OPTION", "POST", "GET"],
    credentials: true,
  })
);

// bodyparser
app.use(bodyParser());

// static
app.use(static(buildPath));

// log
app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url} ${new Date().toLocaleString()}`);
  await next();
});

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

router.get("/", async (ctx, next) => {
  await send(ctx, "index.html", { root: buildPath });
  await next();
});

router.use("/user", userRouter.routes());

var options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

https.createServer(options, app.callback()).listen(PORT, () => {
  console.log(`listen on ${PORT}`);
});
// app.listen(PORT, () => {
//   console.log(`listening on port PORT ${PORT}`);
// });
