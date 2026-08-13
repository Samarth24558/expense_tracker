import {sql} from "../config/db.js"

export async function getTransactions(req,res)   {

     try {

        const {user_id}=req.params;
        
        const user=await sql `SELECT * FROM transactions WHERE user_id=${user_id} ORDER BY created_at DESC`

        if(user=="")
        {
            res.status(400).json({success:false,message:"user not found"});
        }
        res.status(200).json({success:true,user:user});

        
    } catch (error) {
        
        res.status(500).json({success:false,message:error})
        
    }
    
}

export async function createTransactions(req,res) {

    try {
        const {title,amount,category,user_id}=req.body;

        if(!title || !amount || !category || !user_id)
        {
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        const transaction = await sql`INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *`;

        res.status(201).json({success:true,message:"Transaction created",transactions:transaction[0]});
            
        } catch (error) {
    
        res.status(500).json({success:false,message:error})
            
        }  
   
    
}


export async function deleteTransactions(req,res) {
    try {

        const {id}=req.params;
        
        const transaction=await sql `DELETE FROM transactions WHERE id=${id} RETURNING *`

        if(transaction=="")
        {
            res.status(400).json({success:false,message:"transaction not found"});
        }
        res.status(200).json({success:true,transaction:transaction});

        
    } catch (error) {
        
        res.status(500).json({success:false,message:error})
        
    }

}

export async function getSummery(req,res) {
    try {

        const {user_id}=req.params;


        const balanceResult=await sql `SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${user_id}`

        const incomeResult=await sql `SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id=${user_id} AND amount>0`

            const expenseResult=await sql `SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id=${user_id} AND amount<0`

        res.status(200).json({
            success:true,
            balance:balanceResult[0].balance,
            income:incomeResult[0].income,
            expense:expenseResult[0].expense
        })
        
        
        
    } catch (error) {

        res.status(500).json({success:false,message:error})
        
    }

    
}
 