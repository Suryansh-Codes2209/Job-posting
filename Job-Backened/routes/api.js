const express = require("express");
const { register, login } = require("../controllers/authController");
const { postJob } = require("../controllers/jobController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/post-job", auth, postJob);

module.exports = router;
