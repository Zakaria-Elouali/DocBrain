function zip(...arrays) {
  return arrays[0].map((_, i) => {
    return arrays.map((array) => array[i]);
  });
}

export default zip;
