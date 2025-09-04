import React, { useState, useEffect } from 'react';
import { Card, Button, Text, Badge, Select, SelectItem } from '@tremor/react';
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from 'react-joyride';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  category: 'getting-started' | 'feature' | 'advanced';
  duration: string;
  prerequisites?: string[];
  completionReward?: string;
}

interface HelpTip {
  id: string;
  element: string;
  title: string;
  content: string;
  category: string;
}

interface TutorialProgress {
  id: string;
  completed: boolean;
  lastStep: number;
  completedAt?: Date;
}

const TutorialSystem: React.FC = () => {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [runTutorial, setRunTutorial] = useState(false);
  const [helpTips, setHelpTips] = useState<HelpTip[]>([]);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Example tutorials
  const tutorials: Tutorial[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of the platform',
      category: 'getting-started',
      duration: '5 minutes',
      completionReward: '🏆 Platform Basics Badge',
      steps: [
        {
          target: '.dashboard-overview',
          content: 'Welcome to your dashboard! This is where you can monitor all your key metrics.',
          disableBeacon: true,
          placement: 'bottom',
          styles: {
            options: {
              zIndex: 10000,
            },
          },
        },
        {
          target: '.usage-metrics',
          content: 'Track your resource usage and quotas here.',
          disableBeacon: true,
          placement: 'right',
        },
        {
          target: '.settings-panel',
          content: 'Configure your workspace settings and preferences.',
          disableBeacon: true,
          placement: 'left',
        },
      ],
    },
    {
      id: 'feature-flags',
      title: 'Feature Flags Management',
      description: 'Learn how to use feature flags',
      category: 'feature',
      duration: '8 minutes',
      prerequisites: ['getting-started'],
      completionReward: '🚀 Feature Management Expert Badge',
      steps: [
        {
          target: '.feature-flags-list',
          content: 'View and manage all your feature flags here.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '.create-flag-button',
          content: 'Click here to create a new feature flag.',
          disableBeacon: true,
          placement: 'right',
        },
      ],
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      description: 'Master the analytics dashboard',
      category: 'advanced',
      duration: '15 minutes',
      prerequisites: ['getting-started', 'feature-flags'],
      completionReward: '📊 Analytics Master Badge',
      steps: [
        {
          target: '.analytics-dashboard',
          content: 'Explore advanced analytics features.',
          disableBeacon: true,
        },
      ],
    },
  ];

  useEffect(() => {
    // Example help tips
    const defaultHelpTips: HelpTip[] = [
      {
        id: 'dashboard-help',
        element: '.dashboard-overview',
        title: 'Dashboard Overview',
        content: 'Get a quick overview of your system status and key metrics.',
        category: 'general',
      },
      {
        id: 'usage-help',
        element: '.usage-metrics',
        title: 'Usage Metrics',
        content: 'Monitor your resource consumption and usage trends.',
        category: 'metrics',
      },
    ];

    setHelpTips(defaultHelpTips);
    // Load tutorial progress from localStorage
    const savedProgress = localStorage.getItem('tutorialProgress');
    if (savedProgress) {
      setTutorialProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleTutorialCallback = (data: CallBackProps) => {
    const { action, index, status, type: _type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      if (status === STATUS.FINISHED) {
        // Update tutorial progress
        const progress: TutorialProgress = {
          id: activeTutorial?.id || '',
          completed: true,
          lastStep: index + 1,
          completedAt: new Date(),
        };
        const newProgress = [...tutorialProgress.filter(p => p.id !== progress.id), progress];
        setTutorialProgress(newProgress);
        localStorage.setItem('tutorialProgress', JSON.stringify(newProgress));

        // Show completion message
        if (activeTutorial?.completionReward) {
          alert(`Congratulations! You've earned: ${activeTutorial.completionReward}`);
        }
      }
      setRunTutorial(false);
      setActiveTutorial(null);
    } else if (action === ACTIONS.CLOSE) {
      // Save progress
      const progress: TutorialProgress = {
        id: activeTutorial?.id || '',
        completed: false,
        lastStep: index,
      };
      const newProgress = [...tutorialProgress.filter(p => p.id !== progress.id), progress];
      setTutorialProgress(newProgress);
      localStorage.setItem('tutorialProgress', JSON.stringify(newProgress));
    }
  };

  const startTutorial = (tutorial: Tutorial) => {
    // Check prerequisites
    const prerequisites = tutorial.prerequisites || [];
    if (prerequisites.length > 0) {
      const incompletePrerequistes = prerequisites.filter(
        prereq => !tutorialProgress.find(p => p.id === prereq && p.completed)
      );
      if (incompletePrerequistes.length) {
        const missingTutorials = incompletePrerequistes
          .map(id => tutorials.find(t => t.id === id)?.title)
          .join(', ');
        alert(`Please complete these tutorials first: ${missingTutorials}`);
        return;
      }
    }

    setActiveTutorial(tutorial);
    setRunTutorial(true);
  };

  const getTutorialStatus = (tutorial: Tutorial) => {
    const progress = tutorialProgress.find(p => p.id === tutorial.id);
    if (!progress) return 'Not Started';
    if (progress.completed) return 'Completed';
    return `In Progress (${progress.lastStep} / ${tutorial.steps.length} steps)`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'Not Started':
        return 'gray';
      default:
        return 'yellow';
    }
  };

  const filteredTutorials = tutorials.filter(
    tutorial => selectedCategory === 'all' || tutorial.category === selectedCategory
  );

  return (
    <div className="space-y-6 p-4">
      {/* Tutorial Selection */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tutorials & Help</h2>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
            className="w-48"
          >
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="getting-started">Getting Started</SelectItem>
            <SelectItem value="feature">Features</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} decoration="left" decorationColor={
              getTutorialStatus(tutorial) === 'Completed' ? 'green' :
              getTutorialStatus(tutorial).includes('In Progress') ? 'yellow' : 'gray'
            }>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Text className="font-semibold">{tutorial.title}</Text>
                    <Badge color={getStatusColor(getTutorialStatus(tutorial))}>
                      {getTutorialStatus(tutorial)}
                    </Badge>
                  </div>
                  <Text className="text-gray-600">{tutorial.description}</Text>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>⏱️ {tutorial.duration}</span>
                    {tutorial.completionReward && (
                      <span>🏆 Reward: {tutorial.completionReward}</span>
                    )}
                  </div>
                  {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                    <Text className="text-sm text-gray-500">
                      Prerequisites: {tutorial.prerequisites.map(id => 
                        tutorials.find(t => t.id === id)?.title
                      ).join(', ')}
                    </Text>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startTutorial(tutorial)}
                  disabled={
                    tutorial.prerequisites?.some(
                      prereq => !tutorialProgress.find(p => p.id === prereq && p.completed)
                    ) || false
                  }
                  className="hover:bg-blue-50"
                >
                  {getTutorialStatus(tutorial) === 'Completed' ? 'Replay' : 'Start'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Documentation Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Text className="font-semibold">Documentation</Text>
          <Button
            variant="secondary"
            onClick={() => setShowDocumentation(!showDocumentation)}
            className="hover:bg-blue-50"
          >
            {showDocumentation ? 'Hide' : 'Show'} Documentation
          </Button>
        </div>
        {showDocumentation && (
          <div className="prose max-w-none space-y-4">
            <div>
              <h3>Platform Documentation</h3>
              <p>
                Welcome to our comprehensive documentation. Here you'll find detailed guides,
                tutorials, and reference materials to help you make the most of our platform.
              </p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li>Getting Started Guide</li>
                <li>API Reference</li>
                <li>Best Practices</li>
                <li>Troubleshooting</li>
              </ul>
            </div>
            <div>
              <h4>Video Tutorials</h4>
              <p>
                Check out our video tutorials for step-by-step guidance on using platform features.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Active Tutorial */}
      {activeTutorial && (
        <Joyride
          steps={activeTutorial.steps}
          run={runTutorial}
          continuous
          showProgress
          showSkipButton
          callback={handleTutorialCallback}
          styles={{
            options: {
              primaryColor: '#3b82f6',
              zIndex: 10000,
            },
            tooltip: {
              padding: '20px',
            },
            buttonNext: {
              backgroundColor: '#3b82f6',
            },
            buttonBack: {
              color: '#3b82f6',
            },
          }}
          locale={{
            last: 'Complete',
            skip: 'Exit Tutorial',
          }}
        />
      )}

      {/* Contextual Help Tooltips */}
      {helpTips.map((tip) => (
        <div
          key={tip.id}
          className="help-tooltip"
          data-tip={tip.content}
          data-for={tip.id}
        >
          {/* Help icon or indicator */}
        </div>
      ))}
    </div>
  );
};

export default TutorialSystem; 