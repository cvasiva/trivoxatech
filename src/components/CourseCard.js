import React from 'react';

const CourseCard = ({ title, subtitle, image = '/logo192.png' }) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-100">
        <img src={image} alt="course" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">{title}</h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">{subtitle}</p>
        <div className="mt-4 sm:mt-5 md:mt-6 flex items-center justify-between gap-2">
          <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-xs sm:text-sm">View Syllabus →</a>
          <button className="border border-gray-300 px-4 sm:px-5 md:px-6 py-2 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium text-gray-700 hover:bg-gray-100 transition duration-300 whitespace-nowrap">
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
