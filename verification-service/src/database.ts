import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

export class VerificationDatabase {
  private db: sqlite3.Database;
  private runAsync: (sql: string, params?: any[]) => Promise<any>;
  private getAsync: (sql: string, params?: any[]) => Promise<any>;

  constructor(dbPath?: string) {
    const defaultPath = this.getDbPath();
    this.db = new sqlite3.Database(defaultPath);
    
    this.runAsync = promisify(this.db.run.bind(this.db));
    this.getAsync = promisify(this.db.get.bind(this.db));
    
    this.initializeDatabase();

    // Memory optimizations
    this.db.run('PRAGMA cache_size = -2000');  // Limit cache to 2MB
    this.db.run('PRAGMA temp_store = MEMORY');
    this.db.run('PRAGMA mmap_size = 0');  // Disable memory mapping
    this.db.run('PRAGMA journal_mode = WAL');
  }


  private getDbPath(): string {
    // Check if running in Docker (EC2)
    if (process.env.DATABASE_PATH) {
      return process.env.DATABASE_PATH;
    }
    
    // Auto-detect Docker environment
    if (process.env.NODE_ENV === 'production') {
      return '/app/data/verification.db';  // EC2/Docker path
    }
    
    // Local development path
    return path.join(__dirname, '../../data/verification.db');
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
