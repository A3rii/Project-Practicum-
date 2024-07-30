import MatchHistory from "../../../components/MatchHistory";
import authToken from "./../../../utils/authToken";
export default function AllMatch() {
  const token = authToken();
  return <MatchHistory token={token} filter={"all"} />;
}
