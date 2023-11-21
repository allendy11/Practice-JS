const { db } = require("../config/database");
const koaSession = require("koa-session");
const koaSessionMysql = require("koa-session-mysql");

exports.login = async (ctx, next) => {
  console.log("ctx.request.body : ", ctx.request.body);
  const { username, password, client_type } = ctx.request.body;
  const conn = await db.promise().getConnection(async (conn) => conn);
  const selectUserQuery = `SELECT * FROM user WHERE username = ? AND password = ?`;
  const [selectUserRows] = await conn.query(selectUserQuery, [
    username,
    password,
  ]);
  if (selectUserRows.length === 0) {
    ctx.throw(404, "Not Found");
  }
  console.log("selectUserRwos: ", selectUserRows[0]);
  ctx.session.user = { username, password };
  ctx.session.authorized = true;
  // console.log("koa-login", Object.entries(ctx.session));

  ctx.status = 200;
  ctx.body = {
    username,
    password,
    client_type,
  };
};
exports.logout = async (ctx, next) => {
  console.log("koa-logout", Object.entries(ctx.session));

  if (ctx.session.authorized) {
    const sessionId = ctx.cookies.get("koa.sess");
    ctx.session = null;
    const conn = await db.promise().getConnection(async (conn) => conn);
    const deleteSessionQuery = `DELETE FROM session WHERE session_id = ?`;
    const [deleteSessionRows] = await conn.query(deleteSessionQuery, [
      sessionId,
    ]);

    ctx.status = 200;
    ctx.body = { message: "logout success" };
  } else {
    ctx.status = 401;
    console.log("koa-logout", Object.entries(ctx.session));

    ctx.body = { message: "unauthorized" };
  }
};

exports.validate = async (ctx, next) => {
  let sessionId = ctx.cookies.get("koa.sess");
  console.log("koa-validate", Object.entries(ctx.session));
  if (ctx.session.authorized) {
    ctx.status = 200;
    ctx.body = { message: "validate" };
  } else {
    ctx.status = 401;
    ctx.body = { message: "unauthorized" };
  }
};
