// Formatting helpers

exports.getValue = getValue;
exports.getTimeLeft = getTimeLeft;

function getValue(results, name) {
  var root = results;
  if(root != null) {
    var splits = name.split('.');
    for(var i = 0; i < splits.length; i++) {
      if(root != null && root[splits[i]] != null) {
        root = root[splits[i]][0];
      }
      else {
        return '';
      }
    }
    return root;
  }
  return '';
}

function getTimeLeft(item) {
  var timeLeft = String(item.sellingStatus[0].timeLeft).match(/P(\d+)DT(\d+)H(\d+)M(\d+)S/);
  var tl = "";

  if(timeLeft[1] > 0) {
    tl = timeLeft[1] + "d";
  }

  if(timeLeft[2] > 0) {
    tl = tl + " " + timeLeft[2] + "h";
  }

  if(timeLeft[1] == 0 && timeLeft[3] > 0) {
    tl = tl + " " + timeLeft[3] + "m";
  }

  if(timeLeft[1] == 0 && timeLeft[2] == 0 && timeLeft[3] == 0) {
    tl = "<1m";
  }

  return tl;
}