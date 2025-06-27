FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install cors and its types explicitly to ensure availability during build
RUN npm install cors @types/cors --save && npm install

# Copy the rest of the application code
COPY . .

# Copy .env file
COPY .env .env

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]