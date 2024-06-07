function classifyWindSpeed(speed) {
    if (speed <= 1.5) {
      return 'assente';
    } else if (speed <= 5.5) {
      return 'moderato';
    } else {
      return 'forte';
    }
  }
  

  module.exports = classifyWindSpeed;