import experss from "express";
import { createTransactions, deleteTransactions, getSummery, getTransactions } from "../controllers/transactionsController.js";

const router=experss.Router();

router.post("/create",createTransactions)

router.get("/users/:user_id",getTransactions)

router.delete("/delete/:id",deleteTransactions)

router.get("/summery/:user_id",getSummery)

export default router;