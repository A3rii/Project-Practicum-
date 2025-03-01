import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { TodayMatch } from "../Schedule/UpcomingMatch";
import {
  inRangeTime,
  convertTo24Hour,
  formatDate,
} from "./../../../utils/timeCalculation";
import { Sports as SportsIcon } from "@mui/icons-material";

// Common styles for timeline elements
const contentStyle = (borderColor) => ({
  background: "#ffffff",
  color: "#333333",
  borderTop: `5px solid ${borderColor}`,
});

const contentArrowStyle = {
  borderRight: "7px solid #ffffff",
};

const iconStyle = (bgColor) => ({
  background: bgColor,
  color: "#fff",
});

// Reusable function to render a timeline element
const renderTimelineElement = (
  title,
  description,
  date,
  borderColor,
  bgColor
) => (
  <VerticalTimelineElement
    className="vertical-timeline-element"
    contentStyle={contentStyle(borderColor)}
    contentArrowStyle={contentArrowStyle}
    date={date}
    iconStyle={iconStyle(bgColor)}
    icon={<SportsIcon />}>
    <h3
      className="vertical-timeline-element-title"
      style={{
        fontSize: "1rem",
        margin: "0 0 5px",
        color: "#333333",
      }}>
      {title}
    </h3>
    <p style={{ fontSize: "0.8rem", margin: "0", color: "#333333" }}>
      {description}
    </p>
  </VerticalTimelineElement>
);

const TimeLine = () => {
  const todayMatches = TodayMatch();

  // Filter matches that are in progress
  const checkingTimeInProgress =
    todayMatches.length > 0 &&
    todayMatches.filter((match) =>
      inRangeTime(
        convertTo24Hour(match.startTime),
        convertTo24Hour(match.endTime)
      )
    );

  return (
    <VerticalTimeline layout="1-column">
      {checkingTimeInProgress.length > 0
        ? checkingTimeInProgress.map((match) =>
            renderTimelineElement(
              match?.user?.name || match?.outside_user?.name,
              `Play At: ${match?.facility} Court ${match?.court} From ${match?.startTime} - ${match?.endTime}`,
              formatDate(match?.date),
              "#00bcd4", // Cyan border
              "#00bcd4" // Cyan icon background
            )
          )
        : renderTimelineElement(
            "No Matches In Progress",
            "Check back later for updates.",
            null,
            "#f44336",
            "#f44336"
          )}
    </VerticalTimeline>
  );
};

export default TimeLine;
