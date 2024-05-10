const CartModel = require("../models/cart.model.js");

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] })
            await newCart.save();
            return newCart
        } catch (error) {
            console.log("Error to create Cart", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error(`Doesn't exist Cart with this ID: ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error("Error to obtain cart by ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(item => item.product.toString() === productId);

            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            //Cuando se modifica, tiene que marcarlo como "markModified"
            cart.markModified("products")

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error to add product", error);
            throw error;
        }
    }

    //Eliminar producto del Cart
    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error while deleting product from Cart ', error);
            throw error;
        }
    }

    async cartUpdate(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.products = updatedProducts;

            // Vamos a marcar la propiedad "products" como modificada antes de guardar
            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error to update cart from Admin', error);
            throw error;
        }
    }

    async updateQuantityOfProduct(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() !== productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                // Marcar la propiedad "products" como modificada antes de guardar
                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Product not found in Cart');
            }
        } catch (error) {
            console.error('Error to update quantity of product in Cart', error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Cart not found');
            }

            return cart;
        } catch (error) {
            console.error('Error to empty cart in Admin', error);
            throw error;
        }
    }
}

module.exports = CartManager;