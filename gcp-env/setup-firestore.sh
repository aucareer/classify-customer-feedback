#!/bin/bash
# Based on https://cloud.google.com/run/docs/setup.

# Read the PROJECT_ID
PROJECT_ID=$(gcloud config get-value project)

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Must run gcloud init first. Exiting."
  exit 0
fi

PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format json | jq --raw-output '.projectNumber')
echo $PROJECT_NUMBER

#https://cloud.google.com/firestore/docs/quickstart-servers#command-line

#1 Create the service account
echo "create service account"
FIRESTORE_SERVICE_ACCOUNT="fstore-service"
gcloud iam service-accounts create $FIRESTORE_SERVICE_ACCOUNT

#2 Grant permissions to the service account
echo "Granting permission to the service account"
gcloud projects add-iam-policy-binding $PROJECT_ID \
 --member="serviceAccount:${FIRESTORE_SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com" \
 --role="roles/owner"

FILE_NAME="fstore-key.json"
# 3 Generate the key file
echo "Generating key file"
gcloud iam service-accounts keys create $FILE_NAME \ --iam-account=$FIRESTORE_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com