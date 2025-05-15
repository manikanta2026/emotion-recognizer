import { useNavigate } from 'react-router-dom';
import '../App.css';
import logoLogo from '../assets/logo.svg';

function HomePage() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/upload');
  };

  return (
    <div className="homepage">
      <div className="left-section">
        <h1 className="main-headline">Bringing Emotions to the Forefront of Speech</h1>
        <p className="description">
          We have developed a deep-learning model that predicts human emotions from input audio files. By analyzing vocal features, the model identifies emotions like happiness, sadness, anger, and more with precision.
        </p>
        <button className="upload-button" onClick={handleExploreClick}>Explore</button>
      </div>
      <div className="right-section">
        <img src={logoLogo} alt="Emotion Visualization" className="image" />
      </div>
    </div>
  );
}

export default HomePage;
