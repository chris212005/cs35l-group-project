import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute(children){
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('token')){
            //write logic to get the details of the current user
        }
        else{
            navigate("/login");
        }
    });

    return(
        <div>
            { children }
        </div>
    )

}

export default ProtectedRoute;