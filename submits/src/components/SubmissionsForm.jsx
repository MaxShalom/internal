import React, { useState } from 'react';
import { Plus, Trash2, Send, Package, Truck, Calendar } from 'lucide-react';
import { format, addMonths } from 'date-fns';

const InputGroup = ({ label, children, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
    {children}
  </div>
);

const StyledInput = (props) => (
  <input
    {...props}
    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200 ease-in-out sm:text-sm"
  />
);

const StyledSelect = (props) => (
  <select
    {...props}
    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2.5 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200 ease-in-out sm:text-sm"
  />
);

const SubmissionsForm = () => {
  const [factoryName, setFactoryName] = useState('');
  const [submissions, setSubmissions] = useState([
    {
      styleNumber: '',
      season: 'Spring',
      year: new Date().getFullYear(),
      dateSent: format(new Date(), 'yyyy-MM-dd'),
      sampleType: 'Lab Dip',
      shipper: 'DHL',
      otherShipper: '',
      trackingNumber: ''
    }
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const futureYear = addMonths(new Date(), 3).getFullYear();

  const handleAddRow = () => {
    setSubmissions([
      ...submissions,
      {
        styleNumber: '',
        season: 'Spring',
        year: futureYear,
        dateSent: format(new Date(), 'yyyy-MM-dd'),
        sampleType: 'Lab Dip',
        shipper: 'DHL',
        otherShipper: '',
        trackingNumber: ''
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    const newSubmissions = [...submissions];
    newSubmissions.splice(index, 1);
    setSubmissions(newSubmissions);
  };

  const handleChange = (index, field, value) => {
    const newSubmissions = [...submissions];
    newSubmissions[index][field] = value;
    setSubmissions(newSubmissions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!factoryName) {
        alert("Please enter a Factory Name");
        return;
    }
    setLoading(true);

    const payload = submissions.map(sub => ({
      factory: factoryName,
      styleNumber: sub.styleNumber,
      season: sub.season,
      year: sub.year,
      dateSent: sub.dateSent,
      sampleType: sub.sampleType,
      shipper: sub.shipper === 'Other' ? sub.otherShipper : sub.shipper,
      trackingNumber: sub.trackingNumber,
      status: 'New'
    }));

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full ring-1 ring-slate-900/5">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Sent Successfully</h2>
          <p className="text-slate-600 mb-8 text-lg">Thank you! Your sample submission has been recorded in our system.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSubmissions([{
                styleNumber: '',
                season: 'Spring',
                year: futureYear,
                dateSent: format(new Date(), 'yyyy-MM-dd'),
                sampleType: 'Lab Dip',
                shipper: 'DHL',
                otherShipper: '',
                trackingNumber: ''
              }]);
              setFactoryName('');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold px-6 py-2 rounded-full hover:bg-indigo-50 transition-colors"
          >
            Submit Another Batch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
           <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Factory<span className="text-indigo-600">Portal</span>
              </h1>
           </div>
           <div className="text-sm text-slate-500 font-medium hidden sm:block">
              Submit Samples & Dips
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Factory Info */}
          <div className="max-w-xl mx-auto text-center space-y-4">
             <h2 className="text-3xl font-bold text-slate-900">New Submission</h2>
             <p className="text-slate-500">Enter your factory details and list the samples you are sending today.</p>
             <div className="pt-4">
                <StyledInput
                  type="text"
                  required
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  placeholder="Enter Factory Name"
                  className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-4 px-6 text-center placeholder-slate-400"
                  style={{ fontSize: '1.125rem' }}
                />
             </div>
          </div>

          <div className="space-y-6">
            {submissions.map((sub, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                        {index + 1}
                     </span>
                     <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Item Details</h3>
                  </div>
                  {submissions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="p-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Row 1 */}
                  <InputGroup label="Style Number">
                    <StyledInput
                      type="text"
                      required
                      placeholder="e.g. ST-2024"
                      value={sub.styleNumber}
                      onChange={(e) => handleChange(index, 'styleNumber', e.target.value)}
                    />
                  </InputGroup>

                  <InputGroup label="Sample Type">
                    <StyledSelect
                      value={sub.sampleType}
                      onChange={(e) => handleChange(index, 'sampleType', e.target.value)}
                    >
                      <option>Lab Dip</option>
                      <option>Strike Off</option>
                      <option>PP Sample</option>
                      <option>TOP Sample</option>
                    </StyledSelect>
                  </InputGroup>

                   <InputGroup label="Season">
                    <StyledSelect
                      value={sub.season}
                      onChange={(e) => handleChange(index, 'season', e.target.value)}
                    >
                      <option>Spring</option>
                      <option>Fall</option>
                    </StyledSelect>
                  </InputGroup>

                  <InputGroup label="Year">
                    <StyledInput
                      type="number"
                      required
                      value={sub.year}
                      onChange={(e) => handleChange(index, 'year', e.target.value)}
                    />
                  </InputGroup>

                  {/* Row 2 */}
                  <InputGroup label="Date Sent">
                     <div className="relative">
                        <StyledInput
                        type="date"
                        required
                        value={sub.dateSent}
                        onChange={(e) => handleChange(index, 'dateSent', e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                     </div>
                  </InputGroup>

                  <InputGroup label="Shipper">
                    <StyledSelect
                      value={sub.shipper}
                      onChange={(e) => handleChange(index, 'shipper', e.target.value)}
                    >
                      <option>DHL</option>
                      <option>FedEx</option>
                      <option>UPS</option>
                      <option>Other</option>
                    </StyledSelect>
                  </InputGroup>

                  {sub.shipper === 'Other' ? (
                    <InputGroup label="Specify Shipper">
                      <StyledInput
                        type="text"
                        required
                        placeholder="Carrier Name"
                        value={sub.otherShipper}
                        onChange={(e) => handleChange(index, 'otherShipper', e.target.value)}
                      />
                    </InputGroup>
                  ) : (
                     <div className="hidden lg:block"></div>
                  )}

                  <InputGroup label="Tracking Number" className="lg:col-span-1">
                    <div className="relative">
                        <StyledInput
                        type="text"
                        required
                        placeholder="Tracking ID"
                        value={sub.trackingNumber}
                        onChange={(e) => handleChange(index, 'trackingNumber', e.target.value)}
                        />
                         <Truck className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </InputGroup>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
            <button
              type="button"
              onClick={handleAddRow}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border-2 border-dashed border-slate-300 shadow-sm text-sm font-semibold rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Another Item
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border border-transparent shadow-lg shadow-indigo-500/30 text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Submitting...' : 'Submit All Samples'}
            </button>
          </div>
        </form>
      </div>

      <div className="py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Company Name. All rights reserved.
      </div>
    </div>
  );
};

export default SubmissionsForm;
