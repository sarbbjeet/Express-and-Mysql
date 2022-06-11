const { authCheck } = require("../middleware/middleware.index");
const navTags = require("../views/partials/header/navTags");

const router = require("express").Router();

router.get("/", authCheck, async (req, res) => {
  const user = req.user;
  if (user) delete user.password;
  res.render("templates/home", {
    cssFile: "css/home.css",
    navTags: navTags(),
    user,
  });
});
module.exports = router;
