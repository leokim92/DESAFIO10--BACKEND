const ProductModel = require("../models/product.model.js")

class ProductManager {

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
      try {

          if (!title || !description || !price || !code || !stock || !category) {
              console.log("All field are mandatory");
              return;
          }

          //Acá tenemos que cambiar la validacion: 
          const productExist = await ProductModel.findOne({ code: code });

          if (productExist) {
              console.log("Code must be unique");
              return;
          }

          const newProduct = new ProductModel({
              title,
              description,
              price,
              img,
              code,
              stock,
              category,
              status: true,
              thumbnails: thumbnails || []
          });

          await newProduct.save();

      } catch (error) {
          console.log("Error to obtain product", error);
          throw error;
      }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
      try {
          const skip = (page - 1) * limit;

          let queryOptions = {};

          if (query) {
              queryOptions = { category: query };
          }

          const sortOptions = {};
          if (sort) {
              if (sort === 'asc' || sort === 'desc') {
                  sortOptions.price = sort === 'asc' ? 1 : -1;
              }
          }

          const products = await ProductModel
              .find(queryOptions)
              .sort(sortOptions)
              .skip(skip)
              .limit(limit);

          const totalProducts = await ProductModel.countDocuments(queryOptions);

          const totalPages = Math.ceil(totalProducts / limit);
          const hasPrevPage = page > 1;
          const hasNextPage = page < totalPages;

          return {
              docs: products,
              totalPages,
              prevPage: hasPrevPage ? page - 1 : null,
              nextPage: hasNextPage ? page + 1 : null,
              page,
              hasPrevPage,
              hasNextPage,
              prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
              nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
          };
      } catch (error) {
          console.log("Error to obtain product", error);
          throw error;
      }
  }

  async getProductById(id) {
      try {
          const product = await ProductModel.findById(id);

          if (!product) {
              console.log("Product not found");
              return null;
          }

          console.log("Product found");
          return product;
      } catch (error) {
          console.log("Error to bring product by ID");
      }
  }

  async updateProduct(id, productUpdated) {
      try {

          const updated = await ProductModel.findByIdAndUpdate(id, productUpdated);

          if (!updated) {
              console.log("Product not found");
              return null;
          }

          console.log("Product updated succesfully");
          return updated;
      } catch (error) {
          console.log("Error to update product", error);

      }
  }

  async deleteProduct(id) {
      try {

          const deleted = await ProductModel.findByIdAndDelete(id);

          if (!deleted) {
              console.log("Product not found");
              return null;
          }

          console.log("Product deleted correctly");
      } catch (error) {
          console.log("Error to delete product", error);
          throw error;
      }
  }
}

module.exports = ProductManager; 