import { describe, it, expect } from 'vitest';
import findChildren from '../../lib/findChildren';
import tree from './sample-data/smith-tree.json';
import series1 from './sample-data/smith-series1.json';
import subseries2 from './sample-data/smith-subseries2.json';

const exTree = tree._resolved;
const exSeries1 = series1;
const exSubseries2 = subseries2;

// smith tree, expect:
// series: 2 (direct children)
// subseries: 2 (nested inside series, needs recursive)
// items: 9 (nested at various depths, needs recursive)

// smith-series1, expect:
// subseries: 2 (direct children)
// items: 7 (nested inside subseries, needs recursive)

// smith-subseries2, expect:
// subseries: 0 (direct children)
// items: 2 (direct children)

describe('findChildren -- hasKeyValue', () => {
  it('should find 2 series in exTree', () => {
    const response = findChildren(
      { hasKeyValue: { key: 'level', value: 'series' } },
      exTree,
    );
    expect(response.length).toBe(2);
  });

  it('should find 2 subseries in exTree', () => {
    const response = findChildren(
      { hasKeyValue: { key: 'level', value: 'subseries' }, recursive: true },
      exTree,
    );
    expect(response.length).toBe(2);
  });

  it('should find 9 items in exTree', () => {
    const response = findChildren(
      { hasKeyValue: { key: 'level', value: 'item' }, recursive: true },
      exTree,
    );
    expect(response.length).toBe(9);
  });

  it('should find 2 subseries in exSeries1', () => {
    const response = findChildren(
      { hasKeyValue: { key: 'level', value: 'subseries' } },
      exSeries1,
    );
    expect(response.length).toBe(2);
  });

  it('should find 7 items in exSeries1', () => {
    const response = findChildren(
      { hasKeyValue: { key: 'level', value: 'item' }, recursive: true },
      exSeries1,
    );
    expect(response.length).toBe(7);
  });

  it('should find 0 subseries in exSubseries2', () => {
    const response = findChildren(
      { hasKeyValue: { key: 'level', value: 'subseries' } },
      exSubseries2,
    );
    expect(response.length).toBe(0);
  });

  it('should find 2 items in exSubseries2', () => {
    const response = findChildren(
      { hasKeyValue: { key: 'level', value: 'item' } },
      exSubseries2,
    );
    expect(response.length).toBe(2);
  });
});
