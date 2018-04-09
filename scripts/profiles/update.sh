#!/bin/bash

API="http://localhost:4741"
URL_PATH="/profiles"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "profile": {
      "userName": "'"${USERNAME}"'",
      "phone": "'"${PHONE}"'"
    }
  }'

echo
