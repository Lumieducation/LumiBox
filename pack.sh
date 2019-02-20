#! /bin/sh

TOOL_DIR=$1
TOOL=$(basename "$1")
TARGET=$2

DIR=$(pwd)

mkdir $TOOL_DIR/__packing

cp -r $TOOL_DIR/package/* $TOOL_DIR/__packing
cp -r $TOOL_DIR/package$TARGET/* $TOOL_DIR/__packing

cd $TOOL_DIR/__packing
tar -zcf "$DIR/$TOOL$TARGET.lumi.tool" .

cd -
rm -rf $TOOL_DIR/__packing