echo -n "Enter the existing GCP project id to use and press [ENTER]: "
read PROJECT_ID
echo

IMAGE_NAME="trigger-func"
REGION="us-central1"
SERVICE_NAME="trigger-func"

gcloud debug targets list --quiet

echo "deploy the container image to cloud run"
gcloud run deploy $SERVICE_NAME --image gcr.io/$PROJECT_ID/$IMAGE_NAME  --region $REGION  --platform managed --allow-unauthenticated
~                                                                               
