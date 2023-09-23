#!/usr/bin/env bash

# Use the following command to give execution permission to the script:
# sudo chmod +x create-update-s3-bucket.sh 

# Create AWS CFN Stack - wrapper for `aws cloudformation deploy`

usage="Usage: $(basename "$0") stack-name template-file-name region

where:
    stack-name          - the stack name
    template-file-name  - the template file name
    region              - the AWS region
" 

if [ "$1" == "-h" ] || [ "$1" == "--help" ] || [ "$1" == "help" ] || [ "$1" == "usage" ] ; then
  echo "$usage"
  exit -1
fi

if [ -z "$1" ] || [ -z "$2" ] ; then
  echo "$usage"
  exit -1
fi

if [ -z "$3" ] ; then
  REGION=us-east-1
else
  REGION=$3
fi

STACK_NAME=$1


template_file="resources/$2"
template_body="file://resources/$2"

echo "validating template ..."

if ! aws cloudformation validate-template --template-body ${template_body} --region ${REGION} ; then
    echo "validation error"
    exit -1
fi

echo "template is valid."

aws cloudformation deploy --stack-name ${STACK_NAME} --template-file ${template_file} --region ${REGION}
