import "./FindUsers.css";

//not dynamic yet just static list of users as placeholders
export default function FindUsers() {
  return (
    <div className="findUsersContainer">
      <div className="findUsersHeader">
        <h1>Find Users</h1>
      </div>

      <div className="searchSection">
        <input
          className="searchInput"
          type="text"
          placeholder="Search users..."
        />
      </div>
      <div className="userList">
        <div className="userCard">User1</div>
        <div className="userCard">User2</div>
        <div className="userCard">User3</div>
        <div className="userCard">User4</div>
      </div>
    </div>
  );
}
