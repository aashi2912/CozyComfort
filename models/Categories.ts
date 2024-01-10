import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

export default mongoose.models?.Categories || mongoose.model("Categories", categorySchema);