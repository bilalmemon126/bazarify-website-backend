import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    mainImage: {
        type: Object,
        required: false,
        trim: true,
        default: null
    },
    images: {
        type: Array,
        required: false,
        trim: true,
        default: null
    },
    title: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    description: {
        type: String,
        required: false,
        default: null,
        trim: true,
    },
    price: {
        type: Number,
        required: false,
        trim: true,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    make: {
        type: String,
        required: false,
        trim: true,
    },
    bedrooms: {
        type: Number,
        required: false,
        trim: true,
    },
    bathrooms: {
        type: Number,
        required: false,
        trim: true,
    },
    areaUnit: {
        type: String,
        enum: ["kanal", "marla", "sqaure feet", "square meter", "square yards"],
        trim: true,
    },
    area: {
        type: Number,
        required: false,
        trim: true,
    },
    brand: {
        type: String,
        required: false,
        trim: true,
    },
    fabric: {
        type: String,
        required: false,
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        trim: true,
    },
    condition: {
        type: String,
        enum: ["new", "used"],
        default: "used"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    }
},
{
    timestamps: true
})


productSchema.index(
    {isBlocked: 1, title: "text", description: "text"},
    {weights: {title: 5, description: 1}}
)

productSchema.index(
    {category: 1, price: 1},
    {partialFilterExpression: {isBlocked: false}}
)

productSchema.index(
    {category: 1, price: -1},
    {partialFilterExpression: {isBlocked: false}}
)

productSchema.index(
    {category: 1, location: 1},
    {partialFilterExpression: {isBlocked: false}}
)

productSchema.index(
    {createdBy: 1, createdAt: 1}
)

export const Product = mongoose.model('Product', productSchema)