const HoldingEntry = ({ holdings }: { holdings: any[] }) => {
  return (
    <div>
      {holdings.map((holding) => (
        <div key={holding.holding_id}>
          <p>
            {holding.library.desc} &mdash; {holding.location.desc} (
            {holding.location.value})
          </p>
          <p>Call Number: {holding.call_number}</p>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {holding.itemDetails && holding.itemDetails.item ? (
              holding.itemDetails.item.map((item: any) => (
                <li key={item.item_id}>Item: {item.item_data.description}</li>
              ))
            ) : (
              <li>No items found</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HoldingEntry;
