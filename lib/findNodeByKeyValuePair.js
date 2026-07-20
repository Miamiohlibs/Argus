export function findNodeByKeyValuePair(tree, targetKey, targetValue) {
  // Base case: check if current item is a valid object
  if (tree === null || typeof tree !== 'object') {
    return null;
  }

  // Check if current level has the target key and matching value
  if (tree[targetKey] === targetValue) {
    return tree;
  }

  // Handle arrays by iterating through elements
  if (Array.isArray(tree)) {
    for (const element of tree) {
      const result = findNodeByKeyValuePair(element, targetKey, targetValue);
      if (result) return result;
    }
  } else {
    // Handle objects by iterating through keys using Object.values()
    for (const value of Object.values(tree)) {
      const result = findNodeByKeyValuePair(value, targetKey, targetValue);
      if (result) return result;
    }
  }

  return null;
}
