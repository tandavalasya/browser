/**
 * Intermediate Training Detail Page
 * 
 * Comprehensive information about intermediate-level Bharatanatyam training,
 * including advanced techniques, performance preparation, and artistic development.
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
 * Advanced Curriculum Component
 * Displays structured intermediate curriculum
 */
function AdvancedCurriculum() {
  const curriculumSections = [
    {
      title: "Advanced Adavus",
      duration: "Months 1-3",
      topics: [
        "Complex Adavu combinations (Visharu, Mayura, Sarpashiras)",
        "Speed variations and dynamic control",
        "Intricate footwork patterns",
        "Advanced coordination challenges",
        "Musical layering and polyrhythmic awareness"
      ]
    },
    {
      title: "Varnam Mastery",
      duration: "Months 4-6",
      topics: [
        "Learning a complete Varnam composition",
        "Understanding raga and tala structures",
        "Complex abhinaya (expression) sequences",
        "Character portrayal and storytelling",
        "Stage choreography and spatial awareness"
      ]
    },
    {
      title: "Padam & Javali",
      duration: "Months 7-9",
      topics: [
        "Emotional depth in classical compositions",
        "Subtle expression techniques",
        "Advanced mudra combinations",
        "Literary interpretation of lyrics",
        "Aesthetic theory (Rasa Shastra)"
      ]
    },
    {
      title: "Performance Repertoire",
      duration: "Months 10-12",
      topics: [
        "Building a 30-minute solo repertoire",
        "Tillana and energetic compositions",
        "Improvisation within classical framework",
        "Professional performance skills",
        "Teaching methodology basics"
      ]
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Advanced Curriculum
          </h2>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="space-y-8">
            {curriculumSections.map((section, index) => (
              <StaggerItem key={section.title}>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
                      {section.title}
                    </h3>
                    <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium md:ml-auto">
                      {section.duration}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {section.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{topic}</span>
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
 * Prerequisites Component
 * Shows what students need before joining intermediate
 */
function Prerequisites() {
  const requirements = [
    {
      category: "Technical Skills",
      items: [
        "Proficiency in basic Adavus (Tatta, Naattu, Visharu)",
        "Ability to maintain Araimandi for extended periods",
        "Understanding of fundamental rhythmic patterns",
        "Basic mudra vocabulary (single and double hand gestures)"
      ]
    },
    {
      category: "Performance Experience",
      items: [
        "Completed at least one public performance",
        "Demonstrated stage presence and confidence",
        "Ability to perform a 5-10 minute piece independently",
        "Understanding of costume and makeup basics"
      ]
    },
    {
      category: "Cultural Knowledge",
      items: [
        "Basic understanding of Bharatanatyam history",
        "Familiarity with Hindu mythology and stories",
        "Recognition of major ragas and talas",
        "Appreciation for classical music structure"
      ]
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prerequisites
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              To succeed in our intermediate program, students should have mastered these foundational elements
            </p>
          </div>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <StaggerItem key={req.category}>
                <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {req.category}
                  </h3>
                  <ul className="space-y-3">
                    {req.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1 flex-shrink-0">✓</span>
                        <span className="text-gray-700 text-sm">{item}</span>
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
 * Performance Opportunities Component
 * Highlights performance and competition opportunities
 */
function PerformanceOpportunities() {
  const opportunities = [
    {
      title: "Annual Recital",
      description: "Showcase your progress in our prestigious annual performance featuring all intermediate students",
      frequency: "Yearly",
      icon: "🎭"
    },
    {
      title: "Community Events",
      description: "Perform at cultural festivals, temple celebrations, and community gatherings",
      frequency: "Monthly",
      icon: "🏛️"
    },
    {
      title: "Competition Preparation",
      description: "Specialized coaching for dance competitions and festivals across North America",
      frequency: "As Needed",
      icon: "🏆"
    },
    {
      title: "Collaborative Performances",
      description: "Group pieces with live musicians and other art forms for unique presentations",
      frequency: "Quarterly",
      icon: "🎵"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Performance Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intermediate students gain valuable stage experience through various performance platforms
            </p>
          </div>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid md:grid-cols-2 gap-8">
            {opportunities.map((opportunity, index) => (
              <StaggerItem key={opportunity.title}>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start mb-4">
                    <span className="text-4xl mr-4">{opportunity.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {opportunity.title}
                        </h3>
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                          {opportunity.frequency}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {opportunity.description}
                      </p>
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
 * Main Intermediate Training Page
 */
function IntermediateTraining() {
  useEffect(() => {
    logger.info('Intermediate Training page mounted', {
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.debug('Intermediate Training page unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimationWrapper variant="fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Intermediate Training
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Advance your Bharatanatyam skills with complex choreography, deeper artistic expression, 
              and comprehensive performance training in our 12-month intensive program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">12 Months</div>
                <div className="text-gray-600">Duration</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">3-4x/Week</div>
                <div className="text-gray-600">Classes</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">Assessment</div>
                <div className="text-gray-600">Required</div>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </section>

      {/* Prerequisites */}
      <ErrorBoundary context="Prerequisites">
        <Prerequisites />
      </ErrorBoundary>

      {/* Advanced Curriculum */}
      <ErrorBoundary context="Advanced Curriculum">
        <AdvancedCurriculum />
      </ErrorBoundary>

      {/* Performance Opportunities */}
      <ErrorBoundary context="Performance Opportunities">
        <PerformanceOpportunities />
      </ErrorBoundary>

      {/* Enrollment Information */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimationWrapper variant="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Advance Your Art?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join our intermediate program and take your Bharatanatyam skills to the next level. 
              Assessment required for admission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/schedule"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                View Schedule
              </Link>
              <Link
                to="/contact?message=I'm interested in the Intermediate Training program and would like to schedule an assessment."
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                Schedule Assessment
              </Link>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  );
}

export default IntermediateTraining;