import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: false,
        trim: true,
        default: null,
        lowercase: true
    },
    alsoForHome: {
        type: Boolean,
        default: false,
    }
})

export const Category = mongoose.model('Category', categorySchema)