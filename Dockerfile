bashCopy code
FROM node:21
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]