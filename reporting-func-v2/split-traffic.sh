#!/usr/bin/env bash

PROJECT_ID=$(gcloud config get-value project)

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Must run gcloud init first. Exiting."
  exit 0
fi



APP_NAME="reporting-func"
echo $PROJECT_ID
echo "gcr.io/${PROJECT_ID}/${APP_NAME}:v1" 

gcloud beta run deploy $APP_NAME --image "gcr.io/${PROJECT_ID}/${APP_NAME}:v1"  --no-traffic --tag v001

gcloud beta run deploy $APP_NAME --image "gcr.io/${PROJECT_ID}/${APP_NAME}:v2"  --no-traffic --tag v002

#Try different combinations
# gcloud beta run services update-traffic $APP_NAME --to-tags v001=90,v002=100
# gcloud beta run services update-traffic $APP_NAME --to-tags v001=25,v002=75
# gcloud beta run services update-traffic $APP_NAME --to-tags v001=50,v002=50
# gcloud beta run services update-traffic $APP_NAME --to-tags v001=75,v002=0
gcloud beta run services update-traffic $APP_NAME --to-tags v002=100

