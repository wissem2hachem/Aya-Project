import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobOffers = () => {
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/job-offers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setJobOffers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job offers');
        setLoading(false);
      }
    };

    fetchJobOffers();
  }, []);

  if (loading) return <div>Loading job offers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobOffers.map((offer) => (
          <div key={offer._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{offer.title}</h2>
            <p className="text-gray-600 mb-2">{offer.company}</p>
            <p className="text-gray-700 mb-4">{offer.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium">{offer.salary}</span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobOffers; 