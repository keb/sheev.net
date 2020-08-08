exports.handler = function(event, context, callback) {
    console.log(event);
    console.log(context);
    console.log(callback);

    callback(null, {
        statusCode: 200,
        body: 'hello world'
    });
};