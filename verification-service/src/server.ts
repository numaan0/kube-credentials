import express from 'express';
import cors from 'cors';
import { createHmac } from 'crypto';
import axios from 'axios';
import os from 'os';
import { VerificationDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 3002;
const WORKER_ID = process.env.WORKER_ID || `verification-worker-${os.hostname().slice(-6)}`;
const ISSUANCE_SERVICE_URL = process.env.ISSUANCE_SERVICE_URL || 'http://localhost:3001';
const CREDENTIAL_SECRET = process.env.CREDENTIAL_SECRET || "supersecretkey";
const db = new VerificationDatabase();
app.use(express.json());
app.use(cors());

// Health check
app.get('/health_verify', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'verification', 
    worker: WORKER_ID 
  });
});

// Verify credential endpoint
app.post('/verify', async (req, res) => {
  // Validation
  if (!req.body.credential || typeof req.body.credential !== 'string') {
    return res.status(400).json({ message: "invalid credential format" });
  }

  try {
    const credentialString = req.body.credential;
    
    // Create same hash as issuance service
    const credentialHash = createHmac('sha256', CREDENTIAL_SECRET)
    .update(credentialString)
    .digest('hex');
    // Call issuance service to check if credential exists
    const checkResponse = await axios.post(`${ISSUANCE_SERVICE_URL}/check`, {
      credential_hash: credentialHash
    });

    console.log(checkResponse.data);
    
    const { exists, worker_id, issued_at } = checkResponse.data;
    await db.logVerification(credentialHash, exists, WORKER_ID);
    if (exists) {
      res.json({
        isValid: true,
        message: `credential verified by ${WORKER_ID}`,
        issuedBy: worker_id,
        issuedAt: issued_at
      });
    } else {
      res.json({
        isValid: false,
        message: `credential not found - verified by ${WORKER_ID}`
      });
    }
    
  } catch (error) {
    console.error('Error verifying credential:', error);
    res.status(500).json({
      isValid: false, 
      message: `verification error by ${WORKER_ID}`
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Verification Service running on port ${PORT}`);
  console.log(`👷 Worker ID: ${WORKER_ID}`);
  console.log(`🔗 Issuance Service URL: ${ISSUANCE_SERVICE_URL}`);
});

// // Graceful shutdown
// process.on('SIGINT', () => {
//   console.log('\n⏹️  Shutting down Verification Service...');
//   process.exit(0);
// });


// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, closing database...');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, closing database...');
  db.close();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  db.close();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  db.close();
  process.exit(1);
});
