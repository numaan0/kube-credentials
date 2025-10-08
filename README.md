
```flowchart
# 🔐 Kube Credentials - Backend Services

## 🏗️ Architecture

```

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐┌─────────────────┐
│               Frontend               │ │ Issuance                            │  │               Verification           │ |                                             |
│               (Vercel)                 │-│ Service                               │-│              Service                   |-|       SQLite Database          |
│                                            │ │ Ports:3001,3005                 │ │           Port: 3007                 │ |        /app/data/                     |
└─────────────────┘ └─────────────────┘ └─────────────────┘  └─────────────────┘

```

### 🎯 Services Overview

- **🏭 Issuance Service**: Issues secure credentials with HMAC-SHA256 encryption
- **✅ Verification Service**: Verifies credential authenticity with audit logging
- **🐳 Docker Compose**: Orchestrates scalable microservices deployment
- **📊 Health Monitoring**: Built-in health checks and worker identification

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Docker** and **Docker Compose**
- **Git**

### 1️⃣ Clone and Setup
```

git clone https://github.com/numaan0/kube-credentials.git
cd kube-credentials

# Generate secure secret key

openssl rand -hex 32

# Create environment file

cp .env.example .env
nano .env  \# Add your generated secret to CREDENTIAL_SECRET

```

### 2️⃣ Local Development
```

# Start issuance service

cd issuance-service
npm install
npm run dev  \# Runs on port 3001

# Start verification service (new terminal)

cd verification-service
npm install
npm run dev  \# Runs on port 3002

```

### 3️⃣ Production Deployment
```

# Deploy with Docker Compose

docker-compose up -d --build --scale issuance-service=3 --scale verification-service=2

# Check status

docker-compose ps

# View logs

docker-compose logs -f

```

## 🌐 API Documentation

### 🏭 Issuance Service

#### Health Check
```

GET /health

```
**Response:**
```

{
"status": "healthy",
"service": "issuance",
"worker": "worker-abc123",
"timestamp": "2025-10-08T23:30:00.000Z"
}

```

#### Issue Credential
```

POST /issue
Content-Type: application/json

{
"credential": "MySecurePassword123!"
}

```
**Response:**
```

{
"message": "credential issued by worker-abc123",
"credential_hash": "a1b2c3d4e5f6...",
"issued_at": "2025-10-08T23:30:00.000Z"
}

```

#### Check Credential
```

POST /check
Content-Type: application/json

{
"credential_hash": "a1b2c3d4e5f6..."
}

```

### ✅ Verification Service

#### Verify Credential
```

POST /verify
Content-Type: application/json

{
"credential": "MySecurePassword123!"
}

```
**Response:**
```

{
"isValid": true,
"message": "credential verified by verification-worker-xyz789",
"issuedBy": "worker-abc123",
"issuedAt": "2025-10-08T23:30:00.000Z"
}

```

## 🧪 Testing

### Run Tests
```

# Test all services

npm run test:all

# Test individual services

cd issuance-service \&\& npm test
cd verification-service \&\& npm test

# Coverage reports

npm run test:coverage

```

### Manual API Testing
```

# Health checks

curl http://localhost:3001/health
curl http://localhost:3002/health

# Issue credential

curl -X POST http://localhost:3001/issue
-H "Content-Type: application/json"
-d '{"credential": "TestCredential123!"}'

# Verify credential

curl -X POST http://localhost:3002/verify
-H "Content-Type: application/json"
-d '{"credential": "TestCredential123!"}'

```

## ☁️ AWS Deployment

### EC2 Setup
```

# SSH into EC2 instance

ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies

sudo apt update \&\& sudo apt install -y docker.io docker-compose git
sudo usermod -aG docker ubuntu
newgrp docker

# Clone and deploy

git clone https://github.com/numaan0/kube-credential.git
cd kube-credential
cp .env.example .env

# Edit .env with production values

docker-compose up -d --build --scale issuance-service=3

```

### Security Groups
Ensure these ports are open in AWS Security Groups:
- **3001-3005**: Issuance service instances
- **3006-3010**: Verification service instances  
- **22**: SSH access
- **80/443**: HTTP/HTTPS (optional)

## 📈 Scaling

### Horizontal Scaling
```

# Scale issuance service to 5 instances

docker-compose up -d --scale issuance-service=5

# Scale verification service to 3 instances

docker-compose up -d --scale verification-service=3

# Monitor scaled instances

docker-compose ps

```

### Resource Monitoring
```

# View resource usage

docker stats

# Check logs from specific service

docker-compose logs -f issuance-service

# Health check all instances

curl http://localhost:3001/health  \# Instance 1
curl http://localhost:3002/health  \# Instance 2

```

## 💻 Technology Stack

### Backend
- **Runtime**: Node.js 18+ with Express.js
- **Language**: TypeScript for type safety
- **Database**: SQLite with promisified queries
- **Security**: HMAC-SHA256 credential encryption
- **Testing**: Jest with Supertest for API testing

### DevOps
- **Containerization**: Docker multi-stage builds
- **Orchestration**: Docker Compose with scaling
- **Health Checks**: Built-in container health monitoring


```

kube-credential/
├── 📁 issuance-service/          \# Credential issuance microservice
│   ├── 📁 src/
│   │   ├── server.ts            \# Express server setup
│   │   ├── database.ts          \# SQLite database operations
│   │   └── types.ts             \# TypeScript type definitions
│   ├── 📁 tests/
│   │   └── issuance.test.ts     \# Unit and integration tests
│   ├── package.json             \# Service dependencies
│   ├── tsconfig.json            \# TypeScript configuration
│   └── Dockerfile               \# Container build instructions
├── 📁 verification-service/      \# Credential verification microservice
│   ├── 📁 src/
│   │   ├── server.ts            \# Express server with verification logic
│   │   ├── database.ts          \# Audit logging database operations
│   │   └── types.ts             \# TypeScript type definitions
│   ├── 📁 tests/
│   │   └── verification.test.ts \# Unit and integration tests
│   ├── package.json             \# Service dependencies
│   ├── tsconfig.json            \# TypeScript configuration
│   └── Dockerfile               \# Container build instructions
├── 📄 docker-compose.yml        \# Multi-service orchestration
├── 📄 .env.example              \# Environment variables template
└── 📄 README.md                 \# This documentation

```

## ✨ Key Features

### 🔒 Security Features
- **HMAC-SHA256 Encryption** - Industry-standard credential hashing
- **Environment Variable Security** - Secrets management
- **Audit Trail** - Complete verification history logging
- **Worker Identification** - Track which instance processed requests

### 🏗️ Architecture Features
- **Microservices Design** - Independent, scalable services
- **Horizontal Scaling** - Multiple worker instances
- **Health Monitoring** - Built-in health checks and status reporting
- **Service Communication** - RESTful APIs with proper error handling
- **Database Isolation** - Each service owns its data

### 🚀 DevOps Features
- **Docker Containerization** - Consistent deployment across environments
- **Auto-restart Policies** - Fault tolerance and self-healing
- **Volume Persistence** - Data survives container restarts
- **Port Range Mapping** - Dynamic scaling support
- **Load Distribution** - Automatic traffic balancing

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Run tests**: `npm run test:all`
4. **Commit changes**: `git commit -m 'feat: Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

## 📋 Environment Variables

```

# .env configuration

NODE_ENV=production
LOG_LEVEL=info
CREDENTIAL_SECRET=your-super-secure-secret-key
DATABASE_PATH=/app/data
CORS_ORIGIN=*

---
