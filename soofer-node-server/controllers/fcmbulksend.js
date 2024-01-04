
var child_process = require('child_process');

/**
 * Send to this array
 * @param {Array} docs 
 */
function sendFCMtothisLists(docs) { 
 
  let total = 0;
  docs.forEach(function (element) {
    // console.log(element.fcmId);
    GFunctions.sendFCMMsg(element.fcmId);
    total++;
  }); 
  return total;
}

process.on('message', (msg) => {
  const total = sendFCMtothisLists();
  process.send(total);
});