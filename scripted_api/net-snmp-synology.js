let $secure = process.env; // comment out when testing in New Relic
var snmp = require ("net-snmp");
const got = require('got');

var authKey = $secure.AUTH_KEY;
var privKey = $secure.PRIV_KEY;

// Example user
var user = {
    name: "datacrunch",
    level: snmp.SecurityLevel.authPriv,
    authProtocol: snmp.AuthProtocols.sha,
    authKey: `${authKey}`,
    privProtocol: snmp.PrivProtocols.des,
    privKey: `${privKey}`
};
// var session = snmp.createSession ("192.168.0.143", "datacrunch");

var session = snmp.createV3Session ("192.168.0.143", user);

// https://global.download.synology.com/download/Document/Software/DeveloperGuide/Firmware/DSM/All/enu/Synology_DiskStation_MIB_Guide.pdf
var oids = [
    // SYNOLOGY-SYSTEM-MIB
    "1.3.6.1.4.1.6574.1.1.0", // 0 - systemStatus
    "1.3.6.1.4.1.6574.1.2.0", // 1 - temperature
    "1.3.6.1.4.1.6574.1.3.0", // 2 - powerStatus
    "1.3.6.1.4.1.6574.1.4.1.0", // 3 - systemFanStatus
    "1.3.6.1.4.1.6574.1.4.2.0", // 4 - cpuFanStatus
    "1.3.6.1.4.1.6574.1.5.1.0", // 5 - modelName
    "1.3.6.1.4.1.6574.1.5.2.0", // 6 - serialNumber
    "1.3.6.1.4.1.6574.1.5.3.0", // 7 - version
    "1.3.6.1.4.1.6574.1.5.4.0", // 8 - upgradeAvailable

    // SYNOLOGY-DISK-MIB (Bay 1)
    "1.3.6.1.4.1.6574.2.1.1.1.0", // 9 - diskIndex1
    "1.3.6.1.4.1.6574.2.1.1.2.0", // 10 - diskID1
    "1.3.6.1.4.1.6574.2.1.1.3.0", // 11 - diskModel1
    "1.3.6.1.4.1.6574.2.1.1.4.0", // 12 - diskType1
    "1.3.6.1.4.1.6574.2.1.1.5.0", // 13 - diskStatus1
    "1.3.6.1.4.1.6574.2.1.1.6.0", // 14 - diskTemperature1
    "1.3.6.1.4.1.6574.2.1.1.7.0", // 15 - diskRole1
    "1.3.6.1.4.1.6574.2.1.1.8.0", // 16 - diskRetry1
    "1.3.6.1.4.1.6574.2.1.1.9.0", // 17 - diskBadSector1
    "1.3.6.1.4.1.6574.2.1.1.10.0", // 18 - diskIdentifyFail1
    "1.3.6.1.4.1.6574.2.1.1.11.0", // 19 - diskRemainLife1
    "1.3.6.1.4.1.6574.2.1.1.12.0", // 20 - diskName1
    "1.3.6.1.4.1.6574.2.1.1.13.0", // 21 - diskHealthStatus1

    // SYNOLOGY-DISK-MIB (Bay 2)
    "1.3.6.1.4.1.6574.2.1.1.1.1", // 22 - diskIndex2
    "1.3.6.1.4.1.6574.2.1.1.2.1", // 23 - diskID2
    "1.3.6.1.4.1.6574.2.1.1.3.1", // 24 - diskModel2
    "1.3.6.1.4.1.6574.2.1.1.4.1", // 25 - diskType2
    "1.3.6.1.4.1.6574.2.1.1.5.1", // 26 - diskStatus2
    "1.3.6.1.4.1.6574.2.1.1.6.1", // 27 - diskTemperature2
    "1.3.6.1.4.1.6574.2.1.1.7.1", // 28 - diskRole2
    "1.3.6.1.4.1.6574.2.1.1.8.1", // 29 - diskRetry2
    "1.3.6.1.4.1.6574.2.1.1.9.1", // 30 - diskBadSector2
    "1.3.6.1.4.1.6574.2.1.1.10.1", // 31 - diskIdentifyFail2
    "1.3.6.1.4.1.6574.2.1.1.11.1", // 32 - diskRemainLife2
    "1.3.6.1.4.1.6574.2.1.1.12.1", // 33 - diskName2
    "1.3.6.1.4.1.6574.2.1.1.13.1", // 34 - diskHealthStatus2

    // CPU-related OID
    "1.3.6.1.4.1.2021.10.1.5.1", // 35 - laLoadInt1min
    "1.3.6.1.4.1.2021.10.1.5.2", // 36 - laLoadInt5min
    "1.3.6.1.4.1.2021.10.1.5.3", // 37 - laLoadInt15min
    "1.3.6.1.4.1.2021.11.9.0", // 38 - ssCpuUser
    "1.3.6.1.4.1.2021.11.10.0", // 39 - ssCpuSystem
    "1.3.6.1.4.1.2021.11.11.0", // 40 - ssCpuIdle

    // Memory-Related OID
    "1.3.6.1.4.1.2021.4.3.0", // 41 - memTotalSwap
    "1.3.6.1.4.1.2021.4.4.0", // 42 - memAvailSwap
    "1.3.6.1.4.1.2021.4.5.0", // 43 - memTotalReal
    "1.3.6.1.4.1.2021.4.6.0", // 44 - memAvailReal
    "1.3.6.1.4.1.2021.4.11.0", // 45 - memTotalFree
    "1.3.6.1.4.1.2021.4.13.0", // 46 - memShared
    "1.3.6.1.4.1.2021.4.14.0", // 47 - memBuffer
    "1.3.6.1.4.1.2021.4.15.0", // 48 - memCached
];

session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i])) {
                console.error (snmp.varbindError (varbinds[i]));
            } else {
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
            }
        }

        var systemStatus;
        if (varbinds[0].value == 1) {systemStatus = "Normal"} else {systemStatus = "Failed"};

        var powerStatus;
        if (varbinds[2].value == 1) {powerStatus = "Normal"} else {powerStatus = "Failed"};

        var systemFanStatus;
        if (varbinds[3].value == 1) {systemFanStatus = "Normal"} else {systemFanStatus = "Failed"};

        var cpuFanStatus;
        if (varbinds[4].value == 1) {cpuFanStatus = "Normal"} else {cpuFanStatus = "Failed"};

        var upgradeAvailable;
        if (varbinds[8].value == 1) {upgradeAvailable = "Available"} 
            else if (varbinds[8].value == 2) {upgradeAvailable = "Unavailable"}
            else if (varbinds[8].value == 3) {upgradeAvailable = "Connecting"}
            else if (varbinds[8].value == 4) {upgradeAvailable = "Disconnected"}
            else if (varbinds[8].value == 5) {upgradeAvailable = "Others"}
            else {upgradeAvailable == "Unknown"};

        var diskStatus1;
        if (varbinds[13].value == 1) {diskStatus1 = "Normal"} 
            else if (varbinds[13].value == 2) {diskStatus1 = "Initialized"}
            else if (varbinds[13].value == 3) {diskStatus1 = "NotInitialized"}
            else if (varbinds[13].value == 4) {diskStatus1 = "SystemPartitionFailed"}
            else if (varbinds[13].value == 5) {diskStatus1 = "Crashed"}
            else {diskStatus1 == "Unknown"};

        var diskStatus2;
        if (varbinds[26].value == 1) {diskStatus2 = "Normal"} 
            else if (varbinds[26].value == 2) {diskStatus2 = "Initialized"}
            else if (varbinds[26].value == 3) {diskStatus2 = "NotInitialized"}
            else if (varbinds[26].value == 4) {diskStatus2 = "SystemPartitionFailed"}
            else if (varbinds[26].value == 5) {diskStatus2 = "Crashed"}
            else {diskStatus2 == "Unknown"};

        var diskHealthStatus1;
        if (varbinds[21].value == 1) {diskHealthStatus1 = "Normal"} 
            else if (varbinds[21].value == 2) {diskHealthStatus1 = "Warning"}
            else if (varbinds[21].value == 3) {diskHealthStatus1 = "Critical"}
            else if (varbinds[21].value == 4) {diskHealthStatus1 = "Failing"}
            else {diskHealthStatus1 == "Unknown"};

        var diskHealthStatus2;
        if (varbinds[34].value == 1) {diskHealthStatus2 = "Normal"} 
            else if (varbinds[34].value == 2) {diskHealthStatus2 = "Warning"}
            else if (varbinds[34].value == 3) {diskHealthStatus2 = "Critical"}
            else if (varbinds[34].value == 4) {diskHealthStatus2 = "Failing"}
            else {diskHealthStatus2 == "Unknown"};

        let payload = {
            "eventType": "SynologySample",
            "systemStatus": systemStatus,
            "temperature": varbinds[1].value,
            "powerStatus": powerStatus,
            "systemFanStatus": systemFanStatus,
            "cpuFanStatus": cpuFanStatus,
            "modelName": varbinds[5].value.toString('utf-8'),
            "serialNumber": varbinds[6].value.toString('utf-8'),
            "version": varbinds[7].value.toString('utf-8'),
            "upgradeAvailable": upgradeAvailable,

            "diskIndex1": varbinds[9].value,
            "diskID1": varbinds[10].value.toString('utf-8'),
            "diskModel1": varbinds[11].value.toString('utf-8'),
            "diskType1": varbinds[12].value.toString('utf-8'),
            "diskStatus1": diskStatus1,
            "diskTemperature1": varbinds[14].value,
            "diskRole1": varbinds[15].value.toString('utf-8'),
            "diskRetry1": varbinds[16].value,
            "diskBadSector1": varbinds[17].value,
            "diskIdentifyFail1": varbinds[18].value,
            "diskRemainLife1": varbinds[19].value,
            "diskName1": varbinds[20].value.toString('utf-8'),
            "diskHealthStatus1": diskHealthStatus1,

            "diskIndex2": varbinds[22].value,
            "diskID2": varbinds[23].value.toString('utf-8'),
            "diskModel2": varbinds[24].value.toString('utf-8'),
            "diskType2": varbinds[25].value.toString('utf-8'),
            "diskStatus2": diskStatus2,
            "diskTemperature2": varbinds[27].value,
            "diskRole2": varbinds[28].value.toString('utf-8'),
            "diskRetry2": varbinds[29].value,
            "diskBadSector2": varbinds[30].value,
            "diskIdentifyFail2": varbinds[31].value,
            "diskRemainLife2": varbinds[32].value,
            "diskName2": varbinds[33].value.toString('utf-8'),
            "diskHealthStatus2": diskHealthStatus2,

            "laLoadInt1min": varbinds[35].value/100,
            "laLoadInt5min": varbinds[36].value/100,
            "laLoadInt15min": varbinds[37].value/100,
            "ssCpuUser": varbinds[38].value,
            "ssCpuSystem": varbinds[39].value,
            "ssCpuIdle": varbinds[40].value,

            "memTotalSwap": varbinds[41].value,
            "memAvailSwap": varbinds[42].value,
            "memTotalReal": varbinds[43].value,
            "memAvailReal": varbinds[44].value,
            "memTotalFree": varbinds[45].value,
            "memShared": varbinds[46].value,
            "memBuffer": varbinds[47].value,
            "memCached": varbinds[48].value,
        };

        console.log(payload);
        
        var account_id = $secure.ACCOUNT_ID;
        got.post(`https://insights-collector.newrelic.com/v1/accounts/${account_id}/events`, {
            headers: {
                'Api-Key': $secure.NEW_RELIC_LICENSE_KEY,
                'Content-Type': 'application/json'
            },
            json: payload
            })
        }
    
    session.close ();
});

session.trap (snmp.TrapType.LinkDown, function (error) {
    if (error) {
        console.error (error);
    }
});
