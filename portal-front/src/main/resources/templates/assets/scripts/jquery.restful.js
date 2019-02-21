$.extend({
    'put': function (url, data, callback) {
        return $.ajax({
            type: "PUT",
            url: url,
            data: data,
            dataType: "json",
            success: callback
        });
    },
    'delete': function (url, data, callback) {
        return $.ajax({
            type: "DELETE",
            url: url,
            data: data,
            dataType: "json",
            success: callback
        });
    },
    'head':function(url, data, callback){
        return $.ajax({
            type: "HEAD",
            url: url,
            data: data,
            success: callback
        });
    }
})