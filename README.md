# classify-customer-feedback

## Creating GCP Environment

### 1. Create a new GCP project
-------------------------------
Create a new GCP project and link it to your billing account. Note down the PROJECT_ID

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
To create project environment -run the following script. Provide $PROJECT_ID obtained in step 1. This will setup your cloud run environemnt, enable necessry services and creates two topics 

```sh
cd gcp-env
 ./setup-project-env.sh
```

### 5. Build the docker image
------------------------------------------
Build the docker image.This script requires you to provide the PROJECT_ID

```sh
cd trigger-func
./build-service.sh
```

### 6. Deploy the service on cloud run
----------------------------------------
Deploy the service..This script requires you to provide the PROJECT_ID

```sh
cd trigger-func
./deploy-service.sh
```
You should see the endpoint when script completes - URL

### 7. Test the endpoint
----------------------------------------
Test the endpoint using curl script. you will find the URL as the o/p of step 6

```sh
curl -d '{"name":"joe", "age":50}' -H "Content-Type: a
pplication/json" -X POST https://trigger-func-mcblwhygza-uc.a.run.app
```

### 8. Delete the service
------------------------------------------
Delete the service. This script requires you to provide the PROJECT_ID

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





