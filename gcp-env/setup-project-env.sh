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

echo "Beginning environment setup for the project: " 

# Disabling Promots
# https://cloud.google.com/sdk/docs/scripting-gcloud
gcloud debug targets list --quiet

# Default Values
DEFAULT_REGION="us-central1"
APP_ENGINE_REGION="us-central"
TOPIC_NAME_FEEDBACK_CREATED="feedback-created"
TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified"

# Enabling required Google APIs
echo "Enabling required Google APIs..."
gcloud services enable --project $PROJECT_ID \
  cloudbuild.googleapis.com \
  appengine.googleapis.com \
  language.googleapis.com \
  sheets.googleapis.com \
  run.googleapis.com

# App Engine is a requirement for using Firestore.
# App Engine refers to the region as "us-central" right now.
echo "Enabling App Engine and Firestore"
gcloud app create --region $APP_ENGINE_REGION
gcloud firestore databases create --region $APP_ENGINE_REGION

# Set Cloud Run config
# (https://cloud.google.com/compute/docs/regions-zones)
echo "Setup cloud run configurations"
gcloud config set run/platform managed
gcloud config set run/region $DEFAULT_REGION

# Create Pub/Sub topics
# (https://cloud.google.com/sdk/gcloud/reference/pubsub/topics/create)
echo "Creating Pub/Sub Topics"
gcloud pubsub topics create $TOPIC_NAME_FEEDBACK_CREATED
gcloud pubsub topics create $TOPIC_NAME_FEEDBACK_CLASSIFIED

# Enable Pub/Sub to create authentication tokens in your project
# (https://cloud.google.com/run/docs/tutorials/pubsub)
echo "Enabling Pub/Sub to create authentictaion token"
gcloud projects add-iam-policy-binding $PROJECT_ID \
	"--member=serviceAccount:service-${PROJECT_NUMBER}@gcp-sa-pubsub.iam.gserviceaccount.com" \
	--role=roles/iam.serviceAccountTokenCreator

# Enable Cloud Natural Language API (Milestone 3)
echo "Enabling Cloud natural Language API"
gcloud services enable --project $PROJECT_ID language.googleapis.com

# Enable Sheets API (Milestone 4)
echo "Enabling Google Sheets API"
gcloud services enable --project $PROJECT_ID sheets.googleapis.com

