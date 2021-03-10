#!/bin/bash
echo "Beginning environemnt teardown for the project"

# Topic Names
TOPIC_NAME_FEEDBACK_CREATED="feedback-created"
TOPIC_NAME_FEEDBACK_CLASSIFIED="feedback-classified"

# Disabling prompts
# https://cloud.google.com/sdk/docs/scripting-gcloud
gcloud debug targets list --quiet

echo "Deleting Pub/Sub Topics"
# Delete Pub/Sub topics
# (https://cloud.google.com/sdk/gcloud/reference/pubsub/topics/delete)
gcloud pubsub topics delete $TOPIC_NAME_FEEDBACK_CREATED $TOPIC_NAME_FEEDBACK_CLASSIFIED

