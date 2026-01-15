import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactView = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Contact Us</h1>
          <p className="text-xl text-white opacity-90">
            We're here to help with all your delivery needs
          </p>
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
                    <a href="tel:07971415430" className="text-teal-600 hover:text-teal-700">
                      07971 415430
                    </a>
                    <br />
                    <a href="tel:01978439739" className="text-teal-600 hover:text-teal-700">
                      01978 439739
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
                        href="mailto:m19logistics@gmail.com"
                        className="block text-blue-600 hover:text-blue-700"
                      >
                        m19logistics@gmail.com
                      </a>
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
              <form className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows="4"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
                >
                  Send Message
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
