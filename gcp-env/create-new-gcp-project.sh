echo -n "Enter project id (between 6 to 40 characters and unique) and press [ENTER]: "
read PROJECT_ID
echo -n "Enter billing id to link to the new project and press [ENTER]: "
read ACCOUNT_ID
echo
gcloud debug targets list --quiet
echo "Creating a Project"
gcloud projects create $PROJECT_ID
echo "Linking billing account to Project"
gcloud beta billing projects link $PROJECT_ID --billing-account=$ACCOUNT_ID

