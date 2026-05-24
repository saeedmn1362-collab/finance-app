import dotenv from "dotenv";
dotenv.config();

console.log("PORT:", process.env.PORT);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("JWT_SECRET:", !!process.env.JWT_SECRET);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
