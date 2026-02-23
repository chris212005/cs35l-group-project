import "./search.css"

export default function Search({searchKey, setSearchKey}: any) {
    return (
        <div className="user-search-area">
            <input type="text" 
                className="user-search-text" 
                value={searchKey}
                onChange={(e: any) => setSearchKey(e.target.value)} />
            <i className="fa-solid fa-magnifying-glass user-search-btn"></i>
        </div>
    )
}