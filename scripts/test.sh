#!/bin/bash

set -e

BASE_DIRECTORY=`dirname $0`
. ./$BASE_DIRECTORY/packages.sh

for package in ${PACKAGES[@]}; do
  echo "Testing package @$package..."
  npm run test "@$package" -- --watch=false
  echo "Finished testing @$package"
  echo
done
