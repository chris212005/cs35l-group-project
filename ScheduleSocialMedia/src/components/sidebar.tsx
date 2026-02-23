import "./sidebar.css"
import Search from "./search"
import { useState } from "react";

export default function Sidebar() {
    const [searchKey, setSearchKey] = useState('');
    return (
        <div className="app-sidebar">
        <Search 
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        ></Search>
        {/*<!--USER LIST-->*/}
    </div>
    )

}