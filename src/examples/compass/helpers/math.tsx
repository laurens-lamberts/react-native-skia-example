export const getAverage = (array: number[]) => {
  var sum = 0;
  for (var number of array) {
    sum += number;
  }
  return sum / array.length;
};
