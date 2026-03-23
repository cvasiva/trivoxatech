# Trivoxa Technologies - React + Tailwind CSS

A modern, fully responsive website for Trivoxa Technologies built with React and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI Components**: Reusable React components with smooth animations
- **Multi-page Navigation**: Home, About, Services, and Contact pages
- **Course Showcase**: Display and manage course offerings
- **Testimonials**: Student success stories and reviews
- **Contact Forms**: Demo booking and contact forms with validation
- **Blog Section**: Latest tech insights and articles
- **Statistics Dashboard**: Key metrics and achievements
- **Dark Footer**: Professional footer with links and newsletter signup

## 📁 Project Structure

```
src/
├── components/
│   ├── BlogList.js          # Blog articles section
│   ├── Card.js              # Reusable card component
│   ├── ContactForm.js       # Contact form with validation
│   ├── CourseCard.js        # Course display card
│   ├── CTAForm.js           # Demo booking form
│   ├── Footer.js            # Footer with links
│   ├── Hero.js              # Hero section
│   ├── InfoSection.js       # Services overview
│   ├── Navbar.js            # Navigation bar
│   ├── Stats.js             # Statistics section
│   ├── SuccessStories.js    # Case studies
│   ├── Testimonial.js       # Student testimonials
│   └── TwoColumn.js         # Flexible two-column layout
├── pages/
│   ├── Home.js              # Home page
│   ├── About.js             # About page
│   ├── Services.js          # Services/Courses page
│   └── Contact.js           # Contact page
├── App.js                   # Main app component
└── index.js                 # Entry point
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trivoxatech
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Dependencies

- **React**: 19.2.4
- **React Router DOM**: 7.13.1
- **Tailwind CSS**: 3.4.19
- **PostCSS**: 8.5.8
- **Autoprefixer**: 10.4.27

## 🎨 Tailwind CSS Configuration

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📄 Pages Overview

### Home Page
- Hero section with CTA buttons
- Featured courses grid
- Services overview
- Statistics dashboard
- Student testimonials
- Success stories
- Blog highlights
- Demo booking form

### About Page
- Company mission and values
- Why choose us section
- Impact metrics
- Team information

### Services Page
- Complete course catalog
- Enterprise services
- Consultation CTA

### Contact Page
- Contact form with validation
- Business information
- Social media links
- Operating hours

## 🎯 Key Components

### Hero Component
Main landing section with gradient background, call-to-action buttons, and student statistics.

### CourseCard Component
Displays individual courses with image, title, description, and enrollment button.

### ContactForm Component
Reusable form with validation for name, email, phone, and message.

### CTAForm Component
Demo booking form with email validation and privacy notice.

### TwoColumn Component
Flexible layout component for content + image sections.

## 🎨 Color Scheme

- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#9333EA)
- **Background**: Gray (#F3F4F6)
- **Text**: Gray (#111827)
- **Accent**: Yellow (#FBBF24)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ✨ Features Implemented

- ✅ Fully responsive design
- ✅ Smooth hover effects and transitions
- ✅ Form validation
- ✅ Navigation with React Router
- ✅ Mobile menu toggle
- ✅ Gradient backgrounds
- ✅ Shadow effects
- ✅ Icon integration
- ✅ Newsletter signup
- ✅ Social media links

## 🚀 Deployment

To deploy to production:

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📝 Customization

### Update Company Information
Edit the following files:
- `src/components/Navbar.js` - Company name and logo
- `src/components/Footer.js` - Contact info and links
- `src/pages/About.js` - Company details
- `src/pages/Contact.js` - Contact information

### Add New Courses
Update the `courses` array in `src/pages/Home.js` and `src/pages/Services.js`

### Modify Colors
Update Tailwind classes in components or extend `tailwind.config.js`

## 🔧 Available Scripts

- `npm start` - Run development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## 📞 Support

For questions or issues, contact: hello@trivoxatech.com

## 📄 License

All rights reserved © 2024 Trivoxa Technologies
