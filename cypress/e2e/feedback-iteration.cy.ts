describe('Feedback & Iteration - Product Launch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Feedback Collection System', () => {
    it('should have a feedback button/form in the app', () => {
      // Check for feedback button
      cy.get('[data-testid="feedback-button"]').should('be.visible');
      cy.get('[data-testid="feedback-button"]').should('contain', 'Feedback');
    });

    it('should open feedback modal when clicked', () => {
      // Click feedback button
      cy.get('[data-testid="feedback-button"]').click();
      
      // Check feedback modal is open
      cy.get('[data-testid="feedback-modal"]').should('be.visible');
      cy.get('[data-testid="feedback-form"]').should('be.visible');
    });

    it('should have comprehensive feedback form fields', () => {
      // Open feedback modal
      cy.get('[data-testid="feedback-button"]').click();
      
      // Check for feedback form fields
      cy.get('[data-testid="feedback-type"]').should('be.visible');
      cy.get('[data-testid="feedback-message"]').should('be.visible');
      cy.get('[data-testid="feedback-email"]').should('be.visible');
      cy.get('[data-testid="feedback-submit"]').should('be.visible');
    });

    it('should allow different types of feedback', () => {
      // Open feedback modal
      cy.get('[data-testid="feedback-button"]').click();
      
      // Check feedback type options
      cy.get('[data-testid="feedback-type"]').click();
      cy.get('[data-testid="feedback-option-bug"]').should('be.visible');
      cy.get('[data-testid="feedback-option-feature"]').should('be.visible');
      cy.get('[data-testid="feedback-option-general"]').should('be.visible');
    });

    it('should submit feedback successfully', () => {
      // Open feedback modal
      cy.get('[data-testid="feedback-button"]').click();
      
      // Fill feedback form
      cy.get('[data-testid="feedback-type"]').click();
      cy.get('[data-testid="feedback-option-bug"]').click();
      cy.get('[data-testid="feedback-message"]').type('This is a test feedback message');
      cy.get('[data-testid="feedback-email"]').type('test@example.com');
      
      // Submit feedback
      cy.get('[data-testid="feedback-submit"]').click();
      
      // Check success message
      cy.get('[data-testid="feedback-success"]').should('be.visible');
      cy.get('[data-testid="feedback-success"]').should('contain', 'Thank you');
    });

    it('should validate feedback form', () => {
      // Open feedback modal
      cy.get('[data-testid="feedback-button"]').click();
      
      // Try to submit empty form
      cy.get('[data-testid="feedback-submit"]').click();
      
      // Check validation errors
      cy.get('[data-testid="feedback-error"]').should('be.visible');
      cy.get('[data-testid="feedback-error"]').should('contain', 'required');
    });
  });

  describe('User Feedback Integration', () => {
    it('should integrate with feedback management system', () => {
      // Mock feedback submission
      cy.intercept('POST', '**/api/feedback', {
        statusCode: 201,
        body: { id: 123, message: 'Feedback submitted successfully' }
      }).as('feedbackSubmission');

      // Submit feedback
      cy.get('[data-testid="feedback-button"]').click();
      cy.get('[data-testid="feedback-message"]').type('Test feedback');
      cy.get('[data-testid="feedback-submit"]').click();
      
      // Check API call
      cy.wait('@feedbackSubmission');
    });

    it('should categorize feedback automatically', () => {
      // Open feedback modal
      cy.get('[data-testid="feedback-button"]').click();
      
      // Select different feedback types
      cy.get('[data-testid="feedback-type"]').click();
      cy.get('[data-testid="feedback-option-bug"]').click();
      cy.get('[data-testid="feedback-message"]').type('Bug report');
      cy.get('[data-testid="feedback-submit"]').click();
      
      // Check categorization
      cy.get('[data-testid="feedback-category"]').should('contain', 'Bug');
    });

    it('should include user context in feedback', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Submit feedback
      cy.get('[data-testid="feedback-button"]').click();
      cy.get('[data-testid="feedback-message"]').type('Test feedback with context');
      cy.get('[data-testid="feedback-submit"]').click();
      
      // Check user context is included
      cy.get('[data-testid="feedback-user-context"]').should('contain', 'user@example.com');
    });
  });

  describe('Usage Pattern Tracking', () => {
    it('should track user interactions for improvement planning', () => {
      // Mock analytics tracking
      cy.window().then((win) => {
        win.gtag = cy.stub().as('gtag');
      });

      // Perform various user interactions
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="primary-button"]').click();
      cy.get('[data-testid="search-input"]').type('test search');
      
      // Check that interactions are tracked
      cy.get('@gtag').should('have.been.calledMultiple', 3);
    });

    it('should track feature usage', () => {
      // Mock feature tracking
      cy.window().then((win) => {
        win.trackFeature = cy.stub().as('trackFeature');
      });

      // Use different features
      cy.get('[data-testid="sidebar-link-chatbot"]').click();
      cy.get('[data-testid="create-chatbot"]').click();
      
      cy.get('[data-testid="sidebar-link-workflows"]').click();
      cy.get('[data-testid="create-workflow"]').click();
      
      // Check feature tracking
      cy.get('@trackFeature').should('have.been.calledWith', 'chatbot_created');
      cy.get('@trackFeature').should('have.been.calledWith', 'workflow_created');
    });

    it('should track user journey patterns', () => {
      // Mock journey tracking
      cy.window().then((win) => {
        win.trackJourney = cy.stub().as('trackJourney');
      });

      // Simulate user journey
      cy.get('[data-testid="sidebar-link-dashboard"]').click();
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="sidebar-link-settings"]').click();
      
      // Check journey tracking
      cy.get('@trackJourney').should('have.been.calledWith', 'page_view', 'dashboard');
      cy.get('@trackJourney').should('have.been.calledWith', 'page_view', 'analytics');
      cy.get('@trackJourney').should('have.been.calledWith', 'page_view', 'settings');
    });

    it('should identify pain points in user flow', () => {
      // Mock error tracking
      cy.window().then((win) => {
        win.trackError = cy.stub().as('trackError');
      });

      // Simulate error scenarios
      cy.intercept('GET', '**/api/**', { forceNetworkError: true }).as('networkError');
      cy.get('[data-testid="fetch-data"]').click();
      
      // Check error tracking
      cy.get('@trackError').should('have.been.calledWith', 'network_error');
    });
  });

  describe('Iteration Planning System', () => {
    it('should collect data for feature prioritization', () => {
      // Mock feature request tracking
      cy.window().then((win) => {
        win.trackFeatureRequest = cy.stub().as('trackFeatureRequest');
      });

      // Submit feature request
      cy.get('[data-testid="feedback-button"]').click();
      cy.get('[data-testid="feedback-type"]').click();
      cy.get('[data-testid="feedback-option-feature"]').click();
      cy.get('[data-testid="feedback-message"]').type('Please add dark mode');
      cy.get('[data-testid="feedback-submit"]').click();
      
      // Check feature request tracking
      cy.get('@trackFeatureRequest').should('have.been.calledWith', 'dark_mode');
    });

    it('should track feature popularity', () => {
      // Mock popularity tracking
      cy.window().then((win) => {
        win.trackPopularity = cy.stub().as('trackPopularity');
      });

      // Use popular features
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="export-data"]').click();
      
      // Check popularity tracking
      cy.get('@trackPopularity').should('have.been.calledWith', 'analytics_page');
      cy.get('@trackPopularity').should('have.been.calledWith', 'export_feature');
    });

    it('should identify unused features', () => {
      // Mock feature usage tracking
      cy.window().then((win) => {
        win.trackFeatureUsage = cy.stub().as('trackFeatureUsage');
      });

      // Navigate without using certain features
      cy.get('[data-testid="sidebar-link-dashboard"]').click();
      cy.get('[data-testid="sidebar-link-settings"]').click();
      
      // Check that unused features are tracked
      cy.get('@trackFeatureUsage').should('not.have.been.calledWith', 'advanced_analytics');
    });
  });

  describe('User Satisfaction Metrics', () => {
    it('should collect user satisfaction scores', () => {
      // Mock satisfaction tracking
      cy.window().then((win) => {
        win.trackSatisfaction = cy.stub().as('trackSatisfaction');
      });

      // Rate satisfaction
      cy.get('[data-testid="satisfaction-rating"]').click();
      cy.get('[data-testid="rating-5"]').click();
      cy.get('[data-testid="submit-rating"]').click();
      
      // Check satisfaction tracking
      cy.get('@trackSatisfaction').should('have.been.calledWith', 5);
    });

    it('should track NPS scores', () => {
      // Mock NPS tracking
      cy.window().then((win) => {
        win.trackNPS = cy.stub().as('trackNPS');
      });

      // Complete NPS survey
      cy.get('[data-testid="nps-question"]').should('contain', 'How likely are you to recommend');
      cy.get('[data-testid="nps-score-9"]').click();
      cy.get('[data-testid="nps-submit"]').click();
      
      // Check NPS tracking
      cy.get('@trackNPS').should('have.been.calledWith', 9);
    });

    it('should collect qualitative feedback', () => {
      // Mock qualitative feedback tracking
      cy.window().then((win) => {
        win.trackQualitative = cy.stub().as('trackQualitative');
      });

      // Submit qualitative feedback
      cy.get('[data-testid="feedback-button"]').click();
      cy.get('[data-testid="feedback-message"]').type('The interface is very intuitive and easy to use. I love the dark mode feature!');
      cy.get('[data-testid="feedback-submit"]').click();
      
      // Check qualitative feedback tracking
      cy.get('@trackQualitative').should('have.been.calledWith', 'positive_feedback');
    });
  });

  describe('A/B Testing Framework', () => {
    it('should support A/B testing for features', () => {
      // Mock A/B testing
      cy.window().then((win) => {
        win.abTest = cy.stub().as('abTest');
      });

      // Check A/B test assignment
      cy.get('[data-testid="ab-test-variant"]').should('exist');
      
      // Check A/B test tracking
      cy.get('@abTest').should('have.been.calledWith', 'new_feature_test');
    });

    it('should track A/B test conversions', () => {
      // Mock conversion tracking
      cy.window().then((win) => {
        win.trackConversion = cy.stub().as('trackConversion');
      });

      // Perform conversion action
      cy.get('[data-testid="conversion-action"]').click();
      
      // Check conversion tracking
      cy.get('@trackConversion').should('have.been.calledWith', 'feature_adoption');
    });
  });

  describe('Continuous Improvement Loop', () => {
    it('should implement feedback-driven development', () => {
      // Mock feedback analysis
      cy.window().then((win) => {
        win.analyzeFeedback = cy.stub().as('analyzeFeedback');
      });

      // Submit multiple feedback items
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="feedback-button"]').click();
        cy.get('[data-testid="feedback-message"]').type(`Feedback item ${i + 1}`);
        cy.get('[data-testid="feedback-submit"]').click();
        cy.get('[data-testid="feedback-modal"]').should('not.be.visible');
      }
      
      // Check feedback analysis
      cy.get('@analyzeFeedback').should('have.been.called');
    });

    it('should prioritize improvements based on user data', () => {
      // Mock prioritization algorithm
      cy.window().then((win) => {
        win.prioritizeImprovements = cy.stub().as('prioritizeImprovements');
      });

      // Trigger improvement prioritization
      cy.get('[data-testid="analyze-improvements"]').click();
      
      // Check prioritization
      cy.get('@prioritizeImprovements').should('have.been.called');
    });

    it('should measure improvement impact', () => {
      // Mock impact measurement
      cy.window().then((win) => {
        win.measureImpact = cy.stub().as('measureImpact');
      });

      // Measure impact of improvements
      cy.get('[data-testid="measure-impact"]').click();
      
      // Check impact measurement
      cy.get('@measureImpact').should('have.been.called');
    });
  });
}); 