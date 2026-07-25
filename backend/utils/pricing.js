function calculateAmount(awb, pieces, weight) {
  pieces = Number(pieces);
  weight = Number(weight);

  if (weight <= 5) {
    if (awb.startsWith("9")) {
      return 10;
    }

    return pieces * 5;
  }

  return Math.max(
    pieces * 5,
    weight * 1.5
  );
}

module.exports = calculateAmount;