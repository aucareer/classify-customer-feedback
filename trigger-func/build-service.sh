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

# Build image via Cloud Build
# (https://cloud.google.com/run/docs/quickstarts/build-and-deploy)
echo "Building docker image via Cloud Build"
gcloud builds submit --tag "gcr.io/$PROJECT_ID/trigger-func"

