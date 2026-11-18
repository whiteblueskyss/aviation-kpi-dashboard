import logo from '../assets/logo.png';

export default function Header() {
  return (
    <header className="mast">
      <div className="mastgrid">
        <div className="logowrap">
          <img src={logo} alt="Eesti Lennuakadeemia / Estonian Aviation Academy logo" />
        </div>
        <div className="headtxt">
          <p className="course-id">CAM.104 · Aviation Compliance and Quality Management</p>
          <h1>QMS Study Companion</h1>
        </div>
        <p className="author-credit">
          <strong>Prepared by Dr. Bahtiyar Eren</strong>
          <br />
          Estonian Aviation Academy
        </p>
      </div>
    </header>
  );
}
