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

### 5. Setup Pub/Sub Subscriptions
----------------------------------------
To create various pub/sub subscriptions and realted permissions -run the following script. 

```sh
cd gcp-env
 ./setup-pubsub-subscriptions.sh
```


### 5.  trigger function -> Build and deploy the docker image to cloud run
------------------------------------------
Build and deploy the docker image.

```sh
cd trigger-func
./build-and-deploy-service.sh
```

### 6.  analysis function -> Build and deploy the docker image to cloud run
------------------------------------------
Build and deploy the docker image.

```sh
cd analysis-func
./build-and-deploy-service.sh
```

### 7.  reporting-func-v1 -> Build and deploy the docker image to cloud run
------------------------------------------
Build and deploy the docker image.

```sh
cd reporting-func-v1
./build-and-deploy-service.sh

### 9. Test the endpoint
----------------------------------------
Test the endpoint using curl script. you will find the URL as the o/p of step 6

```sh
curl -d '{"feedback":"good service"}' -H "Content-Type: a
pplication/json" -X POST https://trigger-func-mcblwhygza-uc.a.run.app
```

### 10. Teardown the project environment
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

