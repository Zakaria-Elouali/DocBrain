// Mock data for client documents
// This file simulates API responses until the backend is implemented

// Sample client documents
const mockClientDocuments = [
  {
    id: 'doc-001',
    name: 'Contract Agreement.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 2.3, // 2.3 MB
    date: '2023-05-15T10:30:00Z',
    status: 'Pending',
    requiresSignature: true,
    vaultId: 'vault-1' // Personal Documents
  },
  {
    id: 'doc-002',
    name: 'Property Deed.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 1.5, // 1.5 MB
    date: '2023-06-22T14:45:00Z',
    status: 'Signed',
    requiresSignature: true,
    signedDate: '2023-06-25T09:15:00Z',
    signedBy: 'John Doe',
    vaultId: 'vault-3' // Legal Documents
  },
  {
    id: 'doc-003',
    name: 'Meeting Notes.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1024 * 512, // 512 KB
    date: '2023-07-10T11:20:00Z',
    status: 'Completed',
    requiresSignature: false,
    vaultId: 'vault-1' // Personal Documents
  },
  {
    id: 'doc-004',
    name: 'Tax Documents.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 3.2, // 3.2 MB
    date: '2023-08-05T16:10:00Z',
    status: 'Pending',
    requiresSignature: true,
    vaultId: 'vault-2' // Financial Documents
  },
  {
    id: 'doc-005',
    name: 'Client Information.txt',
    type: 'text/plain',
    size: 1024 * 32, // 32 KB
    date: '2023-09-18T09:30:00Z',
    status: 'Completed',
    requiresSignature: false,
    content: 'This is a sample text file with client information.',
    vaultId: 'vault-1' // Personal Documents
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockClientDocumentsAPI = {
  // Fetch all client documents
  fetchClientDocuments: async () => {
    await delay(800); // Simulate network delay
    return [...mockClientDocuments];
  },

  // Upload a new document
  uploadClientDocument: async (file, metadata, vaultId) => {
    await delay(1500); // Simulate upload time

    const newDocument = {
      id: `doc-${Date.now()}`,
      name: metadata.name || file.name,
      type: metadata.type || file.type,
      size: metadata.size || file.size,
      date: metadata.uploadDate || new Date().toISOString(),
      status: 'Pending',
      requiresSignature: file.type.includes('pdf'),
      vaultId: vaultId || 'vault-1' // Default to Personal Documents if no vault specified
    };

    mockClientDocuments.push(newDocument);
    return newDocument;
  },

  // Download a document
  downloadClientDocument: async (documentId) => {
    await delay(1000); // Simulate download time

    const document = mockClientDocuments.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // In a real implementation, this would return a blob
    // For mock purposes, we'll just return the document object
    return document;
  },

  // View a document
  viewClientDocument: async (documentId) => {
    await delay(600); // Simulate loading time

    const document = mockClientDocuments.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // For text files, return the content
    if (document.type === 'text/plain' && document.content) {
      return document.content;
    }

    // For other files, return document metadata
    return {
      ...document,
      createdAt: document.date,
      preview: 'Document preview not available in mock data'
    };
  },

  // Sign a document
  signClientDocument: async (documentId, signatureData) => {
    await delay(1200); // Simulate signing process

    const documentIndex = mockClientDocuments.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      throw new Error('Document not found');
    }

    // Update the document with signature information
    mockClientDocuments[documentIndex] = {
      ...mockClientDocuments[documentIndex],
      status: 'Signed',
      signedDate: signatureData.signatureDate || new Date().toISOString(),
      signedBy: signatureData.signedBy || 'Current User'
    };

    return mockClientDocuments[documentIndex];
  }
};

export default mockClientDocumentsAPI;
