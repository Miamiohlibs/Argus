import { Transaction } from '@/types/Transaction';
import { addCommas } from '@/lib/utils';
import { toast } from 'react-toastify';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  return (
    <li className={transaction.amount < 0 ? 'minus' : 'plus'}>
      {transaction.text}
      <span>{addCommas(Math.abs(transaction.amount))}</span>
    </li>
  );
};

export default TransactionItem;
