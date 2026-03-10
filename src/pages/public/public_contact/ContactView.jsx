import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { submitContactForm } from '../../../services/contactService';

const ContactView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\s()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        toast.success(
          response.message || 'Thank you for contacting us! We will get back to you soon.'
        );
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setErrors({});
      } else {
        toast.error(response.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit form. Please try again.');
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
              <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm font-medium sm:text-base">Get In Touch</span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 text-3xl leading-tight font-extrabold text-white sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
              Contact Us
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-white/90 sm:mb-8 sm:text-lg md:text-xl lg:text-2xl">
              We're here to help with all your delivery needs
            </p>

            {/* Description */}
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              Reach out to our dedicated team for any queries, support, or partnership opportunities
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

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <a href="tel:07818077110" className="text-teal-600 hover:text-teal-700">
                      07818 077110
                    </a>
                    <br />
                    <a
                      href="https://wa.me/447577574676"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      WhatsApp 07577 574676
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <div className="space-y-1">
                      <a
                        href="mailto:enquiries@m19logistics.com"
                        className="block text-blue-600 hover:text-blue-700"
                      >
                        enquiries@m19logistics.com
                      </a>
                      <a
                        href="mailto:deliveries@m19logistics.com"
                        className="block text-blue-600 hover:text-blue-700"
                      >
                        deliveries@m19logistics.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Operating Hours</h3>
                    <p className="text-gray-600">24/7 Operations</p>
                    <p className="text-sm text-gray-500">Day and night, all year round</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Wrexham, United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-lg bg-gray-50 p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Send us a Message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                    }`}
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                    }`}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                    }`}
                    placeholder="Your phone number"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-1 focus:outline-none ${
                      errors.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                    }`}
                    placeholder="How can we help you?"
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-teal-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
