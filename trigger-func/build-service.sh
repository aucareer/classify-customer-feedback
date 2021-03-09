#!/bin/bash
echo -n "Enter the existing GCP project id to use and press [ENTER]: "
read PROJECT_ID
echo

IMAGE_NAME="trigger-func"
REGION="us-central1"
SERVICE_NAME="trigger-func"

gcloud debug targets list --quiet

echo "buildig container image using cloud build"
gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME .

