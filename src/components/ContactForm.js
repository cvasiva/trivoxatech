import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const SVC  = 'service_928ko6h';
const TPL  = 'YOUR_NEW_TEMPLATE_ID';
const KEY  = '3s_VBlPn-ycSICDIK';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [sendError, setSendError] = useState('');

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    else if (!/^[a-zA-Z\s]+$/.test(formData.name)) e.name = 'Name can only contain letters and spaces';

    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email address';

    if (formData.phone.trim()) {
      if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) e.phone = 'Please enter a valid phone number';
      else if (formData.phone.replace(/\D/g, '').length < 10) e.phone = 'Phone number must have at least 10 digits';
    }

    if (!formData.message.trim()) e.message = 'Message is required';
    else if (formData.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    else if (formData.message.trim().length > 1000) e.message = 'Message cannot exceed 1000 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (sendError) setSendError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setSendError('');
    try {
      emailjs.init(KEY);
      await emailjs.send(SVC, TPL, {
        from_name:  formData.name,
        from_email: formData.email,
        phone:      formData.phone || 'N/A',
        message:    formData.message,
        reply_to:   formData.email,
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('EmailJS ERR:', err);
      setSendError(`Failed: ${err?.text || err?.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 items-start">
          <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Message sent successfully!</p>
            <p className="text-sm text-green-700">We'll get back to you soon.</p>
          </div>
        </div>
      )}

      {sendError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-center text-sm text-red-700">
          <FaExclamationCircle /> {sendError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            placeholder="Your name"
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-600'}`} />
          {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            placeholder="your@email.com"
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-600'}`} />
          {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-600'}`} />
          {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message * ({formData.message.length}/1000)
          </label>
          <textarea name="message" value={formData.message} onChange={handleChange}
            placeholder="Your message" rows="5"
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-600'}`} />
          {errors.message && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle className="text-xs" /> {errors.message}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? 'Sending...' : <><FaPaperPlane className="text-sm" /> Send Message</>}
        </button>

        <p className="text-xs text-gray-500 text-center">By submitting, you agree to our privacy policy</p>
      </form>
    </div>
  );
};

export default ContactForm;
