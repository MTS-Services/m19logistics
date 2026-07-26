import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Settings, Briefcase, Phone, Mail, Upload, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';

const JobsView = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    coverLetter: '',
    positionOfInterest: '',
  });
  const [cv, setCv] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobCategories = [
    {
      icon: Truck,
      emoji: '🚚',
      title: 'Drivers (UK)',
      description: `At M19 Logistics, our drivers are essential to the service we provide. We're proud to have a diverse and inclusive driving team that reflects the communities we deliver to across the UK.

We value the different backgrounds, cultures, and experiences our drivers bring, and we're committed to treating everyone with fairness, respect, and support. If you're looking for a driving role where you're valued as an individual, supported on the road, and part of a reliable, professional team, we'd be pleased to hear from you.`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Settings,
      emoji: '⚙️',
      title: 'Operations (UK)',
      description: `At M19 Logistics, our operations teams keep everything running smoothly. We believe that a diverse workforce brings stronger problem-solving, better collaboration, and higher standards of service.

Our teams include people from a wide range of backgrounds and experiences, working together in a supportive and inclusive environment. If you're looking for an operations role where teamwork matters, your contribution is recognised, and there are opportunities to develop, M19 Logistics could be the right fit for you.`,
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: Briefcase,
      emoji: '🏢',
      title: 'Office & Support Roles (UK)',
      description: `At M19 Logistics, our office and support teams play a key role in delivering a reliable and customer-focused service. We're committed to creating an inclusive workplace where everyone feels respected, supported, and able to perform at their best.

We welcome people from all backgrounds and value the different skills and perspectives they bring. If you're looking for an office role within a growing logistics business that puts people first and values professionalism, we'd love to hear from you.`,
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, cv: 'Please upload a PDF or Word document' }));
      toast.error('Please upload a PDF or Word document');
      e.target.value = '';
      setCv(null);
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, cv: 'CV file must be less than 10MB' }));
      toast.error('CV file must be less than 10MB');
      e.target.value = '';
      setCv(null);
      return;
    }

    setCv(file);
    if (errors.cv) {
      setErrors((prev) => ({ ...prev, cv: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = 'Full name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9+\s()-]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.positionOfInterest.trim()) {
      newErrors.positionOfInterest = 'Please select a position of interest';
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.trim().length < 5) {
      newErrors.coverLetter = 'Cover letter must be at least 5 characters';
    } else if (formData.coverLetter.trim().length > 2000) {
      newErrors.coverLetter = 'Cover letter must be less than 2000 characters';
    }

    if (!cv) {
      newErrors.cv = 'Please upload your CV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const body = new FormData();
      body.append('fullName', formData.fullName.trim());
      body.append('email', formData.email.trim());
      body.append('phoneNumber', formData.phoneNumber.trim());
      body.append('positionOfInterest', formData.positionOfInterest);
      body.append('coverLetter', formData.coverLetter.trim());
      body.append('cv', cv);

      await axiosInstance.post('/api/jobs/apply', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Your application has been submitted successfully. We'll be in touch soon!");
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        coverLetter: '',
        positionOfInterest: '',
      });
      setCv(null);
      setErrors({});
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative flex min-h-[60vh] w-full items-center overflow-hidden bg-slate-900 pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-50"></div>
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        </div>

        <div className="relative z-10 container mx-auto w-full px-6 py-20 sm:px-8 lg:px-12">
          <div className="max-w-3xl text-left">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Join Our <span className="text-teal-400">Team</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Looking for a career where you're valued, supported, and part of something bigger?
              Explore opportunities with M19 Logistics.
            </p>
            <p className="text-lg font-semibold text-teal-400 italic">
              More than logistics — it's personal.
            </p>
          </div>
        </div>
      </div>

      {/* Job Categories Section */}
      <section className="bg-linear-to-b from-white to-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Current Opportunities
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              We're always looking for talented individuals to join our growing team
            </p>
          </div>

          <div className="space-y-8">
            {jobCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                >
                  <div
                    className={`absolute -top-10 -right-10 h-40 w-40 rounded-full bg-linear-to-br ${category.color} opacity-10 transition-opacity group-hover:opacity-20`}
                  ></div>

                  <div className="relative flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="flex items-center gap-4 md:flex-col md:items-start">
                      <Icon
                        className={`h-10 w-10 bg-linear-to-br ${category.color} bg-clip-text text-transparent`}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">{category.title}</h3>
                      <p className="leading-relaxed whitespace-pre-line text-gray-600">
                        {category.description}
                      </p>
                      <p className="mt-4 text-lg font-semibold text-teal-600 italic">
                        More than logistics — it's personal.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Apply Now</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Get in touch with us to discuss your application
              </p>
            </div>

            {/* Quick Contact Options */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <a
                href="tel:07818077110"
                className="flex items-center justify-center gap-3 rounded-xl bg-teal-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-teal-700"
              >
                <Phone className="h-5 w-5" />
                <span>07818 077110</span>
              </a>
              <a
                href="mailto:enquiries@m19logistics.com"
                className="flex items-center justify-center gap-3 rounded-xl border-2 border-teal-600 bg-transparent px-6 py-4 font-semibold text-teal-600 transition-all hover:bg-teal-50"
              >
                <Mail className="h-5 w-5" />
                <span>Email Us</span>
              </a>
            </div>

            {/* Application Form */}
            <div className="rounded-2xl bg-linear-to-br from-gray-50 to-white p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none ${
                      errors.fullName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none ${
                        errors.phoneNumber
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'
                      }`}
                      placeholder="07XXX XXXXXX"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="positionOfInterest"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Position of Interest *
                  </label>
                  <select
                    id="positionOfInterest"
                    name="positionOfInterest"
                    value={formData.positionOfInterest}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none ${
                      errors.positionOfInterest
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'
                    }`}
                  >
                    <option value="">Select a position</option>
                    <option value="Driver">Driver</option>
                    <option value="Operations">Operations</option>
                    <option value="Office & Support">Office &amp; Support</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.positionOfInterest && (
                    <p className="mt-1 text-sm text-red-600">{errors.positionOfInterest}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="coverLetter"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Message / Cover Letter *
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none ${
                      errors.coverLetter
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'
                    }`}
                    placeholder="Tell us about yourself and why you'd like to join M19 Logistics..."
                  />
                  {errors.coverLetter && (
                    <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cv" className="mb-2 block text-sm font-medium text-gray-700">
                    Upload CV (PDF or Word) *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label
                      htmlFor="cv"
                      className={`flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-gray-50 px-6 py-8 transition-all hover:border-teal-500 hover:bg-teal-50 ${
                        errors.cv ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <Upload className="h-6 w-6 text-gray-500" />
                      <span className="text-gray-600">
                        {cv ? cv.name : 'Click to upload your CV'}
                      </span>
                    </label>
                  </div>
                  {errors.cv ? (
                    <p className="mt-2 text-sm text-red-600">{errors.cv}</p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      Accepted formats: PDF, DOC, DOCX (Max 10MB)
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Questions About Joining Our Team?
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-gray-300">
              We're happy to discuss opportunities, answer questions, or simply have a conversation
              about what it's like to work at M19 Logistics.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/40 bg-transparent px-8 py-3 text-base font-bold text-white transition-all hover:bg-white/10"
              >
                Contact Us
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-bold text-slate-900 transition-all hover:bg-gray-100"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobsView;
