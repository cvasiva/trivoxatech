import React, { useState } from 'react';

const CTAForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Demo booked:', formData);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <aside className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-indigo-600">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Free Demo</h3>
      <p className="text-sm text-gray-600 mb-6">Fill your details and our team will contact you within 24 hours.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold mt-6"
        >
          Reserve My Spot Now
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-4 text-center">We respect your privacy. No spam, ever.</p>
    </aside>
  );
};

export default CTAForm;
