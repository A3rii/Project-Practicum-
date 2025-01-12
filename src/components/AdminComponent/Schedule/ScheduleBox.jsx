import { MatchBox } from "./MatchBox";
import {
  Upcoming as UpcomingIcon,
  Today as TodayIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import {
  CountUpComingMatches,
  TodayMatch,
  MatchAcception,
  RejectionBooking,
} from "./UpcomingMatch";
const ScheduleBox = () => {
  const todayMatches = TodayMatch(); // Returning  today match value
  const upComingMatches = CountUpComingMatches(); // Returning upcoming match value

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: ".7rem",
      }}>
      {[
        {
          name: "Upcoming Match",
          icon: UpcomingIcon,
          color: "#FFB74D",
          number: upComingMatches,
        },
        {
          name: "Today Match",
          icon: TodayIcon,
          color: "#42A5F5",
          number: todayMatches,
        },
        {
          name: "Approved Match",
          icon: EventAvailableIcon,
          color: "#81C784",
          number: MatchAcception(),
        },
        {
          name: "Rejected Match",
          icon: EventBusyIcon,
          color: "#EF5350",
          number: RejectionBooking(),
        },
      ].map((match, index) => (
        <MatchBox
          key={index}
          name={match.name}
          icon={match.icon}
          color={match.color}
          number={match.number}
        />
      ))}
    </Box>
  );
};

export { ScheduleBox };
