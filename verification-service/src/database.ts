import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

export class VerificationDatabase {
  private db: sqlite3.Database;
  private runAsync: (sql: string, params?: any[]) => Promise<any>;
  private getAsync: (sql: string, params?: any[]) => Promise<any>;

  constructor(dbPath?: string) {
    const defaultPath = path.join(__dirname, '../../data/verification.db');
    this.db = new sqlite3.Database(dbPath || defaultPath);
    
    this.runAsync = promisify(this.db.run.bind(this.db));
    this.getAsync = promisify(this.db.get.bind(this.db));
    
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS verification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      credential_hash TEXT NOT NULL,
      is_valid BOOLEAN NOT NULL,
      verified_by TEXT NOT NULL,
      verified_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `;
    
    this.db.run(createTableQuery);
  }

  // Log each verification attempt
  async logVerification(hash: string, isValid: boolean, workerID: string): Promise<void> {
    const query = `
      INSERT INTO verification_logs (credential_hash, is_valid, verified_by) 
      VALUES (?, ?, ?)
    `;
    await this.runAsync(query, [hash, isValid, workerID]);
  }

  // Get verification history
  async getVerificationHistory(hash: string): Promise<any[]> {
    const query = 'SELECT * FROM verification_logs WHERE credential_hash = ? ORDER BY verified_at DESC';
    return await this.getAsync(query, [hash]);
  }

  close(): void {
    this.db.close();
  }
}
