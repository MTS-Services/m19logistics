import { HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';

const EnquiriesView = () => {
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
