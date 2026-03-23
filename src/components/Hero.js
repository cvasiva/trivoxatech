import React from 'react';
import { useNavigate } from 'react-router-dom';
import hero from '../images/hero.jpg'
import RenderContent from '../utils/RenderContent';

const Hero = (props) => {
  const navigate = useNavigate();
  const {
    data,
    eyebrow = 'IT & Cloud Training & Services',
    title = 'Master the Future of',
    highlight = 'Technology.',
    subtitle = 'Empower your career with industry-recognized certifications or scale your business with our bespoke IT development services.',
    imageSrc = hero,
    primaryText = 'Enroll Now',
    secondaryText = 'Book Free Demo',
    onPrimaryClick,
    onSecondaryClick,
  } = props;

  const eyebrowVal = data?.eyebrow ?? eyebrow;
  const titleVal = data?.title ?? title;
  const highlightVal = data?.highlight ?? highlight;
  const subtitleVal = data?.subtitle ?? subtitle;
  const imageVal = data?.imageSrc ?? imageSrc;
  const primaryVal = data?.primaryText ?? primaryText;
  const secondaryVal = data?.secondaryText ?? secondaryText;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-purple-50 py-8 sm:py-12 md:py-16 lg:py-20 2xl:py-28">
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          <div>
            <div className="mb-3 sm:mb-4 md:mb-5">
              <RenderContent data={eyebrowVal} className="inline-block bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 md:px-4 py-1 md:py-1.5 rounded-full" />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-5 md:mb-6">
              <RenderContent data={titleVal} className="inline" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"><RenderContent data={highlightVal} className="inline" /></span>
            </h1>

            <RenderContent data={subtitleVal} className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mb-6 sm:mb-7 md:mb-8 max-w-2xl leading-relaxed" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={onPrimaryClick || (() => navigate("/courses"))}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm md:text-base rounded-lg shadow-lg hover:opacity-95 transition font-medium"
              >
                <RenderContent data={primaryVal} />
              </button>

              <button
                onClick={onSecondaryClick || (() => navigate("/contact"))}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 md:py-3 border border-gray-200 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <RenderContent data={secondaryVal} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i}
                    src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">12,000+ Students placed &amp; trained</div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end mt-6 sm:mt-8 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <div
                className="absolute -inset-4 sm:-inset-6 rounded-3xl"
                style={{
                  background: 'linear-gradient(90deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                  transform: 'rotate(-3deg)',
                }}
              />

              <div className="relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl bg-white">
                <img src={imageVal} alt="hero" className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" />
              </div>

              <div className="absolute -left-3 sm:-left-6 -bottom-3 sm:-bottom-6 bg-white rounded-lg sm:rounded-xl shadow-md px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 w-56 sm:w-64">
                <svg className="w-5 sm:w-6 h-5 sm:h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path></svg>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-800">24.6% Guaranteed</div>
                  <div className="text-xs text-gray-500">Placement improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
