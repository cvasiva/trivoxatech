import React from 'react';

const TwoColumn = ({ 
  title, 
  subtitle, 
  content, 
  image, 
  imagePosition = 'right',
  cta,
  ctaText = 'Learn More'
}) => {
  const imageCol = (
    <div className="flex justify-center items-center">
      <img src={image} alt={title} className="w-full max-w-md rounded-lg shadow-lg" />
    </div>
  );

  const contentCol = (
    <div>
      {subtitle && <p className="text-indigo-600 font-semibold mb-2">{subtitle}</p>}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">{content}</p>
      {cta && (
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          {ctaText}
        </button>
      )}
    </div>
  );

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {imagePosition === 'left' ? (
            <>
              {imageCol}
              {contentCol}
            </>
          ) : (
            <>
              {contentCol}
              {imageCol}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TwoColumn;
