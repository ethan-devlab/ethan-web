import { contactChannels } from '../../data/contact'
import { FaGithub, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <h3 className="footer__title">Ethan Chan 曾嘉誠</h3>
        <p className="footer__text">Programmer</p>
        <p className="footer__text">Based in Malaysia, anak 🇲🇾. Currently studying in Taiwan.</p>
        <div className="footer__links">
        <p className="footer__text">
          {/* Email: {' '} */}
          <a href={`mailto:${contactChannels.email}`} target="_blank" rel="noreferrer">
            <MdEmail size={20} />
          </a>
        </p>
        <p className="footer__text">
          {/* GitHub:{' '} */}
          <a href={contactChannels.github} target="_blank" rel="noreferrer">
            <FaGithub size={20} />
          </a>
        </p>
        <p className="footer__text">
          <a href={contactChannels.facebook} target="_blank" rel="noreferrer">
            <FaFacebook size={20} />
          </a>
        </p>
        </div>
        <p className="footer__text">© 2026 Ethan Chan. All rights reserved.</p>
      </div>
    </footer>
  )
}
