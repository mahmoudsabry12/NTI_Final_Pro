const Product = require('../../Model/Product');

class ProductRepository {

    async createProct(productData){
        const product = new Product(productData)
        return await product.save()
    }


    async findProductbyId(id){
        return await Product.findById(id)
    }
    async findAllProduct(skip, limit){
        return await Product.find().skip(skip).limit(limit)
    }
     
    async findAllProductbyCategory(category){
        return await Product.find({category})
    }

    async countAll() {
        return await Product.countDocuments();
    }

    async updateProduct(id,updateData){
        return await Product.findByIdAndUpdate(id, updateData,{new: true})
    }


    async deleteProductbyId(id){
        return await Product.findByIdAndDelete(id)
    }
}

module.exports = new ProductRepository();
