$( document ).ready(function() {
    var selected = [];
    var complete = {
        first: false,
        second: false,
        first_value: false,
        second_value: false
    };
    // datetimepicker for leftbox
    $("#datepicker_start").datepicker({
        "dateFormat":"yy-mm-dd",
    });
    $("#datepicker_end").datepicker({
        "dateFormat":"yy-mm-dd",
    });
    // clear button for leftbox
    // $("#box").find('#reset').click(function(){
    //     $("#datepicker_start").val("");
    //     $("#datepicker_end").val("");
    //     $(".form-control").val("");
    //     console.log("clear")
    // });
    document.getElementById("reset").onclick = function() {
        $("#datepicker_start").val("");
        $("#datepicker_end").val("");
        $(".form-control").val("");
        console.log("clear");
    };
    document.getElementById("success").onclick = function() {
        speed_small = document.getElementById('speed_small').value
        datepicker_start = document.getElementById('datepicker_start').value
        datepicker_end = document.getElementById('datepicker_end').value
        time_limit = document.getElementById('time_limit').value
        speed_big = document.getElementById('speed_big').value
        time2_limit = document.getElementById('time2_limit').value
        laneoccupy_big = document.getElementById('laneoccupy_big').value
        
        console.log(speed_small) 
        console.log(datepicker_start)
        console.log(datepicker_end)  
        console.log(time_limit)  
        console.log(speed_big)  
        console.log(time2_limit)  
        console.log(laneoccupy_big)  
        complete.second = true;
        complete.second_value = speed_small;
        allDone();
    };


    $('.custom-control-input').on('change', function() {
        if($('.custom-control-input:checked').length > 5) {
            this.checked = false;
        }
    });

    var selected = [];
    $('.custom-control-input:checkbox').on('click', function() {
        
        if(this.checked) {
            selected.push($(this).next('label').text());

            console.log(selected);

            complete.first = true;
            complete.first_value = selected;
            // selected = [];
            allDone();
        }
        else {
            var index = selected.indexOf($(this).next('label').text());
            if (index > -1) {
                selected.splice(index, 1);
            }
        }
    });


    var allDone = function() {
        if (complete.first && complete.second) {
            // selected = [];
            console.log(complete.first_value);
            console.log(complete.second_value);
          
            complete.first = false;
            complete.first_value = false;
            complete.second = false;
            complete.second_value = false;
         
        }
    };
})
// function Receive(datepicker,speed_small){
//     var MongoClient = require('mongodb').MongoClient;
//     var url = "mongodb://localhost:27017/";
    
//     MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("OneYear");
//         var whereStr = {"datacollecttime": new RegExp(datepicker),"speed": {$lt : speed_small}};  // 查询条件
//         dbo.collection("unDivide").find(whereStr).toArray(function(err, result) {
//             if (err) throw err;
//             console.log(result);
//             db.close();
//         });
//     });
// }