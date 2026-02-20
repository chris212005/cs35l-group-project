export default function ProfileCard() {
    return (
        <div className="profileCardLarge">
            <div className="profilePicLarge"></div>

            <div className="profileInfo">
                <div className="username">username</div>
                <div className="bio">Bio goes here</div>
                <button className="followBtn">Follow</button>
            </div>
        </div>
    );
}