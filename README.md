# Redmine-reports UI
Redmine time logging application built with [Node.js](http://nodejs.org/)
##Installation
git clone https://github.com/webbylab/redmine-reports-ui.git

npm install
npm run bower_install

cp etc/config.json.sample etc/config.json
after copy set next field:

    1.  redmineUrl (example: http://job.redmine.com/)

npm run build

Dont forget set staticPath in API config.
After build, you can get to api url and see application