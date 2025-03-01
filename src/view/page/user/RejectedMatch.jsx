import MatchHistory from "../../../components/MatchHistory";
import authToken from "./../../../utils/authToken";
export default function RejectedMatch() {
  const token = authToken();
  return <MatchHistory token={token} filter={"rejected"} />;
}
