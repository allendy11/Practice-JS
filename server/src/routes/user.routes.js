const Router = require("koa-router");
const userCtrl = require("../controllers/user.ctrl");

const router = new Router();

router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);
router.get("/validate", userCtrl.validate);

module.exports = router;
