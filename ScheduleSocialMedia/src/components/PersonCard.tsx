type PersonCardProps = {
    username: string;
    name: string; 
};

export default function PersonCard({ username, name}: PersonCardProps) {
    return (
        <div className="personCard">
            <div className="personAvatar"></div>

            <div className="personUsername">{username}</div>
            <div className="personName">{name}</div>

            <button className="viewBtn">View</button>
        </div>
    );
}