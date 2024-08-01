const router = require("express").Router();
const articleController = require("../controllers/articleController");
const { isMentor } = require("../middleware/authguard");

router.post("/createArticle", articleController.createArticle);
router.delete("/deleteArticle/:id", articleController.deleteArticle, isMentor);
router.get("/findAllArticles", articleController.getAllArticle);

module.exports = router;
