"use client"

import { Phone, Mail, Facebook, Youtube, Instagram } from "lucide-react"
import "./topbar.css"

const TopBar = () => {
  return (
    <div className="site-topbar">
      <div className="site-topbar__container">
        <div className="site-topbar__contact">
          <a href="https://wa.me/522225081501" target="_blank" rel="noopener noreferrer" className="site-topbar__link">
            <i className="site-topbar__icon site-topbar__icon--whatsapp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </i>
            Contáctanos por WhatsApp
          </a>
          
        </div>
        <div className="site-topbar__social">
          <a href="https://www.facebook.com/prophysioof" target="_blank" rel="noopener noreferrer" className="site-topbar__social-link">
            <i className="site-topbar__icon site-topbar__icon--facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </i>
          </a>
          
          <a href="https://www.instagram.com/prophysio_huejutla/" target="_blank" rel="noopener noreferrer"  className="site-topbar__social-link">
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

