import MatchHistory from "../../../components/MatchHistory";
import authToken from "./../../../utils/authToken";
export default function ApprovedMatch() {
  const token = authToken();
  return <MatchHistory token={token} filter={"approved"} />;
}
