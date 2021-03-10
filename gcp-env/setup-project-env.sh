#!/bin/bash
echo -n "Enter the existing GCP project id to use and press [ENTER]: "
read PROJECT_ID
echo

echo "Creating Google Cloud Environment"
gcloud debug targets list --quiet

REGION="us-central1"
TOPIC_NAME_FEEDBACK_CREATED="feedback-created"
TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified"

echo "setup a project"
gcloud config set project $PROJECT_ID

echo "set up region"
gcloud config set run/region $REGION

echo "enable cloud run"
gcloud services enable run.googleapis.com
gcloud config set run/platform managed

echo "enable pubsub"
gcloud services enable pubsub.googleapis.com

echo "enable other services"
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

echo "create topics"
gcloud pubsub topics create $TOPIC_NAME_FEEDBACK_CREATED
gcloud pubsub topics create $TOPIC_NAME_FEEDBACK_CLASSIFIED
