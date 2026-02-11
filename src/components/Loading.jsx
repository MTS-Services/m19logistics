import React from 'react';

const Loading = ({
  message = 'Loading...',
  submessage = 'Please wait while we fetch your data',
  size = 'large', // large, medium, small
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      container: 'p-8',
      outerRing: 'h-16 w-16',
      middleRing: 'h-14 w-14',
      logoContainer: 'h-16 w-16',
      logo: 'h-12 w-12',
      title: 'text-base',
      subtitle: 'text-xs',
      dot: 'h-2 w-2',
    },
    medium: {
      container: 'p-12',
      outerRing: 'h-24 w-24',
      middleRing: 'h-20 w-20',
      logoContainer: 'h-24 w-24',
      logo: 'h-18 w-18',
      title: 'text-lg',
      subtitle: 'text-sm',
      dot: 'h-2.5 w-2.5',
    },
    large: {
      container: 'p-20',
      outerRing: 'h-32 w-32',
      middleRing: 'h-28 w-28',
      logoContainer: 'h-32 w-32',
      logo: 'h-24 w-24',
      title: 'text-xl',
      subtitle: 'text-sm',
      dot: 'h-3 w-3',
    },
  };

  const config = sizeConfig[size] || sizeConfig.large;

  return (
    <div
      className={`mb-6 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 ${config.container} text-center shadow-lg`}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Animated Logo Container */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${config.outerRing} animate-spin rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-400`}
            ></div>
          </div>
          {/* Middle pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${config.middleRing} animate-pulse rounded-full border-4 border-teal-200`}
            ></div>
          </div>
          {/* Logo with bounce animation */}
          <div className="relative flex items-center justify-center">
            <div
              className={`${config.logoContainer} animate-bounce-slow flex items-center justify-center`}
            >
              <img
                src="/images/logo.png"
                alt="M19 Logistics"
                className={`${config.logo} object-contain drop-shadow-lg`}
              />
            </div>
          </div>
        </div>

        {/* Loading text with fade animation */}
        <div className="animate-pulse space-y-3">
          <p className={`${config.title} font-bold text-gray-800`}>{message}</p>
          {submessage && <p className={`${config.subtitle} text-gray-600`}>{submessage}</p>}
        </div>

        {/* Animated dots */}
        <div className="mt-6 flex gap-2">
          <span
            className={`${config.dot} animate-bounce rounded-full bg-teal-500`}
            style={{ animationDelay: '0s' }}
          ></span>
          <span
            className={`${config.dot} animate-bounce rounded-full bg-teal-500`}
            style={{ animationDelay: '0.2s' }}
          ></span>
          <span
            className={`${config.dot} animate-bounce rounded-full bg-teal-500`}
            style={{ animationDelay: '0.4s' }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
