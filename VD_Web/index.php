<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>


        <link rel="stylesheet" href="https://apps.bdimg.com/libs/jqueryui/1.10.4/css/jquery-ui.min.css">
        <script src="https://apps.bdimg.com/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="https://apps.bdimg.com/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>

        <!-- Additional files for the Highslide popup effect -->
        <!-- <script src="https://www.highcharts.com/media/com_demo/js/highslide-full.min.js"></script>
        <script src="https://www.highcharts.com/media/com_demo/js/highslide.config.js" charset="utf-8"></script> -->
        <!-- <link rel="stylesheet" type="text/css" href="https://www.highcharts.com/media/com_demo/css/highslide.css" /> -->
        <!-- <script type="text/javascript" language="javascript" src="./js/highchart.js" charset="utf-8"></script> -->
        <script type="text/javascript" language="javascript" src="./js/button.js" charset="utf-8"></script>
        <script type="text/javascript" language="javascript" src="./js/control.js" charset="utf-8"></script>
        <link rel="stylesheet" href="./css/bootstrap.css" type="text/css">
        <link rel="stylesheet" href="./css/index.css" type="text/css">
    </head>

    <body>
        <nav class="navbar navbar-dark bg-dark">
            <span class="navbar-text font">
                <a href='index.php'>VD資料檢索</a>
            </span>
        </nav>
        <div class="container">
            <div class="row">
                <div class="col-6 costom">
                    <div id="leftbox">
                        <nav class="navbar navbar-light color-left">
                                <span class="navbar-text font">VD篩選</span>
                        </nav>
                        <p class = "font">日期選擇：<input type="text" id="datepicker_start">至<input type="text" id="datepicker_end"></p>
                        <div id="rightdown">
                            <?php include 'getmysql.php';?>
                        </div>
                        
                        <div id="box">
                            <button  type="button" class="btn btn-outline-success font-color" id="download" >下載資料</button>
                        </div>
                    </div>
                </div>
                <div class="col-6 costom">
                    <div id = "rightbox">
                        <nav class="navbar navbar-light color-right">
                                <span class="navbar-text font">條件搜尋</span>
                        </nav>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text font">速率小於</span>
                            </div>
                            <input type="text" class="form-control" id="speed_small" aria-label="Amount (to the nearest dollar)">
                            <div class="input-group-append">
                                <span class="input-group-text font">以下</span>
                            </div>
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text font">在</span>
                            </div>
                            <input type="text" class="form-control" id="time_limit" aria-label="Amount (to the nearest dollar)">
                                <select class="Time">
                                　<option value="Minute">分鐘</option>
                                　<option value="Hour">小時</option>
                                </select>
                            <div class="input-group-append">
                                <span class="input-group-text font">內，速率下降</span>
                            </div>
                            <input type="text" class="form-control" id="speed_big" aria-label="Amount (to the nearest dollar)">
                            <div class="input-group-append">
                                    <span class="input-group-text font">以上</span>
                            </div>
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text font">在</span>
                            </div>
                            <input type="text" class="form-control" id="time2_limit" aria-label="Amount (to the nearest dollar)">
                            <select class="Time1">
                                　<option value="Minute">分鐘</option>
                                　<option value="Hour">小時</option>
                                </select>
                            <div class="input-group-append">
                                <span class="input-group-text font">內，流率上升原流率的</span>
                            </div>
                            <input type="text" class="form-control" id="laneoccupy_big" aria-label="Amount (to the nearest dollar)">
                            <div class="input-group-append">
                                    <span class="input-group-text font">倍以上</span>
                            </div>
                        </div>
                        <div id="box">
                            <button type="button" class="btn btn-outline-dark font" id="reset">清除</button>
                            <button type="button" class="btn btn-outline-info font-color" id="success">輸出圖檔</button>
                            <button type="button" class="btn btn-outline-warning font-color" id="error">下載異常值</button> 
                        </div>
                    </div>
                </div>
                
                <!-- <div id="container" style="width: 100%; height: 100%; margin: 0 auto;float:right;"></div> -->
                <!-- <ol id="space">
                </ol> -->
                <!-- <div id="container1" style="width: 100%; height: 100%; margin: 0 auto;float:right;"></div> -->
            </div>
        </div>
    </body>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
</html>

    
