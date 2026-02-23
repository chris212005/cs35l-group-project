import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from './../apiCalls/users';
import { useDispatch, useSelector } from "react-redux";
{/*import { hideLoader, showLoader } from "../redux/loaderSlice";*/ }
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";

function ProtectedRoute({ children }) {
    {/* const { user } = useSelector(state => state.userReducer);*/ }
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const getloggedInUser = async () => {
        let response = null;
        try {
            dispatch(showLoader());
            response = await getLoggedUser();
            dispatch(hideLoader());
            if (response.success) {
                dispatch(setUser(response.data));
                console.log(user);
            } else {
                toast.error(response.message);
                navigate("/login");
            }
        }
        catch (error) {
            dispatch(hideLoader());
            navigate("/login");
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            //write logic to get the details of the current user
            getloggedInUser();
        }
        else {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            {children}
        </div>
    );

}

export default ProtectedRoute;