# This syntax pins the image to the exact digest you found.
# It is the most stable and secure method possible.
FROM node:22-slim@sha256:d943bf20249f8b92eff6f605362df2ee9cf2d6ce2ea771a8886e126ec8714f08

# The rest of your Dockerfile...
WORKDIR /backend/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]