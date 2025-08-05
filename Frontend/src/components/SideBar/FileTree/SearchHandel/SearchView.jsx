// SearchView.jsx
import React, { useState } from 'react';
import { Search, ChevronLeft, BookOpen, FileText, Settings } from 'lucide-react';

export const SearchView = ({ onBackToTree }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        // Implement your search logic here
        if (value) {
            setSearchResults([
                {
                    id: 1,
                    title: 'Document.md',
                    path: 'Work/Projects',
                    preview: 'Content matching search...',
                    matches: 2
                }
            ]);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="search-view">
            <div className="search-header">
                <button
                    onClick={onBackToTree}
                    className="back-button"
                    title="Back to files"
                >
                    <ChevronLeft className="back-icon" />
                </button>
                <span className="header-title">Search</span>
            </div>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Type to start search..."
                        className="search-input"
                        autoFocus
                    />
                </div>

                <button
                    className="options-toggle"
                    onClick={() => setShowOptions(!showOptions)}
                >
                    <ChevronLeft className={`chevron-icon ${showOptions ? 'rotated' : ''}`} />
                    Options
                </button>

                {showOptions && (
                    <div className="search-options">
                        <label className="option-label">
                            <input type="checkbox" />
                            Match case
                        </label>
                        <label className="option-label">
                            <input type="checkbox" />
                            Show context
                        </label>
                    </div>
                )}
            </div>

            <div className="search-results-container">
                {searchTerm === '' ? (
                    <div className="empty-state">
                        <BookOpen className="empty-icon" />
                        <p>Type to start searching</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="search-results">
                        {searchResults.map((result) => (
                            <div key={result.id} className="result-item">
                                <div className="result-header">
                                    <FileText className="file-icon" />
                                    <span className="result-title">{result.title}</span>
                                    <span className="match-count">{result.matches}</span>
                                </div>
                                <div className="result-path">{result.path}</div>
                                <div className="result-preview">{result.preview}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        No results found
                    </div>
                )}
            </div>

            <div className="search-footer">
                <button className="settings-button">
                    <Settings className="settings-icon" />
                    <span>Search settings</span>
                </button>
            </div>
        </div>
    );
};