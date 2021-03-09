echo -n "Enter project id of teh project to be delted and press [ENTER]: "
read PROJECT_ID
echo
gcloud debug targets list --quiet
echo "Deleting a Project"
gcloud projects delete $PROJECT_ID


