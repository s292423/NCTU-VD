import urllib.parse
import pymongo

# 連接訊息配置
MONGODB = {
    'host': '127.0.0.1',
    'port': '27017',
    'user': '',
    'pwd': '',
    'db': 'OneYear',
    'replicaSet': {
        'name': '',
        "members": '',
    }
}

if MONGODB['replicaSet']['name']:
    host_opt = []
    for m in MONGODB['replicaSet']['members']:
        host_opt.append('%s:%s' % (m['host'], m['port']))
    replicaSet = MONGODB['replicaSet']['name']
else:
    host_opt = '%s:%s' % (MONGODB['host'], MONGODB['port'])
    replicaSet = None

option = {
    'host': host_opt,
    'authSource': MONGODB['db'] or 'admin',
    'replicaSet': replicaSet,
}
if MONGODB['user'] and MONGODB['pwd']:
    option['username'] = urllib.parse.quote_plus(MONGODB['user'])
    option['password'] = urllib.parse.quote_plus(MONGODB['pwd'])
    option['authMechanism'] = 'SCRAM-SHA-1'


class MongoDBConnect():

    def __init__(self):
        self.connect()

    def connect(self):
        self.connection = pymongo.MongoClient(**option)
        # check connection
        if(self.connection) :
            print(self.connection.stats)

    def insertData(self, db, collection, mydict):
        mydb = self.connection[db]
        mycol = mydb[collection]
        mycol.insert_many(mydict,ordered=True)


