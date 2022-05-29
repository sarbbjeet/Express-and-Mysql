const router = require("express").Router();
const db = require("../../database/db"); //create db connection
//middleware
router.use((req, res, next) => {
  console.log(`url = ${req.url}`);
  next();
});
//routers
router.get("/", (req, res) => {
  db.execute(`Select * from users where id =${2}`, (err, result) => {
    if (err) return res.json({ success: false, message: err.message });
    return res.json({ success: true, data: result });
  });
});
module.exports = router;
