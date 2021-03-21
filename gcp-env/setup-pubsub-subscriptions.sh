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
TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified"


#create a pub sub subscription
ANALYSIS_FUNC_SERVICE="analysis-func"
ANALYSIS_FUNC_SERVICE_URL="https://analysis-func-t2ael7mbvq-uc.a.run.app"

echo "Setting seubscription for analysis-func"
gcloud run services add-iam-policy-binding $ANALYSIS_FUNC_SERVICE \
   --member=serviceAccount:$MY_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com \
   --role=roles/run.invoker

# # Create a Pub/Sub subscription with the service account:
echo "Setting feedbackCreatedSubscription"
gcloud pubsub subscriptions create feedbackCreatedSubscription --topic $TOPIC_NAME_FEEDBACK_CREATED --push-endpoint=$ANALYSIS_FUNC_SERVICE_URL/ \
   --push-auth-service-account=$MY_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com

# echo "Setting seubscription for reporting-func-v1"
REPORTING_FUNC_V1_SERVICE="reporting-func-v1"
REPORTING_FUNC_V1_SERVICE_URL="https://reporting-func-v1-t2ael7mbvq-uc.a.run.app"

gcloud run services add-iam-policy-binding $REPORTING_FUNC_V1_SERVICE \
   --member=serviceAccount:$MY_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com \
   --role=roles/run.invoker

# Create a Pub/Sub subscription with the service account:
echo "Setting feedbackClassifiedSubscription"
gcloud pubsub subscriptions create feedbackClassifiedSubscription --topic $TOPIC_NAME_FEEDBACK_CLASSIFIED --push-endpoint=$REPORTING_FUNC_V1_SERVICE_URL/ \
   --push-auth-service-account=$MY_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com --max-delivery-attempts=5 --dead-letter-topic=dead-feedback-classified