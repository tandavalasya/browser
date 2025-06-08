/**
 * Beginner Classes Detail Page
 * 
 * Comprehensive information about beginner-level Bharatanatyam classes,
 * including syllabus, focus areas, and progression pathways.
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
 * Course Curriculum Component
 * Displays structured curriculum information
 */
function CourseCurriculum() {
  const curriculumSections = [
    {
      title: "Foundation & Posture",
      duration: "Months 1-2",
      topics: [
        "Basic Bharatanatyam posture (Araimandi)",
        "Hand positions (Hastas) - Single hand gestures",
        "Eye movements (Drishti Bhedas)",
        "Neck movements (Griva Bhedas)",
        "Cultural context and history of Bharatanatyam"
      ]
    },
    {
      title: "Basic Movements",
      duration: "Months 3-4",
      topics: [
        "Fundamental foot movements (Adavus)",
        "Tatta Adavu (basic striking steps)",
        "Naattu Adavu (stretching movements)",
        "Coordination of hands and feet",
        "Introduction to rhythm and counting"
      ]
    },
    {
      title: "Expression & Storytelling",
      duration: "Months 5-6",
      topics: [
        "Facial expressions (Navarasas)",
        "Double hand gestures (Mudras)",
        "Simple storytelling through dance",
        "Basic Bhajan or devotional piece",
        "Stage presence and confidence building"
      ]
    },
    {
      title: "First Performance Piece",
      duration: "Months 7-8",
      topics: [
        "Learning a complete Alarippu or Jatisvaram",
        "Understanding musical structure",
        "Costume and makeup basics",
        "Performance preparation",
        "Graduation showcase preparation"
      ]
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Course Curriculum
          </h2>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="space-y-8">
            {curriculumSections.map((section, index) => (
              <StaggerItem key={section.title}>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
                      {section.title}
                    </h3>
                    <span className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium md:ml-auto">
                      {section.duration}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {section.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start">
                        <span className="text-pink-500 mr-2 mt-1">•</span>
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
 * Learning Outcomes Component
 * Highlights what students will achieve
 */
function LearningOutcomes() {
  const outcomes = [
    {
      icon: "🎭",
      title: "Cultural Foundation",
      description: "Deep understanding of Bharatanatyam's history, significance, and place in Indian classical arts"
    },
    {
      icon: "💪",
      title: "Physical Conditioning",
      description: "Improved flexibility, strength, and stamina through traditional training methods"
    },
    {
      icon: "🎨",
      title: "Artistic Expression",
      description: "Ability to convey emotions and stories through facial expressions and body language"
    },
    {
      icon: "🎵",
      title: "Rhythmic Awareness",
      description: "Understanding of Carnatic music rhythms and their application in dance"
    },
    {
      icon: "🏆",
      title: "Performance Ready",
      description: "Confidence to perform a complete piece in front of an audience"
    },
    {
      icon: "📚",
      title: "Technical Skills",
      description: "Mastery of basic Adavus and fundamental movement vocabulary"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learning Outcomes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              By the end of our beginner program, students will have achieved these key milestones
            </p>
          </div>
        </AnimationWrapper>

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((outcome, index) => (
              <StaggerItem key={outcome.title}>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="text-4xl mb-4 text-center">{outcome.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                    {outcome.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {outcome.description}
                  </p>
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
 * Main Beginner Classes Page
 * Comprehensive overview of the beginner program
 */
function BeginnerClasses() {
  useEffect(() => {
    logger.info('Beginner Classes page mounted', {
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.debug('Beginner Classes page unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimationWrapper variant="fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Beginner Classes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Perfect for those new to Bharatanatyam. Build a strong foundation 
              in this classical Indian dance form with our comprehensive 8-month program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-pink-600">8 Months</div>
                <div className="text-gray-600">Program Duration</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-pink-600">2-3x/Week</div>
                <div className="text-gray-600">Class Frequency</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-pink-600">No Experience</div>
                <div className="text-gray-600">Required</div>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </section>

      {/* Course Curriculum */}
      <ErrorBoundary context="Course Curriculum">
        <CourseCurriculum />
      </ErrorBoundary>

      {/* Learning Outcomes */}
      <ErrorBoundary context="Learning Outcomes">
        <LearningOutcomes />
      </ErrorBoundary>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimationWrapper variant="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Join our supportive community and discover the beauty of Bharatanatyam. 
              Classes start every month with limited spots available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/schedule"
                className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                View Class Schedule
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-pink-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  );
}

export default BeginnerClasses; 