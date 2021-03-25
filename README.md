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

### 5. Build and Deploy Trigger Func Service
----------------------------------------
Build and deploy trigger-func service to cloud run.

```sh
cd trigger-func
./build-and-deploy-service.sh
```

### 6.  Build and Deploy Analysis Func Service 
------------------------------------------
First setup pub/sub subscriptions for service and then
Build and Deploy Analysis Func Service to cloud run

```sh
cd analysis-func
./create_subscription.sh
./build-and-deploy-service.sh
```

### 7.  Build and Deploy Reporting Func v1 Service 
------------------------------------------
First setup pub/sub subscriptions for service and then
Build and Deploy Reporting Func Service to cloud run

```sh
 cd reporting-func-v1
./create_subscription.sh
./build-and-deploy-service.sh
```

### 8.  Build and Deploy Reporting Func v2 Service 
------------------------------------------
Build and Deploy Reporting Func Service to cloud run

```sh
 cd reporting-func-v2
./build-and-deploy-service.sh
```
### 9.  Split the traffic between v1 and v2 
------------------------------------------
Change the appropriate % between v1 and v2 by editing the file.
Make sure the sh has the correct permissions

```sh
 cd reporting-func-v2
./split-traffic.sh
```

### 10. Test the endpoint
----------------------------------------
Test the endpoint using curl script. you will find the URL as the o/p of step 4

```sh
curl -d '{"feedback":"good service"}' -H "Content-Type: a
pplication/json" -X POST https://trigger-func-mcblwhygza-uc.a.run.app
```

### 11. Teardown the project environment
------------------------------------------
Teardown the environemnt

```sh
cd gcp-env
./teardown-project-env.sh
```

## CI CD 
----------------------------------------------
The .github/workflows folder has all the github action workflow

### cicd-trigger-func.yml 
deploys trigger-func service automatically whenever there is any change in the folder /trigger-func

### cicd-analysis-func.yml 
deploys analysis-func service automatically whenever there is any change in the folder /analysis-func

### cicd-reporting-func-v2.yml 
deploys reporting-func service automatically whenever there is any change in the folder /reporting-func-v2



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

