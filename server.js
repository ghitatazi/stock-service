var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var stocks = [];

var next = (function () {
  function nextValue (prev) {
    var r = 2 * Math.random () - 1;
    return prev * (1 + 0.8 * Math.pow (r, 5));
  }

  var prev = {
    index: 0,
    timestamp: new Date ().getTime(),
    stocks: {
      NASDAQ: 15.0,
      CAC40: 145.0
    }
  };

  return function () {
    return prev = {
      timestamp: new Date ().getTime(),
      index: prev.index + 1,
      stocks: Object.keys (prev.stocks).reduce (function (result, key) {
        result[key] = nextValue(prev.stocks[key]);
        return result;
      }, {})
    };
  }
})();

setInterval(function () {
  stocks.push (next ());
}, 1000);

function tail (count) {
  if (count <= 0)
    return stocks;

  if (stocks.length <= count)
    return stocks;

  return stocks.slice (-count);
}

app.get('/api/stocks', function(req, res) {
  res.status(200);
  res.set('Content-Type', 'application/json');
  var count = req.query.count ? req.query.count - 0 : 0;
  res.send(JSON.stringify(tail (count)));
});

app.get('/', function(req, res) {
  // load the single view file (angular will handle the page changes on the front-end)
  res.sendfile('./public/index.html');
});

app.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");

