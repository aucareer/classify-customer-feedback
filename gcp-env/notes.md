#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

https://cloud.google.com/run/docs/quickstarts/build-and-deploy#node.js_1
https://cloud.google.com/container-registry/docs/managing#deleting_images

1. docker build -t anantu/trigger-func --tag v1 .
2. docker run -p 3000:3000 -d anantu/trigger-func
3. docker ps (24150a9a2157 - conatiner id)
4. docker logs 24150a9a2157

#set the default project
gcloud config set project customer-feedback-1

#setup the cloud run environment
gcloud config set run/region us-central1
gcloud config set run/platform managed

#creating topics
gcloud pubsub topics create feedback-created
gcloud pubsub topics create feedback-classified

#build docker image
#Build your container image using Cloud Build, by running the following command #from the directory containing the Dockerfile:
gcloud builds submit --tag gcr.io/customer-feedback-1/trigger-func

#Deploy to the cloud run using 
gcloud run deploy --image gcr.io/customer-feedback-1/trigger-func

#Delete the image
gcloud container images delete gcr.io/customer-feedback-1/trigger-func:latest

#Delete the service
gcloud run services delete trigger-func