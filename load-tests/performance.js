const { check } = require('k6');
const http = require('k6/http');

// Load test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
  },
};

// Test scenarios
export default function () {
  const baseUrl = 'http://localhost:5174';

  // Test dashboard loading
  const dashboardResponse = http.get(`${baseUrl}/dashboard`);
  check(dashboardResponse, {
    'dashboard loads successfully': (r) => r.status === 200,
    'dashboard loads fast': (r) => r.timings.duration < 1000,
  });

  // Test API endpoints
  const apiResponse = http.get(`${baseUrl}/api/analytics`);
  check(apiResponse, {
    'API responds successfully': (r) => r.status === 200,
    'API responds fast': (r) => r.timings.duration < 500,
  });

  // Test search functionality
  const searchResponse = http.get(`${baseUrl}/api/search?q=test`);
  check(searchResponse, {
    'Search works': (r) => r.status === 200,
    'Search is fast': (r) => r.timings.duration < 300,
  });

  // Simulate user interactions
  const userData = {
    email: 'test@example.com',
    password: 'password123',
  };

  const loginResponse = http.post(`${baseUrl}/api/auth/login`, JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'Login works': (r) => r.status === 200,
    'Login is fast': (r) => r.timings.duration < 1000,
  });
} 