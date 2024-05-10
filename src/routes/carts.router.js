const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager();

//1) Creamos un nuevo carrito: 
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error to create new Cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//2) Listamos los productos que pertenecen a determinado carrito. 
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error to obtain Cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//3) Agregar productos a distintos carritos.
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("/Error to add product to Cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//4)  Eliminamos un producto especifico del carrito: 
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        //Verificamos: 
        console.log(cartId);
        console.log(productId);

        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);
        
        res.json({
            status: 'success',
            message: 'Product deleted correctely',
            updatedCart,
        });
    } catch (error) {
        console.error("Error while deleting a product from Cart", error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});

//5) Actualizar producto del carrito.
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    // Debes enviar un arreglo de productos en el cuerpo de la solicitud

    try {
        const updatedCart = await cartManager.cartUpdate(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error to update Cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error',
        });
    }
});

//6) Actualizamos las cantidades de productos
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateQuantityOfProduct(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Quantity of product was updated succesfully',
            updatedCart,
        });
    } catch (error) {
        console.error('Error while updating quantity of product', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error',
        });
    }
});

//7) Vaciamos el carrito: 
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        // Llamamos a la función para eliminar todos los productos del carrito
        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'Cart products was deleted succesfully',
            updatedCart,
        });
    } catch (error) {
        console.error('Error while deleting products from Cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error',
        });
    }
});

module.exports = router;