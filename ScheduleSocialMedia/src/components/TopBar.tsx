export default function TopBar() {
    return (
        <header className="topbar">
            <div className="logo">Find your Friend</div>

            <input className="search" placeholder="Search" />
            
            <div className="icons">
                <div className="iconCircle" />
                <div className="iconCircle" />
                <div className="iconCircle" />
            </div>
        </header>
    );
}