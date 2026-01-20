import { Link } from 'react-router-dom';
import {
  Truck,
  Clock,
  Shield,
  Users,
  TrendingUp,
  MapPin,
  Package,
  CheckCircle,
  Phone,
  Mail,
  ArrowRight,
  Star,
} from 'lucide-react';

const HomeView = () => {
  const services = [
    {
      icon: Truck,
      title: 'Same-Day Delivery',
      description: 'Urgent deliveries completed within hours across North Wales',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Scheduled Deliveries',
      description: 'Choose AM or PM slots to fit your schedule perfectly',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: Shield,
      title: 'Secure Handling',
      description: 'Professional care for fragile and valuable items',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Package,
      title: 'Weight-Based Pricing',
      description: 'Transparent pricing calculated by weight and distance',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: MapPin,
      title: 'Proof of Delivery',
      description: 'Digital signatures and photos for every completed delivery',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Tracking',
      description: 'Monitor your deliveries from pickup to completion',
      color: 'from-teal-500 to-blue-600',
    },
  ];

  const whyChooseUs = [
    {
      title: 'Local Expertise, Nationwide Reach',
      description:
        'Rooted in Wrexham, we combine local knowledge with extensive delivery networks to serve clients across the UK.',
    },
    {
      title: 'Reliable & Timely',
      description:
        'Our commitment to punctuality and secure handling ensures your shipments reach their destination safely and on schedule.',
    },
    {
      title: 'Customer-Centric Approach',
      description:
        'We prioritize your business needs, offering flexible services and dedicated support.',
    },
    {
      title: 'Competitive Pricing',
      description:
        "Quality delivery doesn't have to come at a high cost — enjoy affordable rates with no compromise on service quality.",
    },
    {
      title: 'Environmental Responsibility',
      description:
        'We adopt eco-friendly practices to reduce our carbon footprint and promote sustainable logistics.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Deliveries Monthly', icon: Package },
    { number: '50+', label: 'Happy Clients', icon: Users },
    { number: '99%', label: 'On-Time Delivery', icon: Clock },
    { number: '24/7', label: 'Customer Support', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern & Clean */}
      <div className="relative flex min-h-screen w-full items-center overflow-hidden bg-slate-900 pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-70"></div>
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        </div>

        <div className="relative z-10 container mx-auto w-full px-6 py-20 sm:px-8 lg:px-12">
          <div className="max-w-3xl text-left">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Logistics <span className="text-teal-400">Evolved</span>.
              <br />
              Delivery <span className="text-red-500">Delivered</span>.
            </h1>

            <p className="mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Rapid same-day delivery, specialist transport, and full end-to-end logistics solutions
              across the UK and Europe. We keep your business moving 24/7.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/enquiries"
                className="group inline-flex items-center justify-center rounded-lg bg-teal-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-teal-600"
              >
                Get a Quote
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/40 bg-transparent px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 p-6 text-center transition-all hover:shadow-lg"
                >
                  <Icon className="mx-auto mb-3 h-8 w-8 text-teal-600 transition-transform group-hover:scale-110" />
                  <div className="text-3xl font-bold text-gray-900 sm:text-4xl">{stat.number}</div>
                  <div className="mt-1 text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="bg-linear-to-b from-white to-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Delivery Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Comprehensive courier solutions tailored for businesses across North Wales
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`absolute -top-6 -right-6 h-32 w-32 rounded-full bg-linear-to-br ${service.color} opacity-10 transition-opacity group-hover:opacity-20`}
                  ></div>
                  <Icon
                    className={`relative mb-4 h-10 w-10 bg-linear-to-br ${service.color} bg-clip-text text-transparent`}
                  />
                  <h3 className="relative mb-3 text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="relative text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose M19 Logistics?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              We combine expertise, technology, and dedication to deliver excellence
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-12">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl bg-linear-to-br from-gray-50 to-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-blue-500 text-white">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Ready to get moving */}
      <section className="bg-[#1B9898] py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">Ready to get moving?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white opacity-90 md:text-xl">
            Booking is simple — online, by phone or email. Our team is ready to take care of
            everything.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-bold text-[#1B9898] shadow-lg transition-all hover:bg-gray-50"
            >
              Book Online
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/40 bg-transparent px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Get in Touch Today</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
              Contact our team for a quote or to discuss your delivery requirements
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="tel:07971415430"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-teal-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-teal-700 sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                <span>07971 415430</span>
              </a>
              <a
                href="tel:01978439739"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                <span>01978 439739</span>
              </a>
              <a
                href="mailto:enquiries@m19logistics.com"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-600 bg-transparent px-8 py-4 font-semibold text-white transition-all hover:border-white hover:bg-white/10 sm:w-auto"
              >
                <Mail className="h-5 w-5" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
