const EventSource = require('eventsource');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlZGlAZ21haWwuY29tIiwidXNlcklkIjoxLCJ1c2VybmFtZSI6ImZlZGkiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxNTM3NDA4MCwiZXhwIjoxNzE1NDYwNDgwfQ.eOWHPQX1leRi5zIXvM9jiGFtB2H6dh578QSXiZjA-gU'

function connectToSSE() {
  const eventSource = new EventSource('http://localhost:4000/cvs/sse', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  eventSource.onmessage = (event) => {
    console.log('New message:', event);
  };

  eventSource.onerror = (error) => {
    console.error('EventSource error:', error);
    
    
  };
}

// Start the initial connection
connectToSSE();
