# Using a private NPM repository with CodeArtifact

## Creating a Repository and a Domain
- it is like a central organisation level entity

## Associate Upstream Repository with the package manager (optional, but recommended)
- will be able to pull npm, maven public pakcages

## Use codeartifact login to change the "npm" pakcage manager credentials from npm to this aws private
- aws codeartifact login --tool npm --domain my_domain --domain-owner 111122223333 --repository my_repo

## install and publish packages
- create a new folder
- npm init
- write some package
- npm publish
- npm install lodash

## Reset your local NPM 
- npm config set registry https://registry.npmjs.com/