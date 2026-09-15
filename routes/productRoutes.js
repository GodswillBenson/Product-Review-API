const express = require("express");
const {
    getProducts,
    aliasTopProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStats
} = require("../controllers/productController");

const router = express.Router();

router.route("/product-stats").get(getProductStats);
router.route("/top-5").get(aliasTopProducts, getProducts);
router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
