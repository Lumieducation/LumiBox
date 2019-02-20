docker stop lumi_hello
docker rm lumi_hello

docker load -i image.tar
docker create -p $TOOL_PORT:3000 --name lumi_hello lumi_hello