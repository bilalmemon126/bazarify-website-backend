import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
})

export const Favourite = mongoose.model('Favourite', favouriteSchema)