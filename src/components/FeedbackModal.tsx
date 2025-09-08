import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Crea email link con tutti i dati
      const subject = `AI Orchestrator Feedback - ${email} (${company || 'No Company'})`;
      const body = `
AI Orchestrator Feedback Submission

Rating: ${rating}/5 stars
${'⭐'.repeat(rating)} ${rating === 1 && 'Poor' || rating === 2 && 'Fair' || rating === 3 && 'Good' || rating === 4 && 'Very Good' || rating === 5 && 'Excellent'}

Selected Questions:
${selectedQuestions.length > 0 ? selectedQuestions.map(q => `• ${q}`).join('\n') : 'No specific questions selected'}

Feedback:
${feedback || 'No feedback provided'}

Additional Feedback:
${additionalFeedback || 'No additional feedback'}

Contact Information:
Email: ${email}
Company: ${company || 'N/A'}
Date: ${new Date().toLocaleString()}

---
This feedback was submitted through the AI Orchestrator Demo.
      `;
      
      // Apri email client con dati precompilati
      const mailtoLink = `mailto:aiorchestratoor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Prova prima con window.location.href, poi con window.open
      try {
        window.location.href = mailtoLink;
      } catch (error) {
        // Fallback se window.location.href non funziona
        const newWindow = window.open(mailtoLink, '_blank');
        if (!newWindow) {
          // Se anche window.open fallisce, copia il link negli appunti
          navigator.clipboard.writeText(mailtoLink).then(() => {
            alert('Email client blocked. Link copied to clipboard!');
          });
        }
      }
      
      onSuccess();
      onClose();
      
      // Reset form
      setRating(0);
      setFeedback('');
      setEmail('');
      setCompany('');
      setSelectedQuestions([]);
      setAdditionalFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Still show success for demo purposes
      onSuccess();
      onClose();
      
      // Reset form
      setRating(0);
      setFeedback('');
      setEmail('');
      setCompany('');
      setSelectedQuestions([]);
      setAdditionalFeedback('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">💬 Help us improve AI Orchestrator</h3>
          <p className="text-gray-600">Your feedback helps us build the perfect AI automation platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate this demo?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 text-2xl transition-all duration-200 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to know more about? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'Pricing and plans',
                'Integration capabilities',
                'AI model customization',
                'Team collaboration features',
                'Security and compliance',
                'API documentation',
                'Custom workflow creation',
                'Mobile app availability'
              ].map((question) => (
                <label key={question} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuestions([...selectedQuestions, question]);
                      } else {
                        setSelectedQuestions(selectedQuestions.filter(q => q !== question));
                      }
                    }}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{question}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What did you like most? What could be improved?
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us what impressed you and what we can improve..."
              rows={4}
            />
          </div>

          {/* Additional Feedback */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any additional thoughts or suggestions?
            </label>
            <textarea
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share any other ideas, concerns, or suggestions..."
              rows={3}
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email for early access <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Company */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Company"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!email || isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback & Join Early Access'}
            </button>
          </div>

          {/* Early Access Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Get Early Access</h3>
              <p className="text-sm text-blue-700 mb-3">
                Be the first to experience AI Orchestrator when we launch!
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <p>✅ Free for 6 months</p>
                <p>✅ Priority support</p>
                <p>✅ Direct input on features</p>
                <p>✅ Exclusive launch event invite</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
