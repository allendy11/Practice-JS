const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const dotenv = require("dotenv");
const path = require("path");
const { db, mysqlOption } = require("./config/database");
const koaSession = require("koa-session");
const mysql = require("mysql-magic");
const koaSessionMysql = require("koa-session-mysql");
const http = require("http");
const https = require("https");
const fs = require("fs");

const userRouter = require("./routes/user.routes");

const PORT = 8000;

// mysql.initPool("koa-session", {
//   host: "localhost",
//   user: "root",
//   password: "1231",
//   database: "testdb",
// });

// koaSessionMysql.init("koa-session", "session");

const app = new Koa();
app.keys = ["1234567890"];

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

// session
// app.use(
//   koaSession(
//     {
//       key: "koa.sess",
//       store: koaSessionMysql,
//       maxAge: 1000 * 60 * 30,
//       secure: true,
//       overwrite: true /** (boolean) can overwrite or not (default true) */,
//       httpOnly: false /** (boolean) httpOnly or not (default true) */,
//       signed: true /** (boolean) signed or not (default true) */,
//       rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
//       renew: true /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
//       sameSite: "none",
//     },
//     app
//   )
// );

// log
app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url} ${new Date().toLocaleString()}`);
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.session.views) {
    console.log("exist");
    ctx.session.views += 1;
  } else {
    console.log("not exist");

    ctx.session.views = 1;
  }
  // console.log("koa-session", Object.entries(ctx.session));
  ctx.body = ctx.session.views;

  await next();
});

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

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
