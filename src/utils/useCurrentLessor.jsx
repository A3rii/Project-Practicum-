import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentLessor } from "./../app/slice";

const useCurrentLessor = () => {
  const dispatch = useDispatch();
  const currentLessor = useSelector((state) => state.user.currentLessor);

  useEffect(() => {
    dispatch(getCurrentLessor());
  }, []);

  return currentLessor;
};

export default useCurrentLessor;
