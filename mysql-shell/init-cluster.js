var clusterName = 'myCluster'
var primary = 'root:cdio%40team1@mysql1:3306'
var newNode = 'root:cdio%40team1@mysql2:3306'

var cluster;
var session = shell.connect(primary)

try {
    session.runSql("CREATE USER IF NOT EXISTS 'replicator'@'%' IDENTIFIED BY 'cdio@team1';")
    session.runSql("GRANT ALL PRIVILEGES ON *.* TO 'replicator'@'%' WITH GRANT OPTION;")
    session.runSql("FLUSH PRIVILEGES;")
    print('Replicator user created and granted privileges')
} catch(e) {
    print('Error creating replicator user:', e)
}

try {
    session.runSql("RESET MASTER;")
    print('Master reset successfully')
} catch(e) {
    print('Error resetting master:', e)
}

try {
    cluster = dba.getCluster(clusterName)
    print('Cluster already exists')
} catch(e) {
    dba.configureInstance(primary, {interactive: false})
    cluster = dba.createCluster(clusterName)
    print('Cluster created')
}

var check = dba.checkInstanceConfiguration(newNode)
if (!check.ok) {
    dba.configureInstance(newNode, {interactive: false})
}

cluster.addInstance(newNode, {recoveryMethod: 'clone', interactive: false})
print('Node added successfully!')

