const router = require("express").Router();
const articleController = require("../controllers/articleController");
const { mentorAuthGuard } = require("../middleware/authguard");

router.post("/createArticle", articleController.createArticle);
router.delete(
  "/deleteArticle/:id",
  articleController.deleteArticle,
  mentorAuthGuard
);
router.get("/findAllArticles", articleController.getAllArticle);

module.exports = router;
