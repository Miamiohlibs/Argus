'use client';

import addTransaction from '@/app/actions/addTransaction';

const AddTransaction = () => {
  const clientAction = async (formData: FormData) => {
    // console.log(formData.get('text'), formData.get('amount'));
    const { data, error } = await addTransaction(formData);

    if (error) {
      alert(error);
    } else {
      alert('Transaction added');
      console.log(data);
    }
  };

  return (
    <>
      <h3>Add transaction</h3>
      <form action={clientAction}>
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <input
            type="text"
            id="text"
            name="text"
            placeholder="Enter text..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Amount <br />
            (negative = expense, positive = income)
          </label>
          <input
            type="number"
            className="amount"
            id="amount"
            name="amount"
            placeholder="Enter amount..."
            step="0.01"
          />
        </div>
        <button className="btn">Add Transaction</button>
      </form>
    </>
  );
};

export default AddTransaction;
