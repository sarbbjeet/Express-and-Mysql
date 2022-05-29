const router = require("express").Router();

//middleware
router.use((req, res, next) => {
  console.log(`url = ${req.url}`);
  next();
});
//routers
router.get("/", (req, res) => {
  return res.json({ success: true });
});

module.exports = router;
