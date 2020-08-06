var cnt = 0
var limit = 5
var a = [13,24,34,57,62,74,70,0,4,34,5,6,5,2,54,3,22,45]
queue = new Queue();
queue1 = new Queue();
a.forEach(function(row, index) {
    if (queue.size()<limit-1) {
        queue.enqueue(row);
    }else{
        var max = queue.max()
        if(max >= row+10){
            console.log(row)
            queue.dequeue();
            queue.enqueue(row);
        }else{
            queue.dequeue();
            queue.enqueue(row);
        }
    }
})
queue.print()
queue1.print()

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