const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error to obtain products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

//2) Traer solo un producto por id: 
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.json({
                error: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        console.error("Error to obtain the product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

//3) Agregar nuevo producto: 
router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Product added succesfully"
        });
    } catch (error) {
        console.error("Error to add product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

//4) Actualizar por ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productUpdated = req.body;

    try {
        await productManager.updateProduct(id, productUpdated);
        res.json({
            message: "Product updated succesfully"
        });
    } catch (error) {
        console.error("Error to update product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

//5) Eliminar producto: 
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Product deleted succesfully"
        });
    } catch (error) {
        console.error("Error to delete product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

module.exports = router;
