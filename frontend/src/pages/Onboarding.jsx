import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Onboarding.css';
// onboarding page, allows users to personalize their dashboard
const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [interestedAssets, setInterestedAssets] = useState([]);
  const [investorType, setInvestorType] = useState('');
  const [contentPreferences, setContentPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cryptoAssets = [
    'bitcoin',
    'ethereum',
    'solana',
    'cardano',
    'polkadot',
    'chainlink',
    'polygon',
    'avalanche',
    'cosmos',
    'algorand',
  ];

  const investorTypes = [
    'HODLer',
    'Day Trader',
    'NFT Collector',
    'DeFi Enthusiast',
    'Other',
  ];

  const contentTypes = ['Market News', 'Charts', 'Social', 'Fun'];

  // toggle asset selection, add or remove from interestedAssets array
  const toggleAsset = (asset) => {
    if (interestedAssets.includes(asset)) {
      setInterestedAssets(interestedAssets.filter((a) => a !== asset));
    } else {
      setInterestedAssets([...interestedAssets, asset]);
    }
  };

  // toggle content selection, add or remove from contentPreferences array
  const toggleContent = (content) => {
    if (contentPreferences.includes(content)) {
      setContentPreferences(contentPreferences.filter((c) => c !== content));
    } else {
      setContentPreferences([...contentPreferences, content]);
    }
  };

  // handle form submission, validate inputs and call onboarding API
  const handleSubmit = async () => {
    if (interestedAssets.length === 0) {
      setError('Please select at least one crypto asset');
      return;
    }

    if (!investorType) {
      setError('Please select your investor type');
      return;
    }

    if (contentPreferences.length === 0) {
      setError('Please select at least one content preference');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/api/onboarding', {
        interestedAssets,
        investorType,
        contentPreferences,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <h1>Let's personalize your dashboard</h1>
        <p className="subtitle">Answer a few questions to get started</p>

        {step === 1 && (
          <div className="step-content">
            <h2>What crypto assets are you interested in?</h2>
            <p className="step-description">Select all that apply</p>
            <div className="options-grid">
              {cryptoAssets.map((asset) => (
                <button
                  key={asset}
                  className={`option-btn ${
                    interestedAssets.includes(asset) ? 'selected' : ''
                  }`}
                  onClick={() => toggleAsset(asset)}
                >
                  {asset.charAt(0).toUpperCase() + asset.slice(1)}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={interestedAssets.length === 0}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>What type of investor are you?</h2>
            <p className="step-description">Choose the one that best describes you</p>
            <div className="options-list">
              {investorTypes.map((type) => (
                <button
                  key={type}
                  className={`option-btn-large ${
                    investorType === type ? 'selected' : ''
                  }`}
                  onClick={() => setInvestorType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="step-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={!investorType}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>What kind of content would you like to see?</h2>
            <p className="step-description">Select all that interest you</p>
            <div className="options-list">
              {contentTypes.map((content) => (
                <button
                  key={content}
                  className={`option-btn-large ${
                    contentPreferences.includes(content) ? 'selected' : ''
                  }`}
                  onClick={() => toggleContent(content)}
                >
                  {content}
                </button>
              ))}
            </div>
            {error && <div className="error">{error}</div>}
            <div className="step-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || contentPreferences.length === 0}
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

