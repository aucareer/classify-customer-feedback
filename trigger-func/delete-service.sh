#!/bin/bash
echo -n "Enter the existing GCP project id to use and press [ENTER]: "
read PROJECT_ID
echo

IMAGE_NAME="trigger-func"
SERVICE_NAME="trigger-func"

gcloud debug targets list --quiet

echo "Deleting Docker Image"
gcloud container images delete gcr.io/$PROJECT_ID/$IMAGE_NAME

echo "Delete trigger-func service"
gcloud run services delete $SERVICE_NAME
