import mongoose from 'mongoose'

declare global {
    var mongoose: any // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGO_URI!

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGO_URI environment variable inside .env...'
    )
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose;
}

async function dbConnect() {
    if (cached) {
        return cached
    }
    try {
        let conn = await mongoose.connect(MONGODB_URI, { bufferCommands: true });
        cached = global.mongoose = conn;
    } catch (e) {
        throw e
    }

    return cached
}

export default dbConnect