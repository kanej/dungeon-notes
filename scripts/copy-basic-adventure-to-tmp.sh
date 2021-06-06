mkdir -p ./tmp

if [ -d "./examples/adventure" ]
then
    echo "Adventure already exists under ./tmp"
else
    echo "Copying basic adventure to tmp working directory (./tmp/adventure)"
    mkdir -p ./tmp/adventure
    cp -r ./examples/basic/. ./tmp/adventure
fi
