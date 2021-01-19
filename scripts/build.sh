#!/bin/bash

set -e

usage() {
    echo "Usage: `basename $0` <library-name>"
    echo "<library-name>         Optional library to build. Builds all if no lib is passed."
    echo "--watch                Run build when files change. Only in single library mode."
    echo "-h|--help              Display usage information."
    echo ""
}


while [ $# -gt 0 ]
do
    PARAMETER=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAMETER in
        --watch)
            WATCH=true
            ;;
        --release)
            RELEASE=true
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            LIB=$1
            ;;
    esac
    shift
done

BASE_DIRECTORY=`dirname $0`
. ./$BASE_DIRECTORY/packages.sh

copyMarkdownFiles() {

  package=$1;

  echo "Copy README.md to output dist folder of library @$package"
  cp "$PROJECT_ROOT/projects/$package/README.md" $PROJECT_ROOT/$OUTPUT_FOLDER/$package
  echo "Copy README.md to assets folder of application"
  mkdir -p "$PROJECT_ROOT/src/assets/$package" && cp "$PROJECT_ROOT/projects/$package/README.md" "$PROJECT_ROOT/src/assets/$package/README.md"
  echo "Copy CHANGELOG.md to output dist folder of library @$package"
  cp "$PROJECT_ROOT/projects/$package/CHANGELOG.md" $PROJECT_ROOT/$OUTPUT_FOLDER/$package

}

copyScssFiles() {
  package=$1;
  echo "Copy SCSS files to output dist folder of the library @$package"
  cp -rf "$PROJECT_ROOT/projects/$package/src/lib/scss" $PROJECT_ROOT/$OUTPUT_FOLDER/$package
}

if [ -z "$WATCH" ]; then
  echo "Cleaning output foler $PROJECT_ROOT/$OUTPUT_FOLDER ..."
  rm -rf $PROJECT_ROOT/$OUTPUT_FOLDER
  echo
fi

if [ "$RELEASE" = true ]; then
  echo "Building library in production mode (disabled IVY) for releasing ..."
  RELASE_ARG="--prod"
  echo
fi

if [ -z "$LIB" ]; then
  echo "Building all packages..."
  for package in ${PACKAGES[@]}; do
    echo "Building package @$package..."
    npm run build "@$package" -- $RELASE_ARG
    echo "Finished building @$package"
    copyMarkdownFiles $package
    if [[ $package == *"common"* ]]; then
      copyScssFiles $package
    fi
    echo

  done
else
  echo "Building package $LIB..."
  if [ ! -z "$WATCH" ]; then
    echo "watch mode enabled"
    WATCH_ARG="--watch"
    npm run build "@$LIB" -- $RELASE_ARG
    copyMarkdownFiles $LIB
  fi

  npm run build -- "@$LIB" $WATCH_ARG
  copyMarkdownFiles $LIB
  if [[ $LIB == *"common"* ]]; then
    copyScssFiles $LIB
  fi
fi
