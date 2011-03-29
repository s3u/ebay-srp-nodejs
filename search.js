var sys = require('sys');
var http = require('http');
var formatter = require('lib/formatter');

var app = require('express').createServer();
app.register('.html', require('ejs'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

function render(req, res, results) {
  var skipRender = req.param('_skiprender');
  if("true" == skipRender) {
    res.writeHead(200);
    res.end();
  }
  else {
    res.render('index.ejs', {
      searchTerm: req.param('_nkw'),
      title: 'My Site',
      searchUrl : '/',
      results : results,
      formatter: formatter,
      getVal : function(name) {
        return formatter.getValue(results, name);
      }
    });
  }
}

app.get('/', function(req, res) {
  if(req.param('_nkw')) {
    // TODO: Sanitize
    var path = '/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&' +
      'SERVICE-VERSION=1.8.0&SECURITY-APPNAME=Foobat96e-1d23-4ae7-8e15-e5874c9cd58&' +
      'RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&' +
      'keywords=' + req.param('_nkw') + '&paginationInput.entriesPerPage=50&' +
      'outputSelector%280%29=SellerInfo&outputSelector%281%29=CategoryHistogram';

    var useProxy = true;
    var host = useProxy ? 'localhost' : 'svcs.ebay.com';
    var port = useProxy ? 8080 : 80;
    var realPath = useProxy ? 'http://svcs.ebay.com' + path : path;
    var options = {
      host: host,
      port: port,
      path: realPath
    };

    http.get(options,
      function(clientRes) {
        var body = '';
        clientRes.on('data', function (chunk) {
          body = body + chunk;
        });
        clientRes.on('end', function(chunk) {
          var results = JSON.parse(body);
          render(req, res, results);
        });
      }
      ).
      on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }
  else {
    render(req, res, null);
  }
});

// Start a cluster
// app.listen(3000);
var cluster = require('cluster');
cluster(app)
    .use(cluster.logger('logs'))
    .use(cluster.stats())
    .use(cluster.pidfiles('pids'))
    .use(cluster.cli())
    .use(cluster.repl(8888))
    .listen(3000);

