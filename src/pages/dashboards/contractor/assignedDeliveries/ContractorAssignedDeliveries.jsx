import AssignedDeliveries from '../../driver/assignDeliveris/AssignedDeliveries';

// Same APIs as driver dashboard:
// GET /api/driver/deliveries?status=ALLOCATED
// POST /api/driver/deliveries/:id/respond
// POST /api/driver/deliveries/:id/upload-proof
// POST /api/driver/deliveries/:id/complete
const ContractorAssignedDeliveries = () => <AssignedDeliveries />;

export default ContractorAssignedDeliveries;
