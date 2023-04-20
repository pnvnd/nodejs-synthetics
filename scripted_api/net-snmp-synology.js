let $secure = process.env; // comment out when testing in New Relic
var snmp = require ("net-snmp");

var session = snmp.createSession ("192.168.0.143", "datacrunch");

// https://global.download.synology.com/download/Document/Software/DeveloperGuide/Firmware/DSM/All/enu/Synology_DiskStation_MIB_Guide.pdf
var oids = [
    "1.3.6.1.4.1.6574.1.5.1.0", // modelName
    "1.3.6.1.4.1.2021.10.1.5.1", // System load average within the last 1 minute. This is computed by taking the floating point loadaverage value and multiplying by 100.
    "1.3.6.1.4.1.2021.10.1.5.2", // System load average within the last 5 minutes. This is computed by taking the floating point loadaverage value and multiplying by 100.
    // "1.3.6.1.4.1.6574.1.5.2.0", // serialNumber
    // "1.3.6.1.4.1.6574.1.5.3.0", // version
    // "1.3.6.1.4.1.2021.10.1.5.1", // CPU - UCD-SNMP-MIB/laLoadInt1Min  - The 1 minute load averages as an integer. 
    // "1.3.6.1.2.1.25.2.3.1.6.1", // MemoryTotal - HOST-RESOURCES-MIB/hrStorageUsed
];

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i])) {
                console.error (snmp.varbindError (varbinds[i]));
            } else {
                console.log (varbinds[i].oid + " = " + varbinds[i].value + "\n");
            }
        }

        let payload = {
            "eventType": "SynologySample",
            "modelName": varbinds[0].value.toString('utf-8'),
            "laLoadInt.1": varbinds[1].value,
            "laLoadInt.2": varbinds[2].value,
        };

        console.log(payload);
    }
    session.close ();
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error) {
        console.error (error);
    }
});
