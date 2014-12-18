var f = function(n) {
    var p0 = 0, p1 = 1, rst = 1;

    for (var i = 2; i <= n; i++) {
        rst = p0 + p1;
        p0 = p1;
        p1 = rst;           
    }
    
   return rst;
};

var f0 = function(n) {
    var p0 = 0, p1 = 1, rst = 1;

    for (var i = 2; i <= n; p0 = p1, p1 = rst, i++) {
        rst = p0 + p1;
    }
    
   return rst;
};


var f1 = function(n){
    var arr = [0, 1], rst = 1;

    for (var i = 2; i <= n; i++) {
        rst = arr[0] + arr[1];
        arr[0] = arr[1];
        arr[1] = rst;
    }
    
   return rst;
};

var f2 = function(n){
    var arr = [0, 1], rst = 1;

    for (var i = 2; i <= n; i++) {
        rst = arr[arr.length-2] + arr[arr.length-1];
        arr[arr.length] = rst;
    }

    return rst;
};

var f3 = function(n){
    var rst = [0,1];

    for (var i = 2; i <= n; i++) {
        rst[i] = rst[i-2] + rst[i-1];
    }

    return rst[n];
};
