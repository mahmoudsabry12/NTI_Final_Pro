const Product = require('../../Model/Product');

class ProductRepository {

    async create(productData){
        const product = new Product(productData)
        return await product.save()
    }


    async findById(id){
        return await Product.findById(id)
    }
    async findAll(skip, limit){
        return await Product.find().skip(skip).limit(limit)
    }
     
    async findByCategory(category){
        return await Product.find({category})
    }

    async countAll() {
        return await Product.countDocuments();
    }

    async updateById(id,updateData){
        return await Product.findByIdAndUpdate(id, updateData,{new: true})
    }


    async deleteById(id){
        return await Product.findByIdAndDelete(id)
    }
}

module.exports = new ProductRepository();
