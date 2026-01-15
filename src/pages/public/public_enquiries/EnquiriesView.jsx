import { HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';

const EnquiriesView = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">General Enquiries</h1>
          <p className="text-xl text-white opacity-90">Have questions? We're here to help</p>
        </div>
      </div>

      {/* Enquiry Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <HelpCircle className="mx-auto mb-4 h-16 w-16 text-teal-600" />
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Send Us Your Enquiry</h2>
              <p className="text-gray-600">
                Whether you're a prospective client or have questions about our services, we'd love
                to hear from you.
              </p>
            </div>

            <form className="space-y-6 rounded-lg bg-gray-50 p-8 shadow-lg">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="Your Company Ltd"
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
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="07971 415430"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  placeholder="What is your enquiry about?"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="6"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  placeholder="Please provide details about your enquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
              >
                Submit Enquiry
              </button>
            </form>

            {/* Quick Contact Options */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <a
                href="tel:07971415430"
                className="flex items-center justify-center space-x-3 rounded-lg bg-blue-50 p-4 text-blue-600 hover:bg-blue-100"
              >
                <Phone className="h-5 w-5" />
                <span className="font-semibold">Call Us: 07971 415430</span>
              </a>

              <a
                href="mailto:enquiries@m19logistics.com"
                className="flex items-center justify-center space-x-3 rounded-lg bg-teal-50 p-4 text-teal-600 hover:bg-teal-100"
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
