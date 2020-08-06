$( document ).ready(function() {

    var selected = [];
    var final = [];
    var complete = {
        first: false,
        second: false,
        third: false,
        first_value: false,
        second_value: false,
        third_value: false
    };

    // $("#datepicker_start").datepicker({
    //     "dateFormat":"yy-mm-dd",
    //     minDate:'2018-1-1',
    //     maxDate:"2018-12-31"
    // });

    // $("#datepicker_end").datepicker({
    //     "dateFormat":"yy-mm-dd",
    //     minDate:document.getElementById('datepicker_start').value,
    //     maxDate:"2018-12-31"
    // });

    from = $("#datepicker_start").datepicker({
        dateFormat: "yy-mm-dd",
        defaultDate: "2018-1-1",
        minDate:'2018-1-1',
        maxDate:"2018-12-31",
        changeMonth: true,
        numberOfMonths: 1
      }).on( "change", function() {
        to.datepicker("option", "defaultDate", getDate(this));
        to.datepicker("option", "minDate", getDate(this));
      }),
    to = $("#datepicker_end").datepicker({
        dateFormat: "yy-mm-dd",
        defaultDate: "+1w",
        minDate:'2018-1-1',
        maxDate:"2018-12-31",
        changeMonth: true,
        numberOfMonths: 1
    }).on( "change", function() {
      from.datepicker("option", "maxDate",  getDate(this));
    });
    function getDate(element) {
        var date;
        try {
          date = $.datepicker.parseDate("yy-mm-dd", element.value );
        } catch(error) {
          date = null;
        }
        return date;
    }

    document.getElementById("reset").onclick = function() {
        $("#datepicker_start").val("");
        $("#datepicker_end").val("");
        $(".form-control").val("");
        console.log("clear");
        $('.row .temp').remove();
        $('ol').remove();
        $('.custom-control-input:checkbox').removeAttr('checked');
        complete.first_value = false;
        complete.second_value = false;
        complete.third_value = false;
        selected = [];
    };

    document.getElementById("success").onclick = function() {
        datepicker_start = document.getElementById('datepicker_start').value
        datepicker_end = document.getElementById('datepicker_end').value
        speed_small = document.getElementById('speed_small').value
        time_limit = document.getElementById('time_limit').value
        speed_big = document.getElementById('speed_big').value
        time2_limit = document.getElementById('time2_limit').value
        laneoccupy_big = document.getElementById('laneoccupy_big').value
        selectedTime = $( ".Time option:selected" ).text()
        selectedTime1 = $( ".Time1 option:selected" ).text()

        complete.first = true;
        complete.third = true;
        complete.first_value = [datepicker_start,datepicker_end];
        complete.third_value = [speed_small,time_limit,selectedTime,speed_big,time2_limit,selectedTime1,laneoccupy_big];
        allDone();
    };

    document.getElementById("error").onclick = function() {
        console.log(final)
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob(["\ufeff",Convert(final)], {type: 'text/csv;'});
        console.log(blob);
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'error.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    document.getElementById("download").onclick = function() {
        datepicker_start = document.getElementById('datepicker_start').value
        datepicker_end = document.getElementById('datepicker_end').value
        complete.first = true;
        complete.first_value = [datepicker_start,datepicker_end];
        allDone();
    };

    $('.custom-control-input').on('change',function() {
        if($('.custom-control-input:checked').length > 5) {
            this.checked = false;
        }
    });

    var selected = [];
    $('.custom-control-input:checkbox').on('click', function() {
        
        if(this.checked) {
            selected.push($(this).next('label').text());

            console.log(selected);

            complete.second = true;
            complete.second_value = selected;
            // selected = [];
            // allDone();
        }
        else {
            var index = selected.indexOf($(this).next('label').text());
            if (index > -1) {
                selected.splice(index, 1);
            }
        }
    });

    var allDone = function() {

        if (complete.first && complete.second && complete.third){
            console.log(complete.first_value);
            console.log(complete.second_value);
            console.log(complete.third_value);
            $.ajax({ 
                'url': 'dowandclear.php',
                'type': 'POST', 
                'data': {
                    "date":complete.first_value,
                    "vdid":complete.second_value
                }, 
                'dataType': 'text', 
                'success': function(result){ 
                    console.log("success third"); 
                    $('.row .temp').remove();
                    $('ol').remove();
                    var jsonObject = JSON.stringify(jQuery.parseJSON(result));
                    var dataset = ConvertToCSV(jsonObject);
                    console.log(dataset)
                    if(complete.second_value.length>=2){
                        temp = SplitData(dataset,complete.second_value.length);
                        console.log(temp)
                        final = []
                        final.push(['Vdid','Day','Time','Speed','Laneoccupy','Volume'])
                        for (var i=0;i<complete.second_value.length;i++){
                            createcharts(i);
                            updateFromMultiCSV(temp[i], 'container', i);
                        }
                    }else{
                        createcharts(1);
                        updateFromCSV(dataset, 'container', 1);
                    }
                    
                        
                }, 
                'error': function(){ 
                    console.log('系統異常!請重新整理再試一次!'); 
                } 
            });
            complete.third = false

        }else if (complete.first && complete.second) {
            // selected = [];
            console.log(complete.first_value);
            console.log(complete.second_value);
          
            // complete.first = false;
            // complete.second = false;
            $.ajax({ 
                'url': 'download.php',
                'type': 'POST', 
                'data': {
                    "date":complete.first_value,
                    "vdid":complete.second_value
                }, 
                'dataType': 'text', 
                'success': function(result){ 
                    console.log("success"); 
                    var jsonObject = JSON.stringify(jQuery.parseJSON( result ));
                    console.log(ConvertToCSV(jsonObject));
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    var blob = new Blob(["\ufeff",ConvertToCSV(jsonObject)], {type: 'text/csv;'});
                    console.log(blob);
                    url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = 'vd.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                }, 
                'error': function(){ 
                    console.log('系統異常!請重新整理再試一次!'); 
                } 
            }); 
         
        }
    };

    function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }
            str += line + '\r\n';
        }

        return str;
    }
    function Convert(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }
            str += line+ '\n';
        }
        return str;
    }

    function SplitData(dataset,len){

        var tArray = new Array();
        rows = dataset.split("\n");
        rows.shift();
        rows.pop();
        lon = rows.length/len;
        for(var i = 0; i<len;i++){
            tArray[i] = new Array();
            for(var j=0;j<lon;j++){
                tArray[i].push(rows[0]);
                rows.shift();
            }
        }
        return tArray
    }

    function updateFromCSV(csv, containerName, seriesNumber) {
        // $(".row").append("<div id='container" + seriesNumber + "' class = 'temp' style='width: 100%; height: 100%; margin: 0 auto;float:right;'></div>");
        $(".row").append("<ol id = 'space" + seriesNumber + "'  style='width: 100%; background-color:white; border: 1px solid #ced4da; border-radius: 0.25rem; height: 100px; overflow-y: auto; padding:5px; font-family: \'Microsoft JhengHei\';'></ol>")
        // createcharts(seriesNumber)
        chart = $('#container' + seriesNumber).highcharts()
        var csv = csv
        var second_filter = {
            speed_time : 0,
            speed_flag : false,
            speed_filter : [],
            speed_queue : new Queue()
        }
        var third_filter = {
            lane_time : 0,
            lane_flag : false,
            lane_filter : [],
            lane_queue : new Queue()
        }
        var first_filter = {
            filter : [],
            flag : false
        }
        var name = []
        var speed = []
        var volume = []
        var total_speed = []
        var total_volume = []
        rows = csv.split("\n")
        eachone = rows[0].split(",");
        rows.shift();
        var temp = ""
        if(complete.third_value[1]!=""&&complete.third_value[3]!=""){
            second_filter.speed_flag = true
        }
        if(complete.third_value[4]!=""&&complete.third_value[6]!=""){
            third_filter.lane_flag = true
        }
        if(complete.third_value[0]!=""){
            first_filter.flag = true
        }
        if(complete.third_value[2]=="小時"){
            second_filter.speed_time = complete.third_value[1]*60
        }else{
            second_filter.speed_time = parseInt(complete.third_value[1])
        }
        if(complete.third_value[5]=="小時"){
            third_filter.lane_time = complete.third_value[4]*60
        }else{
            third_filter.lane_time = parseInt(complete.third_value[4])
        }

        rows.forEach(function(row, index) {
            
            var fields = row.split(",");
            if (temp==""){
                name.push(fields[1]);
                temp = fields[1];
                speed.push([fields[2]+" "+fields[3],parseFloat(fields[4])]);
                volume.push([fields[2]+" "+fields[3],parseFloat(fields[6])]);
            }else if(temp!=fields[1]){
                total_speed.push(speed);
                total_volume.push(volume);
                speed = [];
                volume = [];
                if (typeof fields[1] !== 'undefined'){
                    name.push(fields[1]);
                }
                temp = fields[1];
                speed.push([fields[2]+" "+fields[3],parseFloat(fields[4])]);
                volume.push([fields[2]+" "+fields[3],parseFloat(fields[6])]);
            }else{
                // date.push(fields[2]);
                speed.push([fields[2]+" "+fields[3],parseFloat(fields[4])]);
                volume.push([fields[2]+" "+fields[3],parseFloat(fields[6])]);
            }
            
            if (second_filter.speed_queue.size()<second_filter.speed_time-1) {
                second_filter.speed_queue.enqueue(parseFloat(fields[4]));
            }else{
                var max = second_filter.speed_queue.max()
                if(max >= parseFloat(fields[4]) + parseFloat(complete.third_value[3])){
                    second_filter.speed_filter.push(fields[0])
                    second_filter.speed_queue.dequeue();
                    second_filter.speed_queue.enqueue(parseFloat(fields[4]));
                }else{
                    second_filter.speed_queue.dequeue();
                    second_filter.speed_queue.enqueue(parseFloat(fields[4]));
                }
            }
            if (third_filter.lane_queue.size()<third_filter.lane_time-1) {
                third_filter.lane_queue.enqueue(parseFloat(fields[6]));
            }else{
                var min = third_filter.lane_queue.min()
                if(min >= parseFloat(fields[6]) * parseFloat(complete.third_value[6])){
                    third_filter.lane_filter.push(fields[0])
                    third_filter.lane_queue.dequeue();
                    third_filter.lane_queue.enqueue(parseFloat(fields[6]));
                }else{
                    third_filter.lane_queue.dequeue();
                    third_filter.lane_queue.enqueue(parseFloat(fields[6]));
                }
            }
            if (first_filter.flag){
                if(fields[4] < parseFloat(complete.third_value[0])){
                    first_filter.filter.push(fields[0])
                }
            }
        });
        final = []
        final.push(['Vdid','Day','Time','Speed','Laneoccupy','Volume'])
        if(second_filter.speed_flag&&third_filter.lane_flag&&first_filter.flag){
            var c = second_filter.speed_filter.filter(function(v){ return third_filter.lane_filter.indexOf(v) > -1 })
            c = c.filter(function(v){ return first_filter.filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(second_filter.speed_flag&&third_filter.lane_flag){
            c = second_filter.speed_filter.filter(function(v){ return third_filter.lane_filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(third_filter.lane_flag&&first_filter.flag){
            c = third_filter.lane_filter.filter(function(v){ return first_filter.filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(second_filter.speed_flag&&first_filter.flag){
            c = second_filter.speed_filter.filter(function(v){ return first_filter.filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(third_filter.lane_flag){
            var c = third_filter.lane_filter
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(second_filter.speed_flag){
            var c = second_filter.speed_filter
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(first_filter.flag){
            var c = first_filter.filter
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }

        while (chart.series.length > 0) {
            chart.series[0].remove(true);
        }
        if(total_speed.length==1){
            chart.update({
                subtitle: {
                    text: name[0]
                }
            })
            chart.addSeries({
                type: 'line',
                name: 'speed',
                data: total_speed[0],
                color: 'orange'
            });
    
            chart.addSeries({
                type: 'line',
                name: 'volume',
                data: total_volume[0],
                color: 'purple'
            });
        }
    }
    function updateFromMultiCSV(csv, containerName, seriesNumber) {
        // $(".row").append("<div id='container" + seriesNumber + "' class = 'temp' style='width: 100%; height: 100%; margin: 0 auto;float:right;'></div>");
        $(".row").append("<ol id = 'space" + seriesNumber + "'  style='width: 100%; background-color:white; border: 1px solid #ced4da; border-radius: 0.25rem; height: 100px; overflow-y: auto; padding:5px; font-family: \'Microsoft JhengHei\';'></ol>")
        // createcharts(seriesNumber)
        chart = $('#container' + seriesNumber).highcharts()
        var second_filter = {
            speed_time : 0,
            speed_flag : false,
            speed_filter : [],
            speed_queue : new Queue()
        }
        var third_filter = {
            lane_time : 0,
            lane_flag : false,
            lane_filter : [],
            lane_queue : new Queue()
        }
        var first_filter = {
            filter : [],
            flag : false
        }

        var name = []
        var speed = []
        var volume = []
        var rows = csv

        if(complete.third_value[1]!=""&&complete.third_value[3]!=""){
            second_filter.speed_flag = true
        }
        if(complete.third_value[4]!=""&&complete.third_value[6]!=""){
            third_filter.lane_flag = true
        }
        if(complete.third_value[0]!=""){
            first_filter.flag = true
        }
        if(complete.third_value[2]=="小時"){
            second_filter.speed_time = complete.third_value[1]*60
        }else{
            second_filter.speed_time = parseInt(complete.third_value[1])
        }
        if(complete.third_value[5]=="小時"){
            third_filter.lane_time = complete.third_value[4]*60
        }else{
            third_filter.lane_time = parseInt(complete.third_value[4])
        }

        rows.forEach(function(row, index) {
            // console.log(row)
            if (typeof(row) != "undefined"){

                var fields = row.split(",");

                name = fields[1]
                speed.push([fields[2]+" "+fields[3],parseFloat(fields[4])]);
                volume.push([fields[2]+" "+fields[3],parseFloat(fields[6])]);


                if (second_filter.speed_queue.size()<second_filter.speed_time-1) {
                    second_filter.speed_queue.enqueue(parseFloat(fields[4]));
                }else{
                    var max = second_filter.speed_queue.max()
                    if(max >= parseFloat(fields[4]) + parseFloat(complete.third_value[3])){
                        second_filter.speed_filter.push(fields[0])
                        second_filter.speed_queue.dequeue();
                        second_filter.speed_queue.enqueue(parseFloat(fields[4]));
                    }else{
                        second_filter.speed_queue.dequeue();
                        second_filter.speed_queue.enqueue(parseFloat(fields[4]));
                    }
                }
                if (third_filter.lane_queue.size()<third_filter.lane_time-1) {
                    third_filter.lane_queue.enqueue(parseFloat(fields[6]));
                }else{
                    var min = third_filter.lane_queue.min()
                    if(min >= parseFloat(fields[6]) * parseFloat(complete.third_value[6])){
                        third_filter.lane_filter.push(fields[0])
                        third_filter.lane_queue.dequeue();
                        third_filter.lane_queue.enqueue(parseFloat(fields[6]));
                    }else{
                        third_filter.lane_queue.dequeue();
                        third_filter.lane_queue.enqueue(parseFloat(fields[6]));
                    }
                }
                if (first_filter.flag){
                    if(fields[4] < parseFloat(complete.third_value[0])){
                        first_filter.filter.push(fields[0])
                    }
                }
             }
         });

        if(second_filter.speed_flag&&third_filter.lane_flag&&first_filter.flag){
            var c = second_filter.speed_filter.filter(function(v){ return third_filter.lane_filter.indexOf(v) > -1 })
            c = c.filter(function(v){ return first_filter.filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(second_filter.speed_flag&&third_filter.lane_flag){
            c = second_filter.speed_filter.filter(function(v){ return third_filter.lane_filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(third_filter.lane_flag&&first_filter.flag){
            c = third_filter.lane_filter.filter(function(v){ return first_filter.filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(second_filter.speed_flag&&first_filter.flag){
            c = second_filter.speed_filter.filter(function(v){ return first_filter.filter.indexOf(v) > -1 })
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(third_filter.lane_flag){
            var c = third_filter.lane_filter
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(second_filter.speed_flag){
            var c = second_filter.speed_filter
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }else if(first_filter.flag){
            var c = first_filter.filter
            
            $("#space"+seriesNumber).append("<li> 總計："+c.length+"筆<br/></li>");
 
            rows.forEach(function(row, index) {
                var fields = row.split(",");
                if(c.includes(fields[0])){
                    final.push([fields[1],fields[2],fields[3],fields[4],fields[5],fields[6]])
                    $("#space"+seriesNumber).append("<li>"+fields[1]+","+fields[2]+" "+fields[3]+","+fields[4]+","+fields[5]+","+fields[6]+"<br/></li>");
                }
            });
        }
        
        while (chart.series.length > 0) {
            chart.series[0].remove(true);
        }
        chart.update({
            subtitle: {
                text: name
            }
        })
        chart.addSeries({
            type: 'line',
            name: 'speed',
            data: speed,
            color: 'orange'
        });

        chart.addSeries({
            type: 'line',
            name: 'volume',
            data: volume,
            color: 'purple'
        }); 
    }
    function Queue() {
        let items = [];
        this.enqueue = function(element) {
            items.push(element);
        };
        this.dequeue = function() {
            return items.shift();
        };
        this.front = function() {
            return items[0];
        };
        this.isEmpty = function() {
            return items.length === 0;
        };
        this.clear = function() {
            items = [];
        };
        this.size = function() {
            return items.length;
        };
        this.print = function() {
            console.log(items.toString());
        }
        this.max = function(){
            return Math.max(...items)
        }
        this.min = function(){
            return Math.min(...items)
        }
    }

    function createcharts(seriesNumber){

        $(".row").append("<div id='container" + seriesNumber + "' class = 'temp' style='width: 100%; height: 100%; margin: 0 auto;float:right;'></div>");


        $('#container' + seriesNumber).highcharts({
            chart: {
                scrollablePlotArea: {
                    minWidth: 500
                }
            },
            title: {
                text: '流率與速率-時間圖',
                style: {
                    fontFamily:'Microsoft JhengHei' 
                }
            },
    
            data: {
              csv: null
            },
            xAxis: {
                type:'datetime',
                tickInterval: 24*60*60*1000  , // one day
                tickWidth: 0,
                gridLineWidth: 0,
                labels: {
                    align: 'center',
                    x: 0,
                    y: 10
                }
            },
                
            yAxis: [{ // left y axis
                title: {
                    text: null
                },
                labels: {
                    align: 'left',
                    x: 3,
                    y: 16,
                    format: '{value:.,0f}'
                },
                showFirstLabel: false
                }, { // right y axis
                linkedTo: 0,
                gridLineWidth: 0,
                opposite: true,
                title: {
                    text: null
                },
                labels: {
                    align: 'right',
                    x: -3,
                    y: 16,
                    format: '{value:.,0f}'
                },
                showFirstLabel: false
            }],
                
            legend: {
                align: 'left',
                verticalAlign: 'top',
                borderWidth: 0
            },   
            tooltip: {
                shared: true,
                crosshairs: true
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                    events: {
                        click: function(e) {
                        hs.htmlExpand(null, {
                            pageOrigin: {
                            x: e.pageX || e.clientX,
                            y: e.pageY || e.clientY
                            },
                            headingText: this.series.name,
                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                            this.y + ' sessions',
                            width: 200
                        });
                        }
                    }
                    },
                    marker: {
                    lineWidth: 1
                    },
                    turboThreshold: 0,
                    lineWidth: 1,
                },
            },
            series: []
        });
    }
})
    