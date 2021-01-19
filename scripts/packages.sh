#!/bin/bash
BASE_DIRECTORY=`dirname $0`
PROJECT_ROOT=$BASE_DIRECTORY/..
OUTPUT_FOLDER="dist"
PACKAGES_FOLDER="$PROJECT_ROOT/projects"
PACKAGES_FOUND=( $(find $PACKAGES_FOLDER -name 'package.json' -printf '%h\n') )
PACKAGES=()
addPackage() {
  packageToAdd=$1
  if [[ ! " ${PACKAGES[@]} " =~ " ${packageToAdd} " ]]; then
    # whatever you want to do when arr doesn't contain value
    PACKAGES+=(${packageToAdd})
  fi
}
# loopthrough all found packages and check, if there are peerDependencies of this project
for package in ${PACKAGES_FOUND[@]}; do
  # maybe better solution with jq? (https://stedolan.github.io/jq/)
  PACKAGE_JSON=$(cat ${package}/package.json)
  PACKAGE_NAME=(${package#"$PACKAGES_FOLDER/"})
  # Clean all available updates
  for package_temp in ${PACKAGES_FOUND[@]}; do
    PEERDEPENDENCY_PACKAGE=(${package_temp#"$PACKAGES_FOLDER/"})
    # check if package.json file as peerDependencies of projects package
    if [[ $PACKAGE_JSON == *$PEERDEPENDENCY_PACKAGE* ]] && [[ $package != $package_temp ]]; then
      echo "PeerDependency found: ${PEERDEPENDENCY_PACKAGE} for Package ${PACKAGE_NAME}"
      addPackage $PEERDEPENDENCY_PACKAGE
    fi
  done
  # Add the tested package to the list, if it is not already in there
  addPackage $PACKAGE_NAME
done
echo
echo "Found ${#PACKAGES[@]} packages:"
printf '%s\n' "${PACKAGES[@]}"
echo
