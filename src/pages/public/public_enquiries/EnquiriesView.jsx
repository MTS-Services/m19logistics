import { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { submitEnquiryForm } from '../../../services/contactService';

const EnquiriesView = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s\-+()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitEnquiryForm(formData);

      if (response.success) {
        toast.success(response.message || 'Thank you for your enquiry. We will respond shortly.');
        // Reset form
        setFormData({
          fullName: '',
          companyName: '',
          email: '',
          phoneNumber: '',
          subject: '',
          message: '',
        });
        setErrors({});
      } else {
        toast.error(response.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error(error.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-teal-600 via-teal-700 to-blue-700 pt-32 pb-24 text-white sm:pt-36 sm:pb-28 md:pt-40 md:pb-32 lg:pt-44 lg:pb-36">
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTMwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm sm:mb-8">
              <HelpCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm font-medium sm:text-base">We're Here to Help</span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 text-3xl leading-tight font-extrabold text-white sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
              General Enquiries
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-white/90 sm:mb-8 sm:text-lg md:text-xl lg:text-2xl">
              Have questions? We're here to help
            </p>

            {/* Description */}
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              Get in touch with our team and we'll respond to your enquiry as soon as possible
            </p>
          </div>
        </div>

        {/* Bottom Wave Shape */}
        <div className="absolute right-0 bottom-0 left-0">
          <svg
            className="h-8 w-full sm:h-12 md:h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </div>

      {/* Enquiry Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              {/* <HelpCircle className="mx-auto mb-4 h-16 w-16 text-teal-600" /> */}
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Send Us Your Enquiry</h2>
              <p className="text-gray-600">
                Whether you're a prospective client or have questions about our services, we'd love
                to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-gray-50 p-8 shadow-lg">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                      errors.fullName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                    }`}
                    placeholder="Your Name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="Your Company Name"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                    }`}
                    placeholder="Your Email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                      errors.phoneNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                    }`}
                    placeholder="Your Phone Number"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                    errors.subject
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                  }`}
                  placeholder="What is your enquiry about?"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                  }`}
                  placeholder="Please provide details about your enquiry..."
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-md px-6 py-3 font-semibold text-white transition-colors ${
                  isSubmitting ? 'cursor-not-allowed bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>

            {/* Quick Contact Options */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <a
                href="tel:07818077110"
                className="flex items-center justify-center space-x-3 rounded-lg bg-teal-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-teal-700"
              >
                <Phone className="h-5 w-5" />
                <span className="font-semibold">Call Us: 07818 077110</span>
              </a>

              <a
                href="mailto:enquiries@m19logistics.com"
                className="flex items-center justify-center space-x-3 rounded-lg border-2 border-teal-600 bg-transparent px-6 py-4 font-semibold text-teal-600 transition-all hover:bg-teal-50"
              >
                <Mail className="h-5 w-5" />
                <span className="font-semibold">Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnquiriesView;
