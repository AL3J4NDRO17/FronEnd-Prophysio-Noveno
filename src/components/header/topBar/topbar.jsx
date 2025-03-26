"use client"

import { Phone, Mail, Facebook, Youtube, Instagram } from "lucide-react"
import "./topbar.css"

const TopBar = () => {
  return (
    <div className="site-topbar">
      <div className="site-topbar__container">
        <div className="site-topbar__contact">
          <a href="https://wa.me/yourphonenumber" className="site-topbar__link">
            <i className="site-topbar__icon site-topbar__icon--whatsapp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </i>
            Contáctanos por WhatsApp
          </a>
          <a href="mailto:info@tuempresa.com" className="site-topbar__link">
            <i className="site-topbar__icon site-topbar__icon--email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </i>
            Email
          </a>
        </div>
        <div className="site-topbar__social">
          <a href="#" className="site-topbar__social-link">
            <i className="site-topbar__icon site-topbar__icon--facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </i>
          </a>
          <a href="#" className="site-topbar__social-link">
            <i className="site-topbar__icon site-topbar__icon--youtube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </i>
          </a>
          <a href="#" className="site-topbar__social-link">
            <i className="site-topbar__icon site-topbar__icon--instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </i>
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar

