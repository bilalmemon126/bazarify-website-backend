import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    location: {
        type: String,
        required: false,
        trim: true,
        default: null,
        lowercase: true
    }
})

export const Location = mongoose.model('Location', locationSchema)