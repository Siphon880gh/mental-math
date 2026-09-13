#!/bin/sh
# MAMP still loads PHP 7.4 globally. This CGI runs the trainer on 8.2.
export REDIRECT_STATUS=200
export PHPRC="/Applications/MAMP/bin/php/php8.2.0/conf"
exec /Applications/MAMP/bin/php/php8.2.0/bin/php-cgi
