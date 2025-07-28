'use server';

interface TransactionData {
    text: string;
    amount: number; 
}

interface TransactionResult {
    data?: TransactionData,
    error?: string
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
    const textValue = formData.get('text')
    const amountValue = formData.get('amount')

    // check for input values
    if (!textValue || textValue === '' || !amountValue) {
        return {error: 'Description or amount is missing'};
    }

    const text: string = textValue.toString(); // ensure text is a string
    const amount: number = parseFloat(amountValue.toString()); // parse amount as number

    const transactionData: TransactionData = { 
        text, 
        amount
    };

    return {data: transactionData}
}

export default addTransaction;