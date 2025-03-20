"use client"

import { Phone, Mail, Facebook, Youtube, Instagram } from "lucide-react"
import "./topbar.css"

const TopBar = () => {
  return (
    <div className="topBar">
      <div className="topBarContainer">
        <div className="topBarContent">
          <div className="socialLinks">
            <a href="#a" className="socialLink">
              <Phone size={16} />
              <span>Contáctanos por WhatsApp</span>
            </a>
            <a href="#a" className="socialLink">
              <Mail size={16} />
              <span>Email</span>
            </a>
            <a href="#a" className="socialLink">
              <Facebook size={16} />
              <span>Facebook</span>
            </a>
            <a href="#a" className="socialLink">
              <Youtube size={16} />
              <span>YouTube</span>
            </a>
            <a href="#a" className="socialLink">
              <Instagram size={16} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar

