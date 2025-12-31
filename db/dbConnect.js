// lib/db.js (or actions/db.js)
// This file contains a Server Action for connecting to MongoDB.

'use server'; // This directive marks the file as a Server Action

import mongoose from 'mongoose';

// This utility function manages the MongoDB connection.
// It's designed to be used across your server-side code (Server Components, API Routes, other Server Actions).
const dbName = 'FOETVerse';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${dbName}`;

// Check if MONGODB_URI is set, otherwise use a default and warn.
if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not defined in environment variables. Using default localhost URI.');
}

// Global variable to cache the connection.
// This helps prevent multiple connections during development (hot reloads)
// and ensures efficient connection reuse in production serverless environments.
let cached = global.mongoose;

// Initialize cache if it doesn't exist.
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  // If a connection already exists and is ready, return it immediately.
  if (cached.conn) {
    console.log('Using cached MongoDB connection.');
    return cached.conn;
  }

  // If there's no ongoing connection promise, start a new connection attempt.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering of commands
      // (e.g., if you try to use a model before connection is established)
      // Other options like useNewUrlParser and useUnifiedTopology are
      // no longer needed in Mongoose 6+ and are removed for simplicity.
    };

    console.log('Establishing new MongoDB connection...');
    // Store the promise of the connection.
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB connection established.');
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise. Once resolved, the connection is established
    // and cached for future use.
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    // If connection fails, reset the promise so a new attempt can be made later
    cached.promise = null;
    console.error('MongoDB connection error in dbConnect Server Action:', err);
    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }
}