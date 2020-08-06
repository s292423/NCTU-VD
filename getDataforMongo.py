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
from MongoDBConnect import MongoDBConnect

#要抓的時間區段
EndDate = '20181130'
StartDate = '20181101'
end_date = ''
minute_time = ''

def parseXML(tree, x):

    temp = []

    while True:
        try:
            # sitemap = gzip.GzipFile(fileobj=BytesIO(url.content))
            # root = ET.parse(sitemap)
            # tree = root.getroot()

            for infos in tree:
                Infos = infos

                for info in Infos:
                    undivide_total_speed = 0
                    undivide_total_laneoccupy = 0
                    undivide_total_volume = 0

                    for lane in info:
                        # divide_total_volume = 0
                        now_speed = int(lane.attrib["speed"])
                        now_laneoccupy = int(lane.attrib["laneoccupy"])

                        for cars in lane:
                            # divide_total_volume += int(cars.attrib["volume"])
                            undivide_total_speed += now_speed * int(cars.attrib["volume"])
                            undivide_total_laneoccupy += now_laneoccupy * int(cars.attrib["volume"])
                            undivide_total_volume += int(cars.attrib["volume"])

                    if undivide_total_volume != 0:
                        undivide_total_speed = Decimal(undivide_total_speed / undivide_total_volume).quantize(Decimal('0.00'))
                        undivide_total_laneoccupy = Decimal((undivide_total_laneoccupy / undivide_total_volume) / 1.21).quantize(Decimal('0.00'))

                    datacollecttime = datetime.datetime.strptime(info.attrib["datacollecttime"], "%Y/%m/%d %H:%M:%S")
                    datacollecttime = datacollecttime.strftime("%Y-%m-%d %H:%M:%S")

                    # 不分車道
                    undivide_total_volume = undivide_total_volume*60
                    temp.append({"vdid": info.attrib["vdid"],
                                 "datacollecttime": datacollecttime,
                                 "speed": float(undivide_total_speed),
                                 "laneoccupy": float(undivide_total_laneoccupy),
                                 "volume": undivide_total_volume})
            print("^___^")
            # temp = tuple(temp)
            # temp = str(temp)
            # temp = temp[1:-1]
            x.insertData("OneYear","unDivide",temp)
        except Exception as e:
            print(e)
            print('----------------------------------------------------------------------------' + end_date + " " + minute_time)
            continue
        break


def main():

    global EndDate,StartDate,end_date,minute_time
    count = 0

    socket.setdefaulttimeout(20)
    x = MongoDBConnect()
    # 處理日期
    StartDate = datetime.datetime.strptime(StartDate, "%Y%m%d")
    EndDate = datetime.datetime.strptime(EndDate, "%Y%m%d")
    substract_time_day = EndDate - StartDate + datetime.timedelta(1)
    total_days = math.floor((substract_time_day.total_seconds() / 86400))

    # 處理小時
    EndTime = datetime.datetime.strptime('2359', "%H%M")
    StartTime = datetime.datetime.strptime('0000', "%H%M")
    substract_time = EndTime - StartTime + datetime.timedelta(minutes=1)
    total_minutes = math.floor((substract_time.total_seconds() / 60))
    print(total_minutes)

    for day in range(0, total_days):
        end_date = StartDate + datetime.timedelta(day)
        end_date = end_date.strftime("%Y%m%d")
        end_date = str(end_date)
        print(end_date)
        for minute in range(0, total_minutes):
            minute_time = StartTime + datetime.timedelta(minutes=minute)
            minute_time = minute_time.strftime("%H%M")
            minute_time = str(minute_time)
            while True:
                try:
                    headers = {'user-agent': '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'}
                    result = requests.get("http://tisvcloud.freeway.gov.tw/history/vd/" + end_date + "/vd_value_" + minute_time + ".xml.gz", headers=headers)
                    result.encoding = 'utf8'
                    # jsonData +=\
                    sitemap = gzip.GzipFile(fileobj=BytesIO(result.content))
                    root = ET.parse(sitemap)
                    tree = root.getroot()

                    parseXML(tree, x)
                    result.close()
                except Exception as e:
                    if count < 5:
                        count += 1
                        print(e)
                        print('----------------------------------------------------------------------------' + end_date + " " + minute_time)
                        continue
                    else:
                        count = 0
                        break
                break
        time.sleep(1)
        count = 0


if __name__ == "__main__":
    main()
    # print(temp)
