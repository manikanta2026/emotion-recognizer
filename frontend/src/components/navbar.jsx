import '../App.css'
import logo1Logo from '../assets/logo1.svg';
import githubLogo from '../assets/github.svg';

function NavBar() {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <nav className="navbar">
     <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
  <img src={logo1Logo} alt='' style={{ marginRight: '10px' }} />
  <div className="logo">Voice Vista</div>
</div>

<a href="https://github.com/manikanta2026" target="_blank" className="github">
  <img src={githubLogo} alt="GitHub Profile" />
</a>
    </nav>
  );
}

export default NavBar;