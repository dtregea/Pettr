# Start with Node.js 16.16
FROM --platform=linux/amd64 node:16.16

# Update npm to version 8.11
RUN npm install -g npm@8.11

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Copy the rest of the application's code into the container
COPY . .

# Install the project's dependencies inside the container
RUN npm install

# Expose the port your app runs on
EXPOSE 50000