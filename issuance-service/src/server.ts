// const express = require('express');
import cors from 'cors';
import express from 'express';
import { IssuanceDatabase } from './database';
import { createHmac } from 'crypto';
import os from 'os';
const app = express();
const PORT = process.env.PORT || 3001;
const WORKER_ID = process.env.WORKER_ID || `worker-${os.hostname().slice(-6)}`;
const db = new IssuanceDatabase();
const CREDENTIAL_SECRET = process.env.CREDENTIAL ||"supersecretkey";
app.use(express.json());
app.use(cors())
// Basic test endpoint

async function checkCredentialExists(credentialHash: string) {
    const existingCredential = await db.findCredential(credentialHash);
    return existingCredential; 
}

app.get('/health_issue', (req, res) => {
    res.json({ message: 'Issuance Service is running!' });
});



app.post("/issue",async (req,res)=>{
    try{

        if (!req.body.credential || typeof req.body.credential !== 'string') {
                return res.status(400).json({ message: "invalid credential format" });
        }
        const credentialData = req.body.credential;
        const createHash =  createHmac('sha256' ,CREDENTIAL_SECRET).update(credentialData).digest('hex');
        const existingCredential = await checkCredentialExists(createHash);
        if (existingCredential) {
            return res.status(400).json({ message: 'credential already issued' });
        }


        await db.insertCredential(createHash,WORKER_ID);

        res.status(200).json({
            "message": `Credential issued successfully with worker ${WORKER_ID}`
        })

    }catch(e){
        console.error("Error issuing credential:", e);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


app.post("/check", async(req,res)=>{
    try{

        if (!req.body.credential_hash || typeof req.body.credential_hash !== 'string') {
                return res.status(400).json({ message: "invalid credential format" });
        }
        const credentialData = req.body.credential_hash;
        console.log("Checking credential:", credentialData)
        const existingCredential = await checkCredentialExists(credentialData);
        console.log("Existing credential:", existingCredential)
        if (existingCredential) {
            return res.json({
                exists: true,
                worker_id: existingCredential.worker_id,
                issued_at: existingCredential.issued_at
            });
        } else {
            return res.json({ exists: false });
        }

    }catch(e){
        console.error("Error issuing credential:", e);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});





app.listen(PORT, () => {
    console.log(`🚀 Issuance Service running on port ${PORT}`);
});



