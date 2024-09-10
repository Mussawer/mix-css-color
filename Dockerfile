FROM ubuntu:latest
RUN apt-get update && apt-get install -y git unzip zip curl tar wget python3 python3-pip
RUN apt-get install -y nodejs npm
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "test"]