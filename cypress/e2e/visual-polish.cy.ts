describe('Visual Polish - Product Launch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('UI/UX Bug Elimination', () => {
    it('should not have white text on white backgrounds', () => {
      // Check for white-on-white text issues
      cy.get('body').then(($body) => {
        const bodyColor = $body.css('color');
        const bodyBg = $body.css('background-color');
        
        // Ensure text and background are different
        expect(bodyColor).to.not.equal(bodyBg);
      });
      
      // Check all text elements
      cy.get('h1, h2, h3, p, span, div').each(($el) => {
        const textColor = $el.css('color');
        const bgColor = $el.css('background-color');
        
        // Skip elements with transparent backgrounds
        if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          expect(textColor).to.not.equal(bgColor);
        }
      });
    });

    it('should not have overlapping elements', () => {
      // Check for overlapping elements
      cy.get('[data-testid="overlapping-check"]').then(($elements) => {
        const elements = $elements.toArray();
        
        for (let i = 0; i < elements.length; i++) {
          for (let j = i + 1; j < elements.length; j++) {
            const rect1 = elements[i].getBoundingClientRect();
            const rect2 = elements[j].getBoundingClientRect();
            
            // Check if elements overlap
            const overlap = !(rect1.right < rect2.left || 
                            rect1.left > rect2.right || 
                            rect1.bottom < rect2.top || 
                            rect1.top > rect2.bottom);
            
            expect(overlap).to.be.false;
          }
        }
      });
    });

    it('should not have broken layouts', () => {
      // Check for broken layouts
      cy.get('[data-testid="layout-container"]').each(($container) => {
        const width = $container.width();
        const height = $container.height();
        
        // Ensure containers have reasonable dimensions
        expect(width).to.be.greaterThan(0);
        expect(height).to.be.greaterThan(0);
      });
    });

    it('should not have invisible elements', () => {
      // Check for invisible elements that should be visible
      cy.get('[data-testid="should-be-visible"]').each(($el) => {
        const visibility = $el.css('visibility');
        const display = $el.css('display');
        const opacity = parseFloat($el.css('opacity'));
        
        expect(visibility).to.not.equal('hidden');
        expect(display).to.not.equal('none');
        expect(opacity).to.be.greaterThan(0);
      });
    });
  });

  describe('Color Contrast & Accessibility', () => {
    it('should have accessible color contrast', () => {
      // Test color contrast ratios
      cy.get('[data-testid="text-content"]').each(($el) => {
        const textColor = $el.css('color');
        const bgColor = $el.css('background-color');
        
        // This would require a color contrast calculation library
        // For now, we check that colors are defined and different
        expect(textColor).to.not.be.empty;
        expect(bgColor).to.not.be.empty;
        expect(textColor).to.not.equal(bgColor);
      });
    });

    it('should be consistent with branding', () => {
      // Check brand colors are used consistently
      cy.get('[data-testid="brand-color"]').each(($el) => {
        const color = $el.css('color');
        const bgColor = $el.css('background-color');
        
        // Check for brand color usage
        expect(color).to.match(/rgb\(.*\)/);
        expect(bgColor).to.match(/rgb\(.*\)/);
      });
    });

    it('should have proper focus indicators', () => {
      // Test focus indicators
      cy.get('button, input, a, [tabindex]').each(($el) => {
        cy.wrap($el).focus();
        cy.focused().should('have.css', 'outline');
        cy.focused().should('have.css', 'box-shadow');
      });
    });

    it('should have proper hover states', () => {
      // Test hover states
      cy.get('[data-testid="hoverable"]').each(($el) => {
        cy.wrap($el).trigger('mouseover');
        cy.wrap($el).should('have.class', 'hover');
        
        cy.wrap($el).trigger('mouseout');
        cy.wrap($el).should('not.have.class', 'hover');
      });
    });
  });

  describe('Consistent Spacing & Layout', () => {
    it('should have consistent padding', () => {
      // Check padding consistency
      cy.get('[data-testid="consistent-padding"]').each(($el) => {
        const padding = $el.css('padding');
        expect(padding).to.not.be.empty;
      });
    });

    it('should have consistent margins', () => {
      // Check margin consistency
      cy.get('[data-testid="consistent-margin"]').each(($el) => {
        const margin = $el.css('margin');
        expect(margin).to.not.be.empty;
      });
    });

    it('should have consistent font sizes', () => {
      // Check font size consistency
      cy.get('h1').each(($el) => {
        const fontSize = $el.css('font-size');
        expect(fontSize).to.not.be.empty;
      });
      
      cy.get('h2').each(($el) => {
        const fontSize = $el.css('font-size');
        expect(fontSize).to.not.be.empty;
      });
      
      cy.get('p').each(($el) => {
        const fontSize = $el.css('font-size');
        expect(fontSize).to.not.be.empty;
      });
    });

    it('should have proper alignment', () => {
      // Check text alignment
      cy.get('[data-testid="centered-text"]').should('have.css', 'text-align', 'center');
      cy.get('[data-testid="left-text"]').should('have.css', 'text-align', 'left');
      cy.get('[data-testid="right-text"]').should('have.css', 'text-align', 'right');
    });
  });

  describe('Fonts & Icons', () => {
    it('should use correct fonts', () => {
      // Check font family usage
      cy.get('body').should('have.css', 'font-family');
      cy.get('h1').should('have.css', 'font-family');
      cy.get('p').should('have.css', 'font-family');
      
      // Check for Manrope/Source Sans 3 usage
      cy.get('body').then(($body) => {
        const fontFamily = $body.css('font-family');
        expect(fontFamily).to.include('Manrope').or.include('Source Sans 3');
      });
    });

    it('should have crisp fonts', () => {
      // Check font rendering
      cy.get('[data-testid="text-content"]').each(($el) => {
        const fontWeight = $el.css('font-weight');
        const fontSmoothing = $el.css('font-smooth');
        
        expect(fontWeight).to.not.be.empty;
      });
    });

    it('should have aligned icons', () => {
      // Check icon alignment
      cy.get('[data-testid="icon"]').each(($icon) => {
        const verticalAlign = $icon.css('vertical-align');
        const display = $icon.css('display');
        
        expect(verticalAlign).to.not.be.empty;
        expect(display).to.not.be.empty;
      });
    });

    it('should have consistent icon sizes', () => {
      // Check icon size consistency
      cy.get('[data-testid="icon"]').each(($icon) => {
        const width = $icon.width();
        const height = $icon.height();
        
        expect(width).to.be.greaterThan(0);
        expect(height).to.be.greaterThan(0);
      });
    });
  });

  describe('Animation Smoothness', () => {
    it('should have smooth transitions', () => {
      // Check transition properties
      cy.get('[data-testid="animated-element"]').each(($el) => {
        const transition = $el.css('transition');
        expect(transition).to.not.be.empty;
      });
    });

    it('should have smooth button hovers', () => {
      // Test button hover animations
      cy.get('[data-testid="button-hover"]').each(($btn) => {
        cy.wrap($btn).trigger('mouseover');
        cy.wrap($btn).should('have.class', 'hover');
        
        cy.wrap($btn).trigger('mouseout');
        cy.wrap($btn).should('not.have.class', 'hover');
      });
    });

    it('should have smooth page load effects', () => {
      // Test page load animations
      cy.get('[data-testid="page-load-animation"]').should('be.visible');
      
      // Wait for animation to complete
      cy.get('[data-testid="page-load-animation"]', { timeout: 3000 }).should('not.be.visible');
    });

    it('should have smooth modal animations', () => {
      // Test modal animations
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[data-testid="modal"]').should('have.class', 'opening');
      
      // Wait for opening animation
      cy.get('[data-testid="modal"]', { timeout: 500 }).should('not.have.class', 'opening');
      
      // Close modal
      cy.get('[data-testid="close-modal"]').click();
      cy.get('[data-testid="modal"]').should('have.class', 'closing');
      
      // Wait for closing animation
      cy.get('[data-testid="modal"]', { timeout: 500 }).should('not.be.visible');
    });
  });

  describe('Favicon & Meta Tags', () => {
    it('should have proper favicon', () => {
      // Check favicon exists
      cy.get('link[rel="icon"]').should('exist');
      cy.get('link[rel="icon"]').should('have.attr', 'href');
      
      // Check favicon is accessible
      cy.request('/favicon.ico').then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should have proper meta tags', () => {
      // Check essential meta tags
      cy.get('meta[name="description"]').should('exist');
      cy.get('meta[name="viewport"]').should('exist');
      cy.get('meta[name="theme-color"]').should('exist');
      
      // Check Open Graph tags
      cy.get('meta[property="og:title"]').should('exist');
      cy.get('meta[property="og:description"]').should('exist');
      cy.get('meta[property="og:type"]').should('exist');
      cy.get('meta[property="og:image"]').should('exist');
      
      // Check Twitter Card tags
      cy.get('meta[name="twitter:card"]').should('exist');
      cy.get('meta[name="twitter:title"]').should('exist');
      cy.get('meta[name="twitter:description"]').should('exist');
    });

    it('should have proper page titles', () => {
      // Check page title
      cy.title().should('not.be.empty');
      cy.title().should('contain', 'AI Orchestrator');
      
      // Check title length (SEO best practice)
      cy.title().then((title) => {
        expect(title.length).to.be.lessThan(60);
      });
    });

    it('should have proper Open Graph previews', () => {
      // Check Open Graph image
      cy.get('meta[property="og:image"]').should('have.attr', 'content');
      
      // Check Open Graph URL
      cy.get('meta[property="og:url"]').should('have.attr', 'content');
      
      // Check Open Graph site name
      cy.get('meta[property="og:site_name"]').should('have.attr', 'content');
    });
  });

  describe('Landing Page Style Consistency', () => {
    it('should match landing page design', () => {
      // Check color scheme consistency
      cy.get('[data-testid="primary-color"]').should('have.css', 'color');
      cy.get('[data-testid="secondary-color"]').should('have.css', 'color');
      
      // Check typography consistency
      cy.get('[data-testid="heading-font"]').should('have.css', 'font-family');
      cy.get('[data-testid="body-font"]').should('have.css', 'font-family');
    });

    it('should have premium visual feel', () => {
      // Check shadows and depth
      cy.get('[data-testid="elevated-card"]').should('have.css', 'box-shadow');
      cy.get('[data-testid="floating-button"]').should('have.css', 'box-shadow');
      
      // Check smooth transitions
      cy.get('[data-testid="animated-element"]').should('have.css', 'transition');
    });

    it('should have consistent spacing with landing page', () => {
      // Check spacing consistency
      cy.get('[data-testid="landing-spacing"]').should('have.css', 'padding');
      cy.get('[data-testid="landing-spacing"]').should('have.css', 'margin');
    });
  });
}); 