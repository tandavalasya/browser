# TandavaLasya - Classical Bharatanatyam Dance School

<img src="public/logo.png" alt="TandavaLasya Logo" width="200" align="center" />

A modern, responsive web application for TandavaLasya Bharatanatyam Dance School, built with React, Vite, and TailwindCSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

# 📝 Content Management Guide

## 📖 Managing Blog Posts

**File Location**: `src/posts/samplePosts.js`

### Adding New Posts
1. Create new post file in `src/posts/your-post-slug.js`
2. Follow existing structure with slug, title, date, excerpt, content
3. Import and add to `samplePosts.js` array

### Cursor Prompts
```
🤖 CURSOR PROMPT - Add New Blog Post:
"Create a new blog post for TandavaLasya about [TOPIC]. Include:
- Appropriate slug and title
- Today's date
- Engaging excerpt (50-100 words)
- Comprehensive markdown content with headings, lists, and cultural context
- Add to samplePosts.js in chronological order
- Follow existing post structure and tone"

🤖 CURSOR PROMPT - Update Blog Content:
"Update the blog post '[POST_TITLE]' to include [NEW_CONTENT]. Maintain the existing structure, update the date, and ensure cultural accuracy for Bharatanatyam context."
```

---

## 🎭 Managing Class Curriculum

**File Locations**:
- Beginner: `src/pages/BeginnerClasses.jsx`
- Intermediate: `src/pages/IntermediateTraining.jsx`
- Performance: `src/pages/PerformancePreparation.jsx`

### Curriculum Structure
Each class page contains curriculum sections with months, topics, and learning objectives.

### Cursor Prompts
```
🤖 CURSOR PROMPT - Update Curriculum:
"Update the [BEGINNER/INTERMEDIATE/PERFORMANCE] class curriculum to include [NEW_CONTENT]. Maintain the existing structure with months, topics, and learning objectives. Ensure content is appropriate for the skill level and follows Bharatanatyam pedagogy."

🤖 CURSOR PROMPT - Add New Class Level:
"Create a new class level page for [CLASS_NAME] following the structure of existing class pages. Include:
- Hero section with program details
- Comprehensive curriculum breakdown
- Learning outcomes with icons
- Prerequisites/requirements
- Call-to-action section
- Proper routing in App.jsx"
```

---

## 📅 Managing Schedule Information

**File Location**: `src/pages/Schedule.jsx`

### Schedule Data Structure
Update the `scheduleData` object with locations, class types, days, times, and instructors.

### Adding New Locations
1. Update `scheduleData` in Schedule.jsx
2. Add location to `src/config/locations.json`
3. Test contact form dropdown

### Cursor Prompts
```
🤖 CURSOR PROMPT - Update Schedule:
"Update the class schedule for [LOCATION] to include [NEW_SCHEDULE_INFO]. Maintain consistent formatting with day, time, and instructor. Update both Schedule.jsx and locations.json if adding new locations."

🤖 CURSOR PROMPT - Add New Location:
"Add a new studio location '[LOCATION_NAME]' with complete class schedule including all class levels (Beginner, Intermediate, Performance). Update locations.json, Schedule.jsx, and ensure Contact form integration works properly."
```

---

## ⭐ Managing Reviews & Testimonials

**File Location**: `src/pages/Home.jsx` (ReviewsSection component)

### Review Structure
Reviews include name, rating, review text, date, and optional image.

### Cursor Prompts
```
🤖 CURSOR PROMPT - Add Student Review:
"Add a new student review to the Home page reviews section. Include:
- Student name: [NAME]
- Rating: [1-5]
- Detailed review text about their Bharatanatyam learning experience
- Recent date
- Follow existing review structure and maintain cultural context"

🤖 CURSOR PROMPT - Update Reviews Section:
"Update the reviews carousel to improve [SPECIFIC_ASPECT]. Maintain responsive design, ensure accessibility, and keep the cultural aesthetic consistent with the site design."
```

---

## 🖼️ Managing Gallery & Events

**File Location**: `src/pages/Gallery.jsx`

### Event Structure
Events include id, title, date, description, cover image, image array, and category.

### Image Management
- Add images to `public/images/` directory
- Optimize for web (compress, appropriate sizes)
- Use descriptive filenames and alt text

### Cursor Prompts
```
🤖 CURSOR PROMPT - Add New Event:
"Add a new event to the gallery for '[EVENT_NAME]' that took place on [DATE]. Include:
- Unique slug ID
- Compelling title and description
- Cover image and multiple gallery images
- Appropriate category
- Follow existing event structure and maintain responsive gallery layout"

🤖 CURSOR PROMPT - Update Gallery Layout:
"Improve the gallery page to [SPECIFIC_IMPROVEMENT]. Maintain responsive design, image lazy loading, and ensure accessibility with proper alt text and navigation."
```

---

## 👥 Managing Instructor Information

**File Locations**: 
- `src/pages/About.jsx`
- `src/pages/InstructorDetail.jsx`

### Instructor Profile Structure
Include id, name, title, image, bio, detailed bio, specialties, and experience.

### Cursor Prompts
```
🤖 CURSOR PROMPT - Add New Instructor:
"Add a new instructor '[INSTRUCTOR_NAME]' to the About page and create their detail page. Include:
- Professional photo and credentials
- Brief bio for About page grid
- Comprehensive detailed biography
- Specialties and experience
- Proper routing and navigation
- Maintain consistent styling with existing instructor profiles"
```

---

## 🎨 Styling & Theme Management

**File**: `tailwind.config.js`

### Color Scheme
- Primary: Pink-Purple gradient (`from-pink-600 to-purple-600`)
- Secondary: Orange-Yellow accents
- Background: Warm gradients (`from-orange-50 via-pink-50 to-purple-50`)

### Cursor Prompts
```
🤖 CURSOR PROMPT - Update Theme Colors:
"Update the color scheme for [COMPONENT/PAGE] to [NEW_COLOR_SCHEME]. Maintain accessibility contrast ratios, ensure consistency across the application, and preserve the cultural aesthetic. Update both component styles and Tailwind configuration if needed."

🤖 CURSOR PROMPT - Improve Responsive Design:
"Improve the responsive design for [COMPONENT/PAGE] to better support [DEVICE_TYPE]. Ensure proper spacing, readable text sizes, and functional interaction on all breakpoints. Maintain the existing design language."
```

---

## ⚙️ Technical Management

### Environment Setup
Create `.env.local` for EmailJS configuration:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Cursor Prompts
```
🤖 CURSOR PROMPT - Debug Issue:
"Debug the [SPECIFIC_ISSUE] in [COMPONENT/PAGE]. Check for:
- Console errors and warnings
- Network requests and responses
- Component state and props
- Event handlers and user interactions
- Provide step-by-step debugging approach and solution"

🤖 CURSOR PROMPT - Add New Feature:
"Add a new feature for [FEATURE_DESCRIPTION] to the TandavaLasya application. Include:
- Component creation with proper error boundaries
- Responsive design following existing patterns
- Integration with existing navigation and routing
- Comprehensive testing
- Documentation updates"

🤖 CURSOR PROMPT - Performance Optimization:
"Optimize the performance of [COMPONENT/PAGE] focusing on [SPECIFIC_ASPECT]. Consider:
- Code splitting and lazy loading
- Image optimization and loading strategies
- Animation performance
- Bundle size reduction
- Accessibility improvements"

🤖 CURSOR PROMPT - Write Tests:
"Write comprehensive tests for [COMPONENT_NAME] including:
- Unit tests for component rendering
- Integration tests for user interactions
- Accessibility tests for screen readers
- Error boundary tests for edge cases
- Follow existing test patterns and use React Testing Library best practices"

🤖 CURSOR PROMPT - Fix Failing Tests:
"Fix the failing test in [TEST_FILE] for [COMPONENT_NAME]. Analyze the error message, check component implementation, and ensure tests match current functionality. Maintain test coverage and quality."
```

---

## 🚀 Deployment & Maintenance

### Build Process
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Images optimized and compressed
- [ ] EmailJS service configured
- [ ] Contact form tested
- [ ] All pages responsive
- [ ] Accessibility verified
- [ ] Performance optimized

### Cursor Prompts
```
🤖 CURSOR PROMPT - Prepare for Deployment:
"Prepare the TandavaLasya application for production deployment. Check:
- Build optimization and bundle size
- Environment variables and configuration
- Image optimization and loading
- EmailJS integration functionality
- Cross-browser compatibility
- Accessibility compliance
- Performance metrics"

🤖 CURSOR PROMPT - Monitor and Maintain:
"Set up monitoring and maintenance procedures for the TandavaLasya application including:
- Error tracking and logging
- Performance monitoring
- Content update workflows
- Backup and recovery procedures
- Security best practices"
```

---

## 📄 Additional Documentation

### **Project Documentation** (`docs/`)
- **docs/requirements/businessRequirements.md**: Comprehensive business strategy and 5-phase roadmap
- **docs/requirements/uxRequirements.md**: Complete user experience specifications and design guidelines
- **docs/README.md**: Documentation index and maintenance guidelines

### **Technical Configuration**
- **tailwind.config.js**: TailwindCSS configuration
- **jest.config.cjs**: Testing configuration
- **vite.config.js**: Build configuration

---

**Built with ❤️ for the Bharatanatyam community** 