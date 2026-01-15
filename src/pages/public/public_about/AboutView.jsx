import { Building, Award, Users, Target } from 'lucide-react';

const AboutView = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">About M19 Logistics</h1>
          <p className="text-xl text-white opacity-90">
            Your Trusted Partner in Seamless Delivery Solutions
          </p>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <Building className="mx-auto mb-4 h-16 w-16 text-teal-600" />
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Our Story</h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                Welcome to <strong>M19 Logistics</strong>, your trusted partner in seamless delivery
                solutions. Founded in 2019, M19 Logistics was born from a vision to redefine courier
                services with speed, reliability, and customer satisfaction at the core of
                everything we do.
              </p>

              <p>
                At M19 Logistics, we understand that every package tells a story, and we're
                committed to delivering those stories with care and precision. From local businesses
                to individual customers, we provide tailored logistics solutions to meet your unique
                needs.
              </p>

              <p>
                Our team of dedicated professionals leverages cutting-edge technology and a
                customer-first approach to ensure your parcels arrive on time, every time. Since our
                inception, we've grown by staying true to our values: integrity, efficiency, and
                innovation.
              </p>

              <p>
                Whether it's same-day delivery, nationwide shipping, or specialized logistics, M19
                Logistics is here to make every delivery effortless.
              </p>

              <p className="font-semibold text-teal-600">
                Thank you for choosing M19 Logistics—where your deliveries matter as much to us as
                they do to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Our Core Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <Target className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Integrity</h3>
              <p className="text-gray-600">
                We operate with honesty and transparency in all our dealings
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Efficiency</h3>
              <p className="text-gray-600">
                Every delivery is optimized for speed without compromising quality
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Innovation</h3>
              <p className="text-gray-600">
                We embrace new technologies to enhance our service delivery
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutView;
