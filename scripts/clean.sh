pushd .
cd packages/website
yarn clean
popd
rm -rf ./node_modules
rm -rf ./packages/**/node_modules

yarn
lerna bootstrap
pushd .
cd packages/website
yarn
popd

yarn build
