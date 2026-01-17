import { Building, Award, Users, Target } from 'lucide-react';

const AboutView = () => {
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
              <Building className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm font-medium sm:text-base">Established 2019</span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 text-3xl leading-tight font-extrabold text-white sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
              About M19 Logistics
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-white/90 sm:mb-8 sm:text-lg md:text-xl lg:text-2xl">
              Your Trusted Partner in Seamless Delivery Solutions
            </p>

            {/* Description */}
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              Delivering excellence across the nation with speed, reliability, and unmatched
              customer satisfaction
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

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              {/* <Building className="mx-auto mb-4 h-16 w-16 text-teal-600" /> */}
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
