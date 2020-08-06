from datetime import date, datetime, timedelta
import pymysql.cursors
import numpy as np

# 连接配置信息
config = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'root',
    'password': '',
    'db': 'unDivide',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor,
}


class connectDB():

    now_time = ''

    def __init__(self):
        self.cursor = None
        self.connection = None
        self.connect()

    # create connection
    def connect(self):
        self.connection = pymysql.connect(**config)
        # check connection
        if(self.connection) :
            print("^___<")
            self.cursor = self.connection.cursor()
        self.cursor.execute("SET NAMES utf8mb4")
        self.cursor.execute("SET CHARACTER SET utf8mb4")
        self.cursor.execute("SET character_set_connection = utf8mb4")

    def query_table_for_show(self):
        # print("apple")
        table = []
        sql = "show TABLES"
        self.cursor.execute(sql)
        result = self.cursor.fetchall()
        for i in range(len(result)):
            # print(result[i].get('Tables_in_unDivide'))
            table.append(result[i].get('Tables_in_unDivide'))
        return table

    def getcode(self, code):
        global now_time
        now_time = code

    def create(self, name):

        global now_time
        try:
            self.cursor.execute("SET NAMES utf8mb4;")

            sql = """CREATE TABLE `%s` (
                            Number INT NOT NULL AUTO_INCREMENT,
                            vdid  VARCHAR(191),
                            day VARCHAR(191),
                            time VARCHAR(191),
                            lane_1_speed float,
                            lane_1_laneoccupy float,
                            lane_1_volume float,
                            lane_2_speed float,
                            lane_2_laneoccupy float,
                            lane_2_volume float,
                            lane_3_speed float,
                            lane_3_laneoccupy float,
                            lane_3_volume float,
                            lane_4_speed float,
                            lane_4_laneoccupy float,
                            lane_4_volume float,
                            lane_5_speed float,
                            lane_5_laneoccupy float,
                            lane_5_volume float,
                            lane_6_speed float,
                            lane_6_laneoccupy float,
                            lane_6_volume float,
                            total_speed float,
                            total_laneoccupy float,
                            total_volume float,
                             PRIMARY KEY (Number))"""%(name)
            self.cursor.execute(sql)

            sql = """ALTER TABLE `%s` CHANGE `vdid` `vdid` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci """%(name)
            self.cursor.execute(sql)
            sql = """ALTER TABLE `%s` CHANGE `day` `day` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL""" % (
                name)
            self.cursor.execute(sql)
            sql = """ALTER TABLE `%s` CHANGE `time` `time` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL""" % (name)
            self.cursor.execute(sql)
        except:
            print()
        now_time = name

    def insert_undivide(self, temp):
        global now_time

        # print(now_time)
        sql = """INSERT INTO `%s` (vdid, day, time, lane_1_speed, lane_1_laneoccupy, lane_1_volume, lane_2_speed, lane_2_laneoccupy, lane_2_volume, lane_3_speed, lane_3_laneoccupy, lane_3_volume, lane_4_speed, lane_4_laneoccupy, lane_4_volume, lane_5_speed, lane_5_laneoccupy, lane_5_volume, lane_6_speed, lane_6_laneoccupy, lane_6_volume, total_speed, total_laneoccupy, total_volume) VALUES %s"""%(now_time, temp)
        # val = temp
        try:
            # print(temp)
            self.connection.ping(reconnect=True)
            self.cursor.execute(sql)
            self.connection.commit()
        except Exception as e:
            print(e)
            self.connect()
            self.connection.rollback()

    def exit(self):
        self.connection.close()

