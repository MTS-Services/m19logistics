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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (validTypes.includes(file.type)) {
        setCv(file);
      } else {
        alert('Please upload a PDF or Word document');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (formData.fullName.trim().length < 2 || formData.fullName.trim().length > 100) {
      toast.error('Full name must be between 2 and 100 characters.');
      setIsSubmitting(false);
      return;
    }
    if (formData.coverLetter.trim().length < 5 || formData.coverLetter.trim().length > 2000) {
      toast.error('Cover letter must be between 5 and 2000 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      const body = new FormData();
      body.append('fullName', formData.fullName);
      body.append('email', formData.email);
      body.append('phoneNumber', formData.phoneNumber);
      body.append('positionOfInterest', formData.positionOfInterest);
      body.append('coverLetter', formData.coverLetter);
      if (cv) body.append('cv', cv);

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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    placeholder="Enter your full name"
                  />
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
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      placeholder="your.email@example.com"
                    />
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
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      placeholder="07XXX XXXXXX"
                    />
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
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  >
                    <option value="">Select a position</option>
                    <option value="Driver">Driver</option>
                    <option value="Operations">Operations</option>
                    <option value="Office & Support">Office &amp; Support</option>
                    <option value="Other">Other</option>
                  </select>
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
                    required
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    placeholder="Tell us about yourself and why you'd like to join M19 Logistics..."
                  />
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
                      required
                      className="hidden"
                    />
                    <label
                      htmlFor="cv"
                      className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-all hover:border-teal-500 hover:bg-teal-50"
                    >
                      <Upload className="h-6 w-6 text-gray-500" />
                      <span className="text-gray-600">
                        {cv ? cv.name : 'Click to upload your CV'}
                      </span>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Accepted formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
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
