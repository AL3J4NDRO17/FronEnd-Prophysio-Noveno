import TopBar from './topBar/topbar';
import Navbar from './navbar/navbar';

import './header.css'


export default function Header() {
    return (
        <header className="header">
            <TopBar />
            
            <Navbar />
            
        </header>
    );
}
