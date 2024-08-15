const router = require("express").Router();
const articleController = require("../controllers/articleController");
const { isMentor } = require("../middleware/authguard");

router.post("/createArticle", isMentor, articleController.createArticle);
router.delete("/deleteArticle/:id", isMentor, articleController.deleteArticle);
router.get("/findAllArticles", articleController.getAllArticle);

module.exports = router;
