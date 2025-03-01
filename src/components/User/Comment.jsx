import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar,
  Rating,
  Typography,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { commentAPI } from "./../../api/user/index";
import Loader from "./../Loader";
import { red } from "@mui/material/colors";

//* Comment Section
const CommentsSection = ({ sportCenterId }) => {
  // Infinite scrolling
  const {
    data: commentPages = { page: [] },
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["userComments", sportCenterId],
    queryFn: ({ pageParam }) =>
      commentAPI.fetchComments({ pageParam, sportCenterId }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

  // Checking if the center does not have comments.
  // In react query it return an array of comment object which if have to check only first array.
  // If it empty , all the array are empty
  const emptyComments = useMemo(() => {
    // Check if `commentPages.pages` is defined and is an array
    if (!commentPages.pages || !Array.isArray(commentPages.pages)) {
      return null;
    }

    // Check if every page's comments array is empty
    const allCommentsEmpty = commentPages.pages.every(
      (page) => !page.comments || page.comments.length === 0
    );

    return allCommentsEmpty ? (
      <Box
        sx={{
          width: "100%",
          padding: "1rem",
          outline: "1px solid #000",
          borderRadius: "5px",
        }}
        elevation={3}>
        No Comment
      </Box>
    ) : null;
  }, [commentPages.pages]);

  if (status === "pending") return <Loader />;
  if (error) return <p>Error loading comments</p>;

  return (
    <>
      {emptyComments}
      {commentPages.pages.map((page, pageIndex) => (
        <Box sx={{ width: "100%" }} key={pageIndex}>
          {page.comments.map((data, key) => (
            <Card
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
              square={false}
              elevation={4}
              variant="outlined">
              <CardHeader
                sx={{ width: "75%" }}
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }}>
                    {data?.postBy?.name[0]}
                  </Avatar>
                }
                title={data?.postBy?.name}
                subheader={dayjs(data.commentedAt).format("MMMM, DD YYYY")}
              />
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                  flexDirection: "column",
                  width: "100%",
                }}>
                <Typography color="text.secondary">{data?.comment}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: ".5rem",
                  }}>
                  <Rating
                    name="read-only"
                    precision={0.5}
                    value={data?.ratingValue || 0}
                    readOnly
                  />
                  <Typography
                    sx={{
                      fontWeight: "light",
                      fontSize: ".8rem",
                      color: "#595959",
                    }}>
                    ({data.ratingValue})
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}

      {/* Load More Button */}
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          sx={{ background: "#dedede", color: "#000" }}
          fullWidth>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </>
  );
};

export default CommentsSection;
