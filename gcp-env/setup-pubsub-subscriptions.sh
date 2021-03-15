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

MY_SERVICE_ACCOUNT="au-service-account"
TOPIC_NAME_FEEDBACK_CREATED="feedback-created"

#create a pub sub subscription
PUBSUB_SUBSCRIBER_SERVICE="analysis-func"
SRVICE_URL="https://analysis-func-t2ael7mbvq-uc.a.run.app"

gcloud run services add-iam-policy-binding $PUBSUB_SUBSCRIBER_SERVICE \
   --member=serviceAccount:$MY_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com \
   --role=roles/run.invoker

# Create a Pub/Sub subscription with the service account:
gcloud pubsub subscriptions create myRunSubscription --topic $TOPIC_NAME_FEEDBACK_CREATED --push-endpoint=$SERVICE_URL/ \
   --push-auth-service-account=$MY_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com