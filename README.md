# nodejs-synthetics
Synthetic monitoring with Node.js.  Start by installing Node.js 16.10.0: https://nodejs.org/dist/v16.10.0/

## Install Node.js Dependencies for Scripted API Tests
We'll be using the same packages from New Relic: https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/manage-monitor-runtimes/#Node16
```
cd scripted_api

npm install async-retry@1.3.3 atob@2.1.2 aws-sdk@2.1007.0 basic-ftp@4.6.6 btoa@1.2.1 chai@4.3.4 colors@1.4.0 consoleplusplus@1.4.4 crypto-js@4.1.1 fs-extra@10.0.0 google-auth-library@7.14.0 got@11.8.3 joi@17.4.2 js-yaml@4.1.0 ldapauth-fork@5.0.1 lodash@4.17.21 moment@2.29.4 net-ping@1.2.3 net-snmp@3.5.5 nodemailer@6.7.3 node-vault@0.9.22 nodejs-traceroute@1.2.0 otpauth@9.0.2 protocol-buffers@4.2.0 q@1.5.1 should@13.2.3 ssh2-sftp-client@7.0.4 ssl-checker@2.0.7 thrift@0.15.0 tough-cookie@4.0.0 underscore@1.13.1 url-parse@1.5.10 urllib@2.37.4 urllib-sync@1.1.4 uuid@8.3.2 ws@8.2.3 xml2js@0.4.23
```

## Install Node.js Dependencies for Scripted Browser Tests
We'll be using the same packages from New Relic: https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/manage-monitor-runtimes/#Chrome100