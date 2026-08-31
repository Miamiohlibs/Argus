interface HasKeyValueMatch {
  key: string;
  value: unknown;
}

interface FindChildrenOptions {
  /** Return children whose [key] === value */
  hasKeyValue: HasKeyValueMatch;
  /** If true, search all descendant .children, not just the immediate ones. Default false. */
  recursive?: boolean;
}

interface TreeLike {
  children?: any[];
  [key: string]: any;
}

/**
 * Search the .children of a tree-shaped object for entries matching a key/value pair.
 *
 * Usage:
 *    findChildren({ hasKeyValue: { key: 'level', value: 'series' } }, object)
 *    findChildren({ hasKeyValue: { key: 'level', value: 'series' }, recursive: true }, object)
 */
export default function findChildren(
  options: FindChildrenOptions,
  object: TreeLike,
): any[] {
  const { hasKeyValue, recursive = false } = options;
  const children = object?.children ?? [];

  const matches = children.filter(
    (child) => child?.[hasKeyValue.key] === hasKeyValue.value,
  );

  if (!recursive) {
    return matches;
  }

  const nestedMatches = children.flatMap((child) =>
    findChildren(options, child),
  );

  return [...matches, ...nestedMatches];
}
