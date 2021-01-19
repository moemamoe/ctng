#!/bin/bash

set -e

BASE_DIRECTORY=`dirname $0`
. ./$BASE_DIRECTORY/packages.sh

for package in ${PACKAGES[@]}; do
  echo "Linting package @$package..."
  npm run lint "@$package"
  echo "Finished linting @$package"
  echo
done
