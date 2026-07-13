const AssignedDeliveriesHeader = ({ count }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Assigned Deliveries</h1>
      <p className="mt-2 text-gray-600">
        Jobs allocated to you ({count} assigned) — dummy data
      </p>
    </div>
  );
};

export default AssignedDeliveriesHeader;
