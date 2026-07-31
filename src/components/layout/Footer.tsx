import { contactChannels } from '../../data/contact'
import { trackButtonClick } from '../../utils/analytics'
import { FaGithub, FaFacebook, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <h3 className="footer__title">Ethan Chan 曾嘉誠</h3>
        <p className="footer__text">Developer</p>
        <p className="footer__text">Based in Malaysia, anak 🇲🇾. Currently studying in Taiwan.</p>
        <div className="footer__links">
        <p className="footer__text">
          <a
            href={`mailto:${contactChannels.email}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackButtonClick({ label: 'footer_email', area: 'footer_links', target: 'email' })}
          >
            <MdEmail size={20} />
          </a>
        </p>
        <p className="footer__text">
          <a
            href={`https://${contactChannels.linkedin}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackButtonClick({ label: 'footer_linkedin', area: 'footer_links', target: 'linkedin' })}
          >
            <FaLinkedin size={20} />
          </a>
        </p>
        <p className="footer__text">
          <a
            href={`https://${contactChannels.github}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackButtonClick({ label: 'footer_github', area: 'footer_links', target: 'github' })}
          >
            <FaGithub size={20} />
          </a>
        </p>
        <p className="footer__text">
          <a
            href={`https://www.${contactChannels.facebook}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackButtonClick({ label: 'footer_facebook', area: 'footer_links', target: 'facebook' })}
          >
            <FaFacebook size={20} />
          </a>
        </p>
        </div>
        <p className="footer__text">© 2026 Ethan DevLab. All rights reserved.</p>
      </div>
    </footer>
  )
}
