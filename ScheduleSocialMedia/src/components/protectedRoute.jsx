import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser, getAllUsers } from "../apiCalls/users";
import { useDispatch, useSelector } from "react-redux"
import { hideLoader, showLoader } from "../redux/LoaderSlice";
import { setAllUsers, setUser } from "../redux/usersSlice";

function ProtectedRoute({ children }) {
    const { user } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const getloggedInUser = async () => {
        let response = null;
        try {
            dispatch(showLoader())
            response = await getLoggedUser();
            dispatch(hideLoader())

            if (response.success) {
                dispatch(setUser(response.data));

            } else {
                navigate("/login");
            }
        } catch (error) {
            navigate("/login");
        }
    }

    const getAllUsersFromDB = async () => {
        let response = null;
        try {
            dispatch(showLoader())
            response = await getAllUsers();
            dispatch(hideLoader())

            if (response.success) {
                dispatch(setAllUsers(response.data));

            } else {
                navigate("/login");
            }
        } catch (error) {
            navigate("/login");
        }
    }
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getloggedInUser();
            getAllUsersFromDB();
        }
        else {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            {children}
        </div>
    )

}

export default ProtectedRoute;