const CompletedDeliveriesHeader = ({ count }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Completed Deliveries</h1>
      <p className="mt-2 text-gray-600">
        View your delivery history ({count} completed) — dummy data
      </p>
    </div>
  );
};

export default CompletedDeliveriesHeader;
