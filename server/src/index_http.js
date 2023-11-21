const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");

const userRouter = require("./routes/user.routes");

const PORT = 8000;

const app = new Koa();

// bodyparser
app.use(bodyParser());

// cors
app.use(
  cors({
    origin: "*",
    method: ["OPTION", "POST", "GET"],
    credentials: true,
  })
);

// log
app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url} ${new Date().toLocaleString()}`);
  await next();
});

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

router.use("/user", userRouter.routes());

app.listen(PORT, () => {
  console.log(`listening on port PORT ${PORT}`);
});
