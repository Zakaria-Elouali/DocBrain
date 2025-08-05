// Mock data for signature requests
// This file simulates API responses until the backend is implemented

// Sample signature requests
const mockSignatureRequests = [
  {
    id: 'sig-001',
    documentId: 'doc-001',
    documentName: 'Contract Agreement.pdf',
    documentType: 'application/pdf',
    requestDate: '2023-10-05T14:30:00Z',
    dueDate: '2023-10-12T23:59:59Z',
    status: 'Pending',
    requestedBy: 'John Smith (Attorney)',
    priority: 'High',
    description: 'Please sign this contract agreement as soon as possible.'
  },
  {
    id: 'sig-002',
    documentId: 'doc-004',
    documentName: 'Tax Documents.pdf',
    documentType: 'application/pdf',
    requestDate: '2023-10-08T09:15:00Z',
    dueDate: '2023-10-15T23:59:59Z',
    status: 'Pending',
    requestedBy: 'Sarah Johnson (Tax Advisor)',
    priority: 'Medium',
    description: 'These tax documents require your signature for filing.'
  },
  {
    id: 'sig-003',
    documentId: 'doc-006',
    documentName: 'Power of Attorney.pdf',
    documentType: 'application/pdf',
    requestDate: '2023-09-28T11:45:00Z',
    dueDate: '2023-10-05T23:59:59Z',
    status: 'Overdue',
    requestedBy: 'Michael Brown (Attorney)',
    priority: 'Urgent',
    description: 'This power of attorney document is urgent and overdue.'
  },
  {
    id: 'sig-004',
    documentId: 'doc-007',
    documentName: 'Property Purchase Agreement.pdf',
    documentType: 'application/pdf',
    requestDate: '2023-09-20T16:30:00Z',
    dueDate: '2023-09-27T23:59:59Z',
    status: 'Signed',
    signedDate: '2023-09-25T10:20:00Z',
    requestedBy: 'Emily Davis (Real Estate Agent)',
    priority: 'High',
    description: 'Property purchase agreement that has been signed.'
  },
  {
    id: 'sig-005',
    documentId: 'doc-008',
    documentName: 'Consent Form.pdf',
    documentType: 'application/pdf',
    requestDate: '2023-10-01T13:10:00Z',
    dueDate: '2023-10-08T23:59:59Z',
    status: 'Declined',
    declinedDate: '2023-10-02T09:45:00Z',
    declineReason: 'Information in the document is incorrect.',
    requestedBy: 'Robert Wilson (Administrator)',
    priority: 'Low',
    description: 'Standard consent form for our records.'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockSignatureRequestsAPI = {
  // Fetch all signature requests
  fetchSignatureRequests: async () => {
    await delay(800); // Simulate network delay
    return [...mockSignatureRequests];
  },
  
  // View signature document
  viewSignatureDocument: async (requestId) => {
    await delay(600); // Simulate loading time
    
    const request = mockSignatureRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Signature request not found');
    }
    
    // Return document metadata and mock content
    return {
      ...request,
      content: `This is a mock document content for ${request.documentName}`,
      pages: 3,
      size: 1024 * 1024 * 1.5, // 1.5 MB
      createdAt: request.requestDate,
      signatureFields: [
        {
          id: 'sig-field-1',
          page: 2,
          position: { x: 100, y: 200, width: 200, height: 50 },
          type: 'signature',
          required: true
        },
        {
          id: 'sig-field-2',
          page: 3,
          position: { x: 100, y: 400, width: 200, height: 50 },
          type: 'date',
          required: true
        }
      ]
    };
  },
  
  // Sign document
  signDocument: async (requestId, signatureData) => {
    await delay(1200); // Simulate signing process
    
    const requestIndex = mockSignatureRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      throw new Error('Signature request not found');
    }
    
    // Update the request with signature information
    mockSignatureRequests[requestIndex] = {
      ...mockSignatureRequests[requestIndex],
      status: 'Signed',
      signedDate: signatureData.signatureDate || new Date().toISOString(),
      signatureMethod: signatureData.signatureMethod || 'Electronic'
    };
    
    return mockSignatureRequests[requestIndex];
  },
  
  // Decline signature request
  declineSignatureRequest: async (requestId, reason) => {
    await delay(800); // Simulate process
    
    const requestIndex = mockSignatureRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      throw new Error('Signature request not found');
    }
    
    // Update the request with decline information
    mockSignatureRequests[requestIndex] = {
      ...mockSignatureRequests[requestIndex],
      status: 'Declined',
      declinedDate: new Date().toISOString(),
      declineReason: reason || 'No reason provided'
    };
    
    return mockSignatureRequests[requestIndex];
  }
};

export default mockSignatureRequestsAPI;
