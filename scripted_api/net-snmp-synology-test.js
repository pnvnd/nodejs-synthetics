let $secure = process.env; // comment out when testing in New Relic
var snmp = require ("net-snmp");

var session = snmp.createSession ("192.168.0.143", "datacrunch");

var oid = "1.3.6.1.2.1.2.2";

function doneCb (error) {
    if (error)
        console.error (error.toString ());
}

function feedCb (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else
            console.log (varbinds[i].oid + "|" + varbinds[i].value);
    }
}

var maxRepetitions = 20;

// The maxRepetitions argument is optional, and will be ignored unless using
// SNMP verison 2c
session.walk (oid, maxRepetitions, feedCb, doneCb);