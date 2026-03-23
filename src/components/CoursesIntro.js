import React from 'react';
import RenderContent from '../utils/RenderContent';

const CoursesIntro = ({ data }) => {
  const title = data?.title ?? 'Explore Top-Tier Courses';
  const subtitle = data?.subtitle ?? 'Curated curriculum designed by industry experts to take you from beginner to professional.';
  const button = data?.button ?? { text: 'View All Courses', href: '/courses' };
  const variant = data?.variant ?? 'default';

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-white">
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 sm:gap-6">
          <div className="lg:col-span-8">
            <RenderContent
              data={{ type: 'heading', text: title }}
              className={variant === 'link' ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900 leading-tight' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-gray-900 leading-tight'}
            />
            {variant !== 'link' && (
              <RenderContent data={{ type: 'paragraph', text: subtitle }} className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mt-2 sm:mt-3 md:mt-4 max-w-2xl leading-relaxed" />
            )}
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            {variant === 'link' ? (
              <a href={button.href} className="border border-gray-300 px-4 sm:px-5 md:px-6 py-2 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium text-gray-700 hover:bg-gray-100 transition duration-300 whitespace-nowrap flex-shrink-0">
                <span>{button.text || 'View Full Portfolio'}</span>
              </a>
            ) : (
              <a
                href={button.href}
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
              >
                <RenderContent data={button.text} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesIntro;
