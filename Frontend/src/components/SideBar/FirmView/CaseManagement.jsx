import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaFolder, FaFileAlt, FaUserAlt, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
// import { fetchCasesRequest } from '@/store/cases/action'; // This would need to be created

const CaseManagement = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const dispatch = useDispatch();
  
  // This would come from a new reducer for cases
  const { cases, loading, error } = useSelector(state => ({
    cases: [], // This would come from state.casesReducer.cases
    loading: false, // This would come from state.casesReducer.loading
    error: null // This would come from state.casesReducer.error
  }));

  useEffect(() => {
    // This action would need to be implemented
    // dispatch(fetchCasesRequest());
  }, [dispatch]);

  const handleCreateCase = () => {
    // Logic to create new case
  };

  const handleSelectCase = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const filteredCases = cases.filter(caseItem => {
    if (filterStatus === 'all') return true;
    return caseItem.status === filterStatus;
  });

  return (
    <div className="case-management-container">
      <div className="case-management-header">
        <h2>Case Management</h2>
        <button className="create-case-btn" onClick={handleCreateCase}>
          <FaPlus /> New Case
        </button>
      </div>

      <div className="case-filters">
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Cases</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading cases...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredCases.length > 0 ? (
        <div className="cases-list">
          {filteredCases.map(caseItem => (
            <div 
              key={caseItem.id} 
              className={`case-item ${selectedCase?.id === caseItem.id ? 'selected' : ''}`}
              onClick={() => handleSelectCase(caseItem)}
            >
              <div className="case-icon">
                <FaFolder />
              </div>
              <div className="case-details">
                <h3 className="case-title">{caseItem.title}</h3>
                <div className="case-meta">
                  <span className="case-number">#{caseItem.caseNumber}</span>
                  <span className={`case-status ${caseItem.status.toLowerCase()}`}>
                    {caseItem.status}
                  </span>
                </div>
                <div className="case-info">
                  <div className="case-client">
                    <FaUserAlt /> {caseItem.client}
                  </div>
                  <div className="case-date">
                    <FaCalendarAlt /> {caseItem.createdDate}
                  </div>
                  <div className="case-documents">
                    <FaFileAlt /> {caseItem.documentCount} documents
                  </div>
                </div>
              </div>
              <div className="case-actions">
                <button className="case-menu-btn">
                  <FaEllipsisV />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-cases">
          <p>No cases found. Create a new case to get started.</p>
        </div>
      )}

      {/* Case details panel would be implemented here */}
    </div>
  );
};

export default CaseManagement;
