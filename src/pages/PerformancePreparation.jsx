/**
 * Performance Preparation Detail Page
 * 
 * Elite-level Bharatanatyam training for advanced students preparing for 
 * professional performances, competitions, and teaching careers.
 * 
 * @version 1.0.0
 * @author TandavaLasya Development Team
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Core utilities
import { logger } from '../core/utils/logger.util.js';

// UI Components
import ErrorBoundary from '../components/ui/ErrorBoundary/ErrorBoundary.jsx';
import { 
  AnimationWrapper, 
  StaggerContainer, 
  StaggerItem 
} from '../components/ui/Animation/AnimationWrapper.jsx';

/**
 * Elite Curriculum Component
 * Displays the advanced performance preparation curriculum
 */
function EliteCurriculum() {
  const curriculumModules = [
    {
      title: "Advanced Choreography",
      duration: "Ongoing",
      focus: "Creative Excellence",
      topics: [
        "Original choreography development",
        "Fusion styles while maintaining classical integrity",
        "Complex group choreography and formations",
        "Music composition collaboration",
        "Innovative presentation techniques"
      ]
    },
    {
      title: "Professional Performance Skills",
      duration: "Year-round",
      focus: "Stage Mastery",
      topics: [
        "Large venue performance techniques",
        "Audience engagement and communication",
        "Professional makeup and costume design",
        "Lighting and technical production",
        "Media and photography preparation"
      ]
    },
    {
      title: "Competition Preparation",
      duration: "Seasonal",
      focus: "Competitive Excellence",
      topics: [
        "Competition strategy and repertoire selection",
        "Judges' perspective and scoring criteria",
        "Performance psychology and mental preparation",
        "Video audition techniques",
        "Award presentation skills"
      ]
    },
    {
      title: "Teaching Methodology",
      duration: "6 Months",
      focus: "Knowledge Transfer",
      topics: [
        "Pedagogy of Bharatanatyam instruction",
        "Curriculum development and planning",
        "Student assessment and feedback techniques",
        "Classroom management and safety",
        "Business aspects of teaching dance"
      ]
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Elite Training Modules
          </h2>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid md:grid-cols-2 gap-8">
            {curriculumModules.map((module, index) => (
              <StaggerItem key={module.title}>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 h-full">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {module.title}
                      </h3>
                      <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                        {module.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-3">
                      Focus: {module.focus}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700 text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

/**
 * Admission Requirements Component
 */
function AdmissionRequirements() {
  const requirements = [
    {
      category: "Technical Mastery",
      level: "Advanced",
      criteria: [
        "Complete mastery of all Adavu sequences",
        "Ability to perform complex Varnam compositions",
        "Proficiency in advanced abhinaya techniques",
        "Demonstrated understanding of musical theory",
        "Fluent in classical dance terminology"
      ]
    },
    {
      category: "Performance Experience",
      level: "Extensive",
      criteria: [
        "Minimum 3 years of regular performance experience",
        "Solo performances of 45+ minutes",
        "Competition participation (regional/national)",
        "Teaching experience with junior students",
        "Collaborative work with musicians"
      ]
    },
    {
      category: "Artistic Maturity",
      level: "Professional",
      criteria: [
        "Original choreographic work",
        "Deep cultural and spiritual understanding",
        "Ability to mentor other dancers",
        "Professional presentation skills",
        "Commitment to artistic excellence"
      ]
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Admission Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our performance preparation program is designed for serious artists ready to pursue professional excellence
            </p>
          </div>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <StaggerItem key={req.category}>
                <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {req.category}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      req.level === 'Advanced' ? 'bg-yellow-100 text-yellow-700' :
                      req.level === 'Extensive' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.level}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {req.criteria.map((criterion, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1 flex-shrink-0">⚡</span>
                        <span className="text-gray-700 text-sm">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

/**
 * Career Pathways Component
 */
function CareerPathways() {
  const pathways = [
    {
      title: "Professional Performer",
      description: "Develop a career as a touring professional dancer with major cultural organizations",
      opportunities: [
        "Solo concert performances",
        "Cultural festival headlining",
        "International tour opportunities",
        "Film and media appearances",
        "Artist residency programs"
      ],
      icon: "🌟"
    },
    {
      title: "Competition Champion",
      description: "Prepare for national and international dance competitions with elite coaching",
      opportunities: [
        "National competition participation",
        "International festival competitions",
        "Scholarship and grant opportunities",
        "Judge training and certification",
        "Competition choreography consulting"
      ],
      icon: "🏆"
    },
    {
      title: "Master Teacher",
      description: "Become a certified instructor and establish your own teaching practice",
      opportunities: [
        "Open your own dance academy",
        "University guest artist positions",
        "Workshop and masterclass leadership",
        "Curriculum development consulting",
        "Teacher training programs"
      ],
      icon: "🎓"
    },
    {
      title: "Cultural Ambassador",
      description: "Represent Bharatanatyam in cultural exchange and educational programs",
      opportunities: [
        "Cultural diplomacy programs",
        "Educational institution partnerships",
        "Community outreach initiatives",
        "Arts advocacy and policy work",
        "Cultural preservation projects"
      ],
      icon: "🌍"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Career Pathways
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our performance preparation program opens doors to diverse professional opportunities
            </p>
          </div>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid md:grid-cols-2 gap-8">
            {pathways.map((pathway, index) => (
              <StaggerItem key={pathway.title}>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start mb-4">
                    <span className="text-4xl mr-4">{pathway.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pathway.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {pathway.description}
                      </p>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Opportunities:</h4>
                        <ul className="space-y-1">
                          {pathway.opportunities.map((opportunity, opIndex) => (
                            <li key={opIndex} className="text-sm text-gray-600 flex items-start">
                              <span className="text-yellow-500 mr-2 mt-1">•</span>
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

/**
 * Main Performance Preparation Page
 */
function PerformancePreparation() {
  useEffect(() => {
    logger.info('Performance Preparation page mounted', {
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.debug('Performance Preparation page unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimationWrapper variant="fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Performance Preparation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Elite-level training for serious artists ready to pursue professional careers in Bharatanatyam. 
              Intensive coaching for competitions, performances, and teaching excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-yellow-600">Limited</div>
                <div className="text-gray-600">Enrollment</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-yellow-600">Elite</div>
                <div className="text-gray-600">Training</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-yellow-600">Professional</div>
                <div className="text-gray-600">Focus</div>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </section>

      {/* Admission Requirements */}
      <ErrorBoundary context="Admission Requirements">
        <AdmissionRequirements />
      </ErrorBoundary>

      {/* Elite Curriculum */}
      <ErrorBoundary context="Elite Curriculum">
        <EliteCurriculum />
      </ErrorBoundary>

      {/* Career Pathways */}
      <ErrorBoundary context="Career Pathways">
        <CareerPathways />
      </ErrorBoundary>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimationWrapper variant="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready for Elite Training?
            </h2>
            <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
              Join our exclusive performance preparation program and unlock your potential as a professional Bharatanatyam artist.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Limited Enrollment</h3>
              <p className="text-yellow-100 mb-4">We accept only 12 students per year to ensure personalized attention and excellence.</p>
              <p className="text-2xl font-bold text-white">Applications Open: January 2024</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact?message=I'm interested in the Performance Preparation program and would like to receive application materials."
                className="bg-white text-yellow-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Request Application
              </Link>
              <Link
                to="/schedule"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-yellow-600 transition-colors"
              >
                View Schedule
              </Link>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  );
}

export default PerformancePreparation;