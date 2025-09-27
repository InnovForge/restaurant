var clusterName = 'myCluster'
var primary = 'root:cdio%40team1@mysql1:3306'
var nodes = [
    'root:cdio%40team1@mysql2:3306',
    'root:cdio%40team1@mysql3:3306'
]

function waitForPrimary(uri, retries, delayMs) {
    for (var i = 0; i < retries; i++) {
        try {
            print("Trying to connect to: " + uri + " (attempt " + (i+1) + ")")
            var s = shell.connect(uri)
            print("Connected to " + uri)
            return s
        } catch (e) {
            print("Connect failed: " + e.message)
            os.sleep(delayMs / 1000)
        }
    }
    throw new Error("Cannot connect to " + uri + " after " + retries + " retries")
}

print("Connecting to primary: " + primary)
var session = waitForPrimary(primary, 35, 2000)

try {
    session.runSql("CREATE USER IF NOT EXISTS 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'cdio@team1';")
    session.runSql("GRANT ALL PRIVILEGES ON *.* TO 'replicator'@'%' WITH GRANT OPTION;")
    session.runSql("FLUSH PRIVILEGES;")
    print("Replicator user created")
} catch (e) {
    print("Error creating replicator user: " + e.message)
}

try {
    session.runSql("CREATE USER IF NOT EXISTS 'exporter'@'%' IDENTIFIED WITH mysql_native_password BY 'cdio_exporter1' WITH MAX_USER_CONNECTIONS 3;")
    session.runSql("GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';")
    session.runSql("FLUSH PRIVILEGES;")
    print("Exporter user created")
} catch (e) {
    print("Error creating exporter user: " + e.message)
}

var cluster
try {
    cluster = dba.getCluster(clusterName)
    print("Cluster already exists")
} catch (e) {
    dba.configureInstance(primary, {interactive: false})
    cluster = dba.createCluster(clusterName)
    print("Cluster created")
}

for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    try {
        var check = dba.checkInstanceConfiguration(node)
        if (!check.ok) {
            dba.configureInstance(node, {interactive: false})
        }
        cluster.addInstance(node, {recoveryMethod: 'clone', interactive: false})
        print("Node " + node + " added successfully")
    } catch (e) {
        print("Error adding node " + node + ": " + e.message)
    }
}
