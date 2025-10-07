# 1. Base Image - Like choosing an operating system
FROM node:18-alpine
# This gives us: Linux + Node.js 18 pre-installed

# 2. Set working directory inside container
WORKDIR /app

COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy all our source code
COPY . .
# Copy everything from our project folder to /app/

# 6. Create directory for database
RUN mkdir -p data

# 7. Build TypeScript to JavaScript
RUN npm run build
# Converts our .ts files to .js files in dist/ folder

# 8. Tell Docker which port our app uses
EXPOSE 3001
# Like saying "this container listens on port 3001"

# 9. Command to start our app
CMD ["npm", "start"]
# Runs "node dist/server.js" when container starts
