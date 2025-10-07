import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

export class IssuanceDatabase {
  private db: sqlite3.Database;
  private runAsync: (sql: string, params?: any[]) => Promise<any>;
  private getAsync: (sql: string, params?: any[]) => Promise<any>;

  constructor(dbPath?: string) {
    // const defaultPath = path.join(__dirname, '../../data/issuance.db');
    const defaultPath = this.getDbPath();
    const finalPath = defaultPath;
    
    console.log(`📁 Database path: ${finalPath}`);
    
    this.db = new sqlite3.Database(finalPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
      }
    });
    
    this.runAsync = promisify(this.db.run.bind(this.db));
    this.getAsync = promisify(this.db.get.bind(this.db));
    
    this.initializeDatabase();
  }

  private getDbPath(): string {
    // Check if running in Docker (EC2)
    if (process.env.DATABASE_PATH) {
      return process.env.DATABASE_PATH;
    }
    
    // Auto-detect Docker environment
    if (process.env.NODE_ENV === 'production') {
      return '/app/data/issuance.db';  // EC2/Docker path
    }
    
    // Local development path
    return path.join(__dirname, '../../data/issuance.db');
  }

  private initializeDatabase(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        credential_hash TEXT UNIQUE NOT NULL,
        worker_id TEXT NOT NULL,
        issued_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('❌ Error creating credentials table:', err.message);
      } else {
        console.log('✅ Credentials table ready');
      }
    });
  }

  async insertCredential(hash: string, workerId: string): Promise<void> {
    const query = 'INSERT INTO credentials (credential_hash, worker_id) VALUES (?, ?)';
    await this.runAsync(query, [hash, workerId]);
  }

  async findCredential(hash: string): Promise<any> {
    const query = 'SELECT * FROM credentials WHERE credential_hash = ?';
    return await this.getAsync(query, [hash]);
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed');
      }
    });
  }
}
