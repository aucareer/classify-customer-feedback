# classify-customer-feedback

## Creating GCP Environment

### 1. Create a new GCP project
-------------------------------
Create a new GCP project and link it to your billing account. 

### 2. Setup gcloud 
----------------------------------
From gcloud terminal - login to gcp 

### 3. Optional
------------------------------------
If you would like to create a project using bash script.This script requires you to provide the PROJECT_ID and BILLING_ACCOUNT_ID

```sh
cd gcp-env
./create-new-gcp=project.sh
```

### 4. Setup Project environment
----------------------------------------
To create project environment -run the following script. This will setup your cloud run environemnt, enable necessry services and creates two topics 

```sh
cd gcp-env
 ./setup-project-env.sh
```

### 5. Build the docker image
------------------------------------------
Build the docker image.

```sh
cd trigger-func
./build-service.sh
```

### 6. Deploy the service on cloud run
----------------------------------------
Deploy the service.

```sh
cd trigger-func
./deploy-service.sh
```
You should see the endpoint when script completes - URL

### 7. Test the endpoint
----------------------------------------
Test the endpoint using curl script. you will find the URL as the o/p of step 6

```sh
curl -d '{"feedback":"good service"}' -H "Content-Type: a
pplication/json" -X POST https://trigger-func-mcblwhygza-uc.a.run.app
```

### 8. Delete the service
------------------------------------------
Delete the service. 

```sh
cd trigger-func
./ delete-service.sh
```

### 9. Teardown the project environment
------------------------------------------
Teardown the environemnt

```sh
cd gcp-env
./teardown-project-env.sh
```


## Resources

### Firestore
-----------------------------------------------------
https://firebase.google.com/docs/firestore/data-model

https://firebase.google.com/docs/firestore/quickstart

https://cloud.google.com/firestore/docs/quickstart-servers#node.js

https://firebase.google.com/docs/firestore/solutions/automate-database-create

### Cloud Run
https://cloud.google.com/run/docs/configuring/environment-variables#yaml
https://cloud.google.com/docs/authentication/getting-started

https://cloud.google.com/pubsub/docs/quickstart-client-libraries#pubsub-client-libraries-nodejs

https://cloud.google.com/run/docs/tutorials/pubsub#integrating-pubsub
https://cloud.google.com/appengine/docs/flexible/nodejs/writing-and-responding-to-pub-sub-messages

https://cloud.google.com/run/docs/triggering/pubsub-push

### Auto ML
https://cloud.google.com/natural-language/automl/docs/quickstart

https://cloud.google.com/vision/automl/object-detection/docs/quickstart
https://cloud.google.com/iam/docs/creating-managing-service-accounts#iam-service-accounts-create-gcloud


# Milestone 3


Configuring PubSub with Function
https://cloud.google.com/run/docs/tutorials/pubsub

