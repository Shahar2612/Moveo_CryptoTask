import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../config/axios';
import './Dashboard.css';

// dashboard page, displays personalized crypto content based on user preferences
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votes, setVotes] = useState({}); // track votes: { "sectionType-contentId": "up" | "down" }
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    fetchUserPreferences();
    fetchDashboard();
    fetchUserVotes();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await api.get('/onboarding');
      setUserPreferences(response.data.data.preferences);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  };

  // fetch dashboard data from API, navigate to onboarding if not found
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard');
      setDashboardData(response.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/onboarding');
      } else {
        setError('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // fetch user votes from API
  const fetchUserVotes = async () => {
    try {
      const response = await api.get('/dashboard/votes');
      const votesMap = {};
      response.data.data.votes.forEach((vote) => {
        const key = `${vote.sectionType}-${vote.contentId}`;
        votesMap[key] = vote.vote;
      });
      setVotes(votesMap);
    } catch (err) {
      console.error('Failed to fetch votes:', err);
    }
  };

  // handle vote submission, update UI immediately and submit to API
  const handleVote = async (sectionType, contentId, vote) => {
    const key = `${sectionType}-${contentId}`;
    const currentVote = votes[key];
    
    // If clicking the same vote remove it otherwise set the new vote
    const isRemoving = currentVote === vote;
    const newVote = isRemoving ? null : vote;
    
    // update UI immediately
    const previousVotes = { ...votes };
    if (isRemoving) {
      setVotes((prev) => {
        const newVotes = { ...prev };
        delete newVotes[key];
        return newVotes;
      });
    } else {
      setVotes((prev) => ({
        ...prev,
        [key]: newVote,
      }));
    }

    try {
      await api.post('/dashboard/vote', {
        sectionType,
        contentId,
        vote: newVote, // null if removing, otherwise 'up' or 'down'
      });
    } catch (err) {
      console.error('Failed to submit vote:', err);
      // revert on error
      setVotes(previousVotes);
    }
  };

  const getVote = (sectionType, contentId) => {
    const key = `${sectionType}-${contentId}`;
    return votes[key] || null;
  };

  // Map content preferences to dashboard sections
  const shouldShowSection = (sectionName) => {
    if (!userPreferences?.contentPreferences) return false;
    
    const mapping = {
      'Market News': 'Market News',
      'Charts': 'Coin Prices',
      'AI Insights': 'AI Insight',
      'Fun': 'Meme',
    };
    
    return userPreferences.contentPreferences.some(
      pref => mapping[pref] === sectionName
    );
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name}!</h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
              {isDark ? '☀️' : '🌙'}
            </button>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* market news section */}
        {shouldShowSection('Market News') && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>📰 Market News</h2>
          </div>
          {dashboardData?.marketNews?.success ? (
            <div className="news-grid">
              {dashboardData.marketNews.data.articles?.slice(0, 4).map((article) => (
                <div key={article.id} className="news-card">
                  <h3>{article.title}</h3>
                  <p className="news-source">{article.source}</p>
                  {article.url && article.url !== '#' && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-link"
                    >
                      Read more →
                    </a>
                  )}
                  <div className="vote-buttons">
                    <button
                      onClick={() => handleVote('market-news', article.id, 'up')}
                      className={`vote-btn up ${getVote('market-news', article.id) === 'up' ? 'active' : ''}`}
                      title="Like this article"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleVote('market-news', article.id, 'down')}
                      className={`vote-btn down ${getVote('market-news', article.id) === 'down' ? 'active' : ''}`}
                      title="Dislike this article"
                    >
                      👎
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="error-message">
              {dashboardData?.marketNews?.error || 'Failed to load news'}
            </div>
          )}
        </section>
        )}

        {/* coin prices section */}
        {shouldShowSection('Coin Prices') && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>💰 Coin Prices</h2>
          </div>
          {dashboardData?.coinPrices?.success ? (
            <div className="coins-grid">
              {dashboardData.coinPrices.data.coins?.map((coin) => (
                <div key={coin.id} className="coin-card">
                  <div className="coin-header">
                    <h3>{coin.name}</h3>
                    <span className="coin-symbol">{coin.symbol}</span>
                  </div>
                  <div className="coin-price">${coin.price?.toLocaleString()}</div>
                  <div
                    className={`coin-change ${
                      coin.change24h >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                    {coin.change24h >= 0 ? '↑' : '↓'} {Math.abs(coin.change24h)?.toFixed(2)}%
                  </div>
                  <div className="vote-buttons">
                    <button
                      onClick={() => handleVote('coin-prices', coin.id, 'up')}
                      className={`vote-btn up ${getVote('coin-prices', coin.id) === 'up' ? 'active' : ''}`}
                      title="Like this coin"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleVote('coin-prices', coin.id, 'down')}
                      className={`vote-btn down ${getVote('coin-prices', coin.id) === 'down' ? 'active' : ''}`}
                      title="Dislike this coin"
                    >
                      👎
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="error-message">
              {dashboardData?.coinPrices?.error || 'Failed to load prices'}
            </div>
          )}
        </section>
        )}

        {/* ai insight section */}
        {shouldShowSection('AI Insight') && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>🤖 AI Insight of the Day</h2>
          </div>
          {dashboardData?.aiInsight?.success ? (
            <div className="insight-card">
              <p className="insight-text">
                {dashboardData.aiInsight.data.insight}
              </p>
              <p className="insight-model">
                Powered by: {dashboardData.aiInsight.data.model}
              </p>
              <div className="vote-buttons">
                <button
                  onClick={() =>
                    handleVote('ai-insight', 'daily-insight', 'up')
                  }
                  className={`vote-btn up ${getVote('ai-insight', 'daily-insight') === 'up' ? 'active' : ''}`}
                  title="Like this insight"
                >
                  👍
                </button>
                <button
                  onClick={() =>
                    handleVote('ai-insight', 'daily-insight', 'down')
                  }
                  className={`vote-btn down ${getVote('ai-insight', 'daily-insight') === 'down' ? 'active' : ''}`}
                  title="Dislike this insight"
                >
                  👎
                </button>
              </div>
            </div>
          ) : (
            <div className="error-message">
              {dashboardData?.aiInsight?.error || 'Failed to load insight'}
            </div>
          )}
        </section>
        )}

        {/* meme section */}
        {shouldShowSection('Meme') && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>😄 Fun Crypto Meme</h2>
          </div>
          {dashboardData?.meme?.success ? (
            <div className="meme-card">
              <h3>{dashboardData.meme.data.title}</h3>
              {dashboardData.meme.data.url && (
                <img
                  src={dashboardData.meme.data.url}
                  alt={dashboardData.meme.data.title}
                  className="meme-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <p className="meme-description">
                {dashboardData.meme.data.description}
              </p>
              <div className="vote-buttons">
                <button
                  onClick={() => handleVote('meme', dashboardData.meme.data.id, 'up')}
                  className={`vote-btn up ${getVote('meme', dashboardData.meme.data.id) === 'up' ? 'active' : ''}`}
                  title="Like this meme"
                >
                  👍
                </button>
                <button
                  onClick={() =>
                    handleVote('meme', dashboardData.meme.data.id, 'down')
                  }
                  className={`vote-btn down ${getVote('meme', dashboardData.meme.data.id) === 'down' ? 'active' : ''}`}
                  title="Dislike this meme"
                >
                  👎
                </button>
              </div>
            </div>
          ) : (
            <div className="error-message">
              {dashboardData?.meme?.error || 'Failed to load meme'}
            </div>
          )}
        </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

