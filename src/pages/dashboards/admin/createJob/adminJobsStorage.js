const STORAGE_KEY = 'admin_created_jobs';

export const getAdminCreatedJobs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveAdminCreatedJob = (formData) => {
  const job = {
    id: `admin-job-${Date.now()}`,
    spoNumber: formData.spoNumber,
    deliveryDate: formData.date,
    timeSlot: formData.timeSlot,
    weight: formData.weight,
    address: formData.address,
    customer: formData.customerName,
    phone: formData.phone,
    requestedBy: formData.requestedBy,
    instructions: formData.instructions || '',
    status: 'Received',
    driver: null,
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  };

  const existing = getAdminCreatedJobs();
  const next = [job, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return job;
};

export const deleteAdminCreatedJob = (jobId) => {
  const next = getAdminCreatedJobs().filter((job) => job.id !== jobId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};
