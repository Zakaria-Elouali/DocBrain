import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaDollarSign, FaFileInvoiceDollar, FaClock, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const InvoiceDashboard = ({ onBackToList }) => {
  // Get invoices from Redux store
  const { invoices } = useSelector(state => state.invoiceReducer || {});

  // Helper functions (moved before useMemo to fix hoisting issue)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatPercentage = (value, total) => {
    if (!total) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'PAID': '#28a745',
      'PENDING': '#ffc107',
      'OVERDUE': '#dc3545',
      'DRAFT': '#6c757d',
      'CANCELLED': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  // Calculate analytics
  const calculatedAnalytics = useMemo(() => {
    if (!invoices || !Array.isArray(invoices) || invoices.length === 0) {
      return {
        totalInvoices: 0,
        totalAmount: 0,
        averageInvoiceValue: 0,
        overdueAmount: 0,
        statusDistribution: [],
        monthlyTrend: [],
      };
    }

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);
    const averageInvoiceValue = totalAmount / totalInvoices;
    const overdueAmount = invoices
      .filter(inv => inv.status === 'OVERDUE')
      .reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);

    // Status distribution
    const statusCounts = {};
    invoices.forEach(inv => {
      const status = inv.status || 'UNKNOWN';
      if (!statusCounts[status]) {
        statusCounts[status] = { count: 0, amount: 0 };
      }
      statusCounts[status].count++;
      statusCounts[status].amount += inv.totalAmount || inv.amount || 0;
    });

    const statusDistribution = Object.entries(statusCounts).map(([status, data]) => ({
      status,
      count: data.count,
      amount: data.amount,
      color: getStatusColor(status)
    }));

    return {
      totalInvoices,
      totalAmount,
      averageInvoiceValue,
      overdueAmount,
      statusDistribution,
      monthlyTrend: [], // Simplified for now
    };
  }, [invoices]);

  return (
    <div className="invoice-analytics">
      <div className="analytics-header">
        <div className="header-left">
          {onBackToList && (
            <button className="btn-secondary" onClick={onBackToList}>
              <FaArrowLeft /> Back to List
            </button>
          )}
          <h2>Invoice Dashboard</h2>
        </div>
        <div className="header-right">
          <span className="last-updated">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="analytics-metrics">
        <div className="metric-card primary">
          <div className="metric-icon">
            <FaFileInvoiceDollar />
          </div>
          <div className="metric-content">
            <div className="metric-value">{calculatedAnalytics.totalInvoices}</div>
            <div className="metric-label">Total Invoices</div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <FaDollarSign />
          </div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(calculatedAnalytics.totalAmount)}</div>
            <div className="metric-label">Total Revenue</div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <FaClock />
          </div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(calculatedAnalytics.averageInvoiceValue)}</div>
            <div className="metric-label">Average Invoice Value</div>
          </div>
        </div>

        <div className="metric-card danger">
          <div className="metric-icon">
            <FaExclamationTriangle />
          </div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(calculatedAnalytics.overdueAmount)}</div>
            <div className="metric-label">Overdue Amount</div>
          </div>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Invoice Status Distribution</h3>
        <div className="status-distribution">
          {calculatedAnalytics.statusDistribution.map((status, index) => (
            <div key={index} className="status-card">
              <div className="status-header">
                <div 
                  className="status-indicator" 
                  style={{ backgroundColor: status.color }}
                ></div>
                <h4>{status.status}</h4>
              </div>
              <div className="status-stats">
                <div className="status-count">
                  <span className="value">{status.count}</span>
                  <span className="label">invoices</span>
                  <span className="percentage">
                    ({formatPercentage(status.count, calculatedAnalytics.totalInvoices)})
                  </span>
                </div>
                <div className="status-amount">
                  <span className="value">{formatCurrency(status.amount)}</span>
                  <span className="label">total</span>
                  <span className="percentage">
                    ({formatPercentage(status.amount, calculatedAnalytics.totalAmount)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
