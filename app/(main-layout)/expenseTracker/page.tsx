import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import AddTransaction from '@/components/_AddTransaction';
import Balance from '@/components/_Balance';
import IncomeExpense from '@/components/_IncomeExpense';
import TransactionList from '@/components/_TransactionList';

const ExpenseTracker = async () => {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }
  return (
    <main>
      <h2>Welcome, {user.firstName} </h2>
      <Balance />
      <IncomeExpense />
      <AddTransaction />
      <TransactionList />
    </main>
  );
};

export default ExpenseTracker;
