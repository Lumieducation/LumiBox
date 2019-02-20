#! /bin/sh

TOOL_DIR=$1
TOOL=$(basename "$1")
TARGET=$2

echo package$TARGET

cd $TOOL_DIR
mkdir -p package$TARGET
docker build -t lumi_$TOOL src
docker save -o package$TARGET/image.tar lumi_$TOOL
cd -