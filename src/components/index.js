import React, { useState, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './index.css';

function RecommendationEngine() {
    const ls_industries = [
        "Agriculture", "Apparel", "Automotives", "Beverages & drinks", "Chemicals & Chemical Products",
        "Cleaning products", "Construction", "Energy", "Food products", "Forestry & logging",
        "Personal care products", "Jewelry & related articles", "Laundry & dry-cleaning", "Livestock",
        "Materials recovery & recycling", "Paper & paper products", "Pet Care", "Processed products",
        "Restaurants & food service", "Rubber & plastics products", "Sports & yoga goods", "Supplements",
        "Textiles", "Wood & wood products"
    ];

    const [email, setEmail] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const certificatesRef = useRef(null);
    const industryOptions = ls_industries.map((industry) => ({
        value: industry,
        label: industry,
    }));
    const [revenue, setRevenue] = useState(0);
    const [budget, setBudget] = useState(0);
    const [interest, setInterest] = useState('None');
    const [certificates, setCertificates] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setEmailError(isValidEmail ? '' : 'Enter a valid email address');
        }
        if (name === 'revenue') setRevenue(value);
        if (name === 'budget') setBudget(value);
        if (name === 'interest') setInterest(value);
    };

    const handleIndustrySelection = (selectedOptions) => {
        setSelectedIndustries(selectedOptions.map((option) => option.value));
    };

    const handleSubmit = async () => {
        if (emailError) {
            setResponseMessage('Please fix the email error before submitting.');
            return;
        }
        try {
            console.log('Sending request to the server...');
            const response = await axios.post('https://agreenably-server.onrender.com/submitForm', {
                email,
                industries: selectedIndustries,
                revenue,
                budget,
                interest,
            });

            console.log('Response from the server:', response.data);
            setCertificates(response.data.certificates);
            setResponseMessage(response.data.message);

            if (certificatesRef.current) {
                certificatesRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setResponseMessage('Error submitting form. Please try again.');
        }
    };


    return (
        <div className="recommendation-engine-container">
            <h1>Recommendation Engine</h1>

            <div className="form-group">
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter your Email Address"
                />
                {emailError && <p className="error-message">{emailError}</p>}
            </div>


            {/* Select Industries using react-select */}
            <div className="form-group">
                <label>Select Industries:</label>
                <Select
                    isMulti
                    options={industryOptions}
                    value={industryOptions.filter((option) => selectedIndustries.includes(option.value))}
                    onChange={handleIndustrySelection}
                />
            </div>

            <div className="form-group">
                <label>Revenue:</label>
                <input
                    type="range"
                    name="revenue"
                    value={revenue}
                    onChange={handleInputChange}
                    min={0}
                    max={100000000}
                    step={2000}
                />
                <span>Selected Revenue: {revenue}</span>
            </div>

            <div className="form-group">
                <label>Budget:</label>
                <input
                    type="range"
                    name="budget"
                    value={budget}
                    onChange={handleInputChange}
                    min={0}
                    max={10000}
                    step={100}
                />
                <span>Selected Budget: {budget}</span>
            </div>

            <div className="form-group">
                <label>Interest:</label>
                <select name="interest" value={interest} onChange={handleInputChange}>
                    {['None', 'No Prior Research', 'Environmental Focus For Customers', 'Social Focus For Investors'].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <span>Selected Interest: {interest}</span>
            </div>

            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            
            <div className="recommendation-engine-container result-container">
                <h2 className="section-title">Recommended Certifications:</h2>
                {Array.isArray(certificates) && certificates.length > 0 ? (
                    certificates.map((certificate) => (
                        <div key={certificate.certification_name} className="certification-container">
                            <h3>Certification Details</h3>
                            <p className='certification-content'><strong>Program Name:</strong> {certificate.program_name}</p>
                            <p className='certification-content'><strong>Certification Description:</strong> {certificate.description}</p>
                            <p className='certification-content'><strong>Certification Benefits:</strong> {certificate.benefits}</p>
                            <p className='certification-content'><strong>Timeline For Certification Acquisition:</strong> {certificate.timeline}</p>
                            <p className='certification-content'><strong>Required Documents:</strong> {certificate.required_documentation}</p>
                            <p className='certification-content'><strong>Certification Process:</strong> {certificate.certification_process}</p>
                            <p className='certification-content'><strong>Certification Renewal:</strong> {certificate.renewal}</p>
                            <p className='certification-content'><strong>Certification Scope:</strong> {certificate.certification_scope}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-certificates">No certificates to display</p>
                )}
            </div>



            {responseMessage && <div className="response-message">{responseMessage}</div>}
        </div>
    );
}

export default RecommendationEngine;
