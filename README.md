# classify-customer-feedback

#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

https://cloud.google.com/run/docs/quickstarts/build-and-deploy#node.js_1


1. docker build -t anantu/trigger-func --tag v1 .
2. docker run -p 3000:3000 -d anantu/trigger-func
3. docker ps (24150a9a2157 - conatiner id)
4. docker logs 24150a9a2157