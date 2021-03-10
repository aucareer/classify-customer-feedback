#!/bin/bash
echo -n "Enter the existing GCP project id to use and press [ENTER]: "
read PROJECT_ID
echo

TOPIC_NAME_FEEDBACK_CREATED="feedback-created"
TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified"

echo "Cleaning up the google cloud environment"
gcloud debug targets list --quiet

echo "Deleting topics"
gcloud pubsub topics delete $TOPIC_NAME_FEEDBACK_CREATED
gcloud pubsub topics delete $TOPIC_NAME_FEEDBACK_CLASSIFIED


#gcloud ices disable run.googleapis.com
#gcloud services disable containerregistry.googleapis.com
#gcloud services disable cloudbuild.googleapis.com

echo "Unset projecta and run"
gcloud config unset project
#gcloud config unset run
