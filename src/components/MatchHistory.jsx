import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import HistoryCard from "./User/HistoryCard";
import { historyAPI } from "./../api/user/index";
const MatchHistory = ({ token, filter }) => {
  const { data: incomingMatch = [], error } = useQuery({
    queryKey: ["incomingMatch", token, filter],
    queryFn: () => historyAPI.fetchBookings(token, filter),
    refetchOnWindowFocus: true,
  });
  if (error) return <Navigate to="/error" />;

  return <HistoryCard data={incomingMatch} />;
};

export default MatchHistory;
