#!/usr/bin/env bash

PROJECT_ID=$(gcloud config get-value project)

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Must run gcloud init first. Exiting."
  exit 0
fi

if [[ -z "${SERVICE_URL}" ]]; then
  echo "SERVICE_URL (URL of reporting-func service revealed after its deploy) env var must be set. Exiting."
  exit 0
fi

# Things shared between the pieces being deployed
SERV_ACCT_NAME="test-de" # need shorter name for service account
APP_NAME="test-default-cred"
# Subscription name also becomes the name of the service account representing
# its identity
 
SUBSCRIPTION_NAME="${SERV_ACCT_NAME}-sheet-invoker"


# Give the invoker service account permission to invoke your service
gcloud run services add-iam-policy-binding $APP_NAME \
   "--member=serviceAccount:${SUBSCRIPTION_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
   --role=roles/run.invoker

# Create a Pub/Sub subscription with the service account
gcloud pubsub subscriptions create $SUBSCRIPTION_NAME --topic $TOPIC_NAME \
   --push-endpoint=${SERVICE_URL}/ \
   "--push-auth-service-account=${SUBSCRIPTION_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
