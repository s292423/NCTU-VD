document.addEventListener("DOMContentLoaded", function(event) {
   
    var complete = {
        first: false,
        second: false
    };
    
    document.getElementById('download').disabled = true;
   
    $('#datepicker_start').on('change', function() {
        complete.first = true;
        allDone();
    });

    $('#datepicker_end').on('change', function() {
        complete.second = true;
        allDone();
    });

    var allDone = function() {
        if (complete.first && complete.second) {
            // selected = [];
            if($('#datepicker_start').val().length!=0 && $('#datepicker_end').val().length!=0){
                document.getElementById('download').disabled = false; 
            }else{
                document.getElementById('download').disabled = true; 
            }
        }
    };
});