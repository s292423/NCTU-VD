# -*- coding: utf8 -*-
from lxml import etree
import requests, threading
import datetime
import math
import xml.etree.ElementTree as ET
import gzip
from io import BytesIO
from decimal import getcontext, Decimal
import numpy as np
import time
import socket
from dbconnect_for_new import connectDB

#要抓的時間區段
EndDate = '20180101'
StartDate = '20180101'
# end_date = ''
# minute_time = ''
end_min = '0002'
str_min = '0000'
vd = []


def parseXML(tree, temp):

    while True:
        try:
            for infos in tree:
                for info in infos:
                    undivided_total_speed = 0
                    undivide_total_laneoccupy = 0
                    undivided_total_volume = 0
                    data = []
                    cnt = 0

                    data.append(info.attrib["vdid"])
                    date = datetime.datetime.strptime(info.attrib["datacollecttime"], '%Y/%m/%d %H:%M:%S')
                    data.append(str(date.date()))
                    data.append(str(date.time()))
                    # data.append(info.attrib["datacollecttime"])
                    for lane in info:
                        total_volume = 0
                        now_speed = int(lane.attrib["speed"])
                        now_laneoccupy = int(lane.attrib["laneoccupy"])
                        if now_speed < 0:
                            now_speed = 0
                            now_laneoccupy = 0
                        data.append(now_speed)
                        data.append(now_laneoccupy)
                        for cars in lane:
                            now_volume = int(cars.attrib["volume"])
                            if now_volume >= 0:
                                undivided_total_speed += now_speed * int(cars.attrib["volume"])
                                undivide_total_laneoccupy += now_laneoccupy * int(cars.attrib["volume"])
                                undivided_total_volume += now_volume
                                total_volume += now_volume
                        data.append(total_volume)
                        cnt += 1
                    while cnt != 6:
                        data.append(0)
                        data.append(0)
                        data.append(0)
                        cnt += 1
                    if undivided_total_volume > 0:
                        undivided_total_speed = undivided_total_speed / undivided_total_volume
                        undivide_total_laneoccupy = undivide_total_laneoccupy / undivided_total_volume
                    data.append(undivided_total_speed)
                    data.append(undivide_total_laneoccupy)
                    data.append(undivided_total_volume)
                    temp.setdefault(info.attrib["vdid"], []).append(tuple(data))
        except Exception as e:
            print(e)
            continue
        break
    return temp


def insertzero(end_date, minutemen, temp, vd):
    day = datetime.datetime.strptime(end_date, '%Y%m%d')
    time = datetime.datetime.strptime(minutemen, '%H%M')
    for i in vd:
        data = []
        cnt = 0
        data.append(i)
        data.append(str(day.date()))
        data.append(str(time.time()))
        while cnt != 6:
            data.append(0)
            data.append(0)
            data.append(0)
            cnt += 1
        data.append(0)
        data.append(0)
        data.append(0)
        temp.setdefault(i, []).append(tuple(data))
        cnt = 0
    # print(temp)
    return temp


def UpAndInsert(x, createmonth, temp):
    # print(temp)
    for i in temp:
        result = x.query_table_for_show()
        # print(result)
        t = str(createmonth) + "-" + str(i)
        if t not in result:
            # print(t)
            x.create(t)
            data = temp.get(str(i))
            data = str(data)[1:-1]
            x.insert_undivide(data)
        else:
            x.getcode(t)
            data = temp.get(str(i))
            data = str(data)[1:-1]
            # print(i)
            x.insert_undivide(data)
    print('--------success insert--------')


def TimeToSearch():

    global EndDate, StartDate, str_min, end_min
        # , end_date, minute_time

    StartDate = datetime.datetime.strptime(StartDate, "%Y%m%d")
    EndDate = datetime.datetime.strptime(EndDate, "%Y%m%d")
    substract_time_day = EndDate - StartDate + datetime.timedelta(1)
    total_days = math.floor((substract_time_day.total_seconds() / 86400))

    # 處理小時
    EndTime = datetime.datetime.strptime(end_min, "%H%M")
    StartTime = datetime.datetime.strptime(str_min, "%H%M")
    substract_time = EndTime - StartTime + datetime.timedelta(minutes=1)
    total_minutes = math.floor((substract_time.total_seconds() / 60))

    return total_days, total_minutes, StartTime


def main():

    x = connectDB()
    time_data = TimeToSearch()

    for day in range(0, time_data[0]):
        temp = {}
        count = 0
        end_date = StartDate + datetime.timedelta(day)
        createmonth = end_date.strftime("%Y-%m")
        end_date = end_date.strftime("%Y%m%d")
        print(end_date)
        for minute in range(0, time_data[1]):
            # print(minute)
            minutemen = time_data[2] + datetime.timedelta(minutes=minute)
            minutemen = minutemen.strftime("%H%M")
            while True:
                try:
                    headers = {'user-agent': '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'}
                    result = requests.get("http://tisvcloud.freeway.gov.tw/history/vd/" + str(end_date) + "/vd_value_" + str(minutemen) + ".xml.gz", headers=headers)
                    result.encoding = 'utf8'
                    sitemap = gzip.GzipFile(fileobj=BytesIO(result.content))
                    root = ET.parse(sitemap)
                    tree = root.getroot()
                    temp = parseXML(tree, temp)
                    vd = list(temp.keys())
                    result.close()
                except Exception as e:
                    if count < 5:
                        count += 1
                        print(e)
                        print('---------------------------------------' + end_date + " " + minutemen)
                        continue
                    else:
                        temp = insertzero(end_date, minutemen, temp, vd)
                        count = 0
                        break
                break
        print(temp)
        UpAndInsert(x, createmonth, temp)
        time.sleep(1)

    x.exit()


if __name__ == "__main__":
    main()
