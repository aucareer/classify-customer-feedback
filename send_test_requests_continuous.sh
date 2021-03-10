#!/usr/bin/env bash

# Check for required env vars
# (https://stackoverflow.com/questions/39296472/how-to-check-if-an-environment-variable-exists-and-get-its-value)
if [[ -z "${URL}" ]]; then
  echo "URL env var must be set. Exiting."
  exit 0
fi

echo "Will send one positive and one negative feedback every second until stopped."

# (https://www.cyberciti.biz/faq/bash-infinite-loop/)
while :
do
    curl -XPOST -s -o /dev/null -H 'Content-Type: application/json' -d "{\"feedback\":\"I love this app!\"}" $URL
    echo "Sent positive feedback."

    curl -XPOST -s -o /dev/null -H 'Content-Type: application/json' -d "{\"feedback\":\"I hate this app!\"}" $URL
    echo "Sent negative feedback."

    echo "Pausing for one second."
    sleep 1
done
