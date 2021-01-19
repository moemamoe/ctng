#!/bin/bash

BASE_DIRECTORY=`dirname $0`
. ./$BASE_DIRECTORY/packages.sh

for package in ${PACKAGES[@]}; do
  echo "Publishing package @$package..."
  npm publish --access public "$OUTPUT_FOLDER/$package"
  echo "Finished publishing @$package"
  echo
done
