import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Please add your Mongo URI to .env")
}

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri)
    globalForMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalForMongo._mongoClientPromise
} else {
  const client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
