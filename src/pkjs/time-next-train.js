// hack to allow testing with nodejs...
var moment;
try {
  moment = require('pebblejs/vendor/moment');
} catch (e) {
  moment = _moment;
}

function computeNextTrainWaitInMinutes(nextTrainMoment, now) {
  const nextTrainMs = nextTrainMoment.valueOf() - now.valueOf();
  return Math.floor(moment.duration(nextTrainMs).asMinutes());
}


function nextTrain(time) {
  if (!time) {
    return 0;
  }
  const now = moment();
  var nextTrainMoment = moment(time, 'HH:mm');
// if we have a date in the past, we have the hour of a next day train

  if (computeNextTrainWaitInMinutes(nextTrainMoment, now) < -5) {
    nextTrainMoment = nextTrainMoment.add(1, 'days');
  }
  var nextTrainMinutes = computeNextTrainWaitInMinutes(nextTrainMoment, now);
  if (nextTrainMinutes < 0) {
    nextTrainMinutes = 0;
  }

  return nextTrainMinutes;
}

module.exports = nextTrain;
