const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager")
const CartManager = require("../controllers/cart-manager")
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        });

        res.render("products", {
            products: newArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages
        });

    } catch (error) {
        console.error("Error to obtain product", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server Error"
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            console.log("Cart with that ID doesn't exist");
            return res.status(404).json({ error: "Cart not found" });
        }

        const productsInCart = cart.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
            quantity: item.quantity
        }));

        res.render("carts", { products: productsInCart });
    } catch (error) {
        console.error("Error to obtain Cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Chat
router.get("/", async (req, res) => {
    res.render("chat");
})

//Session Log In
router.get("/register", (req, res) => {
    if(req.session.login) {
        return res.redirect("/profile");
    }
    res.render("register");
})

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/profile", (req, res) => {
    if(!req.session.login){
        return res.redirect("/login");
    }
    res.render("profile", {user: req.session.user})
})

module.exports = router;
