import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {sql} from "./config/db.js"
import rateLimiter from "./middleware/rateLimit.js";
import transactionsRoutes from "./routes/transactionsRoutes.js"
import job from "./config/cron.js"

dotenv.config()

const PORT = process.env.PORT || 5000;

const app=express();
app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8081",
  credentials: true
}))
app.use(rateLimiter)


if(process.env.NODE_ENV === "production"){
  job.start()
  console.log("CRON JOB STARTED")
}


async function initDB() {

    try {
        await sql `CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE)`
        
        console.log("Databse initialized");
    } catch (error) {
        console.log("Error",error)
        process.exit(1)

    }
    
}

app.get("/health",(req,res)=>{
    res.send("Server is running")
})


app.use("/api/transactions",transactionsRoutes)

initDB().then(()=>{ 
    app.listen(PORT,()=>{
        console.log("Server is running at PORT", PORT);
    })
}).catch(error => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
})
