const mongoose=require('mongoose')
const mongoosePaginate=require('mongoose-paginate-v2')


const productSchema= new mongoose.Schema({
    name:{type:String,required:true,max:20},
    category:{type:String,required:true,max:100},
    price:{type:Number,required:true},
    stock:{type:Number,required:true,max:200},
    image:{type:String,required:true,max:200}
})

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model('products', productSchema);

module.exports = Product;