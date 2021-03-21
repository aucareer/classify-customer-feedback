#!/usr/bin/env bash

PROJECT_ID=$(gcloud config get-value project)

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Must run gcloud init first. Exiting."
  exit 0
fi

APP_NAME="reporting-func"
SHEET_ID="1Ka1wYgSHgTEUaqcxIi64rqmvDy2hwRelxdHFXjGnc3M"

# Build image via Cloud Build
# (https://cloud.google.com/run/docs/quickstarts/build-and-deploy)
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$APP_NAME:v1"

# Deploy with allowing unauthenticated requests, since it's anonymous
# HTTP clients who need to be able to send requests to it. This could be
# tightened in the future by setting up GCP authentication for the HTTP
# client sending the feedback if it supports it.
# Set CPU/memory to lowest allowed because it doesn't need a lot.
# Set max instances low to help prevent runaway bills during the project.
gcloud run deploy $APP_NAME \
  --image "gcr.io/${PROJECT_ID}/${APP_NAME}:v1" \
  --cpu "1.0" \
  --memory "128Mi" \
  --max-instances 1 \
  --platform managed \
  --set-env-vars="SHEET_ID=${SHEET_ID}" \
  --no-allow-unauthenticated

# Needed to ensure this deploy gets 100% of traffic if traffic was manualy
# adjusted for this service before.
gcloud run services update-traffic $APP_NAME --to-latest

