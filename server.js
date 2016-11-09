var express = require('express');
var app = express();

app.use('/', express.static('.'));
app.listen(process.env.PORT || 8000, function() {
    console.log('listening on port ' + process.env.PORT || 8000);
});
