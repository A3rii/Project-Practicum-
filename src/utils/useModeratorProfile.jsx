import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentModerator } from "../app/slice";

const useModeratorProfile = () => {
  const dispatch = useDispatch();
  const currentModerator = useSelector((state) => state.user.currentModerator);

  useEffect(() => {
    dispatch(getCurrentModerator());
  }, [dispatch]);

  return currentModerator;
};

export default useModeratorProfile;
