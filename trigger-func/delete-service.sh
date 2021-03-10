#!/usr/bin/env bash

#Disabling the prompts
gcloud debug targets list --quiet

# Reading PROJECT_ID
PROJECT_ID=$(gcloud config get-value project)

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Must run gcloud init first. Exiting."
  exit 0
fi

APP_NAME="trigger-func"

echo "Deleting Docker Image"
gcloud container images delete gcr.io/$PROJECT_ID/trigger-func

echo "Delete trigger-func service"
gcloud run services delete $APP_NAME
