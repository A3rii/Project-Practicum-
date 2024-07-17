import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./../app/slice.js";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return currentUser;
};
export default useCurrentUser;
