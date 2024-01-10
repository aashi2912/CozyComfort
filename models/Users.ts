import { credentials, google } from "@/helpers/constants";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
    },
    image: {
        type: String
    },
    role: {
        type: String,
        default: "Basic"
    },
    provider: {
        type: {
            type: String,
            enum: [credentials, google]
        },
        id: {
            type: String
        }
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.models?.Users || mongoose.model("Users", userSchema);