import type { ItemEntry } from '@prisma/client';

const SlipItemsInfo = ({ item }: { item: ItemEntry }) => {
  return <li>{item.description ?? ''}</li>;
};

export default SlipItemsInfo;
