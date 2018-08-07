#!/bin/bash

###### TURN MINIFY SETTING OFF, THIS IS DONE MANUALLY #########
php bin/magento config:set dev/js/minify_files 0
php bin/php bin/magento config:set dev/js/merge_files 1
php bin/magento config:set dev/template/minify_html 1

###### REMOVE STATIC AND ASSETS DEPLOY THE STATIC FILES #######
rm -r pub/static
php bin/magento setup:static-content:deploy

###### MINIFY THE MERGED CACHED JS AND REDEPLOY ###############
gulp bundlefix --merged
php bin/magento cache:flush
php bin/magento setup:static-content:deploy
