import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  TextField,
  Modal,
  Divider,
  Box,
  Typography,
  styled,
} from "@mui/material";
import { storage } from "../../../firebase/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 } from "uuid";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import axios from "axios";
import {
  CloudUpload as CloudUploadIcon,
  AttachMoney as AttachMoneyIcon,
  SportsBasketball as SportsBasketballIcon,
} from "@mui/icons-material/";
import authToken from "../../../utils/authToken";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddFacility({ open, closeModal, updateModal }) {
  const token = authToken();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [lessorImage, setLessorImage] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [file, setFile] = useState(null);

  const handlePostingFacility = async (e) => {
    e.preventDefault();

    if (!lessorImage) {
      console.error("No image selected.");
      return;
    }

    try {
      const imageID = v4();
      const imageFormat = lessorImage.type.split("/")[1];
      const imgRef = ref(storage, `lessor_image/${imageID}.${imageFormat}`);
      const uploadTask = uploadBytesResumable(imgRef, lessorImage, {
        contentType: "image/*",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setPhotoURL(downloadURL);

          const credentials = {
            name,
            price,
            description,
            image: downloadURL,
          };

          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/lessor/facility`,
              credentials,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Facility posted successfully:", response.data);
            notify("Facility created successfully");
            closeModal();
            updateModal();
          } catch (err) {
            errorAlert("Error Posting Facility");
            console.error("Error posting facility:", err);
          }
        }
      );
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <Modal
      keepMounted
      open={open}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "5px",
        }}>
        <Typography
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
          Create An Event
        </Typography>
        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
            marginTop: ".5rem",
          }}>
          <TextField
            sx={{ width: 260 }}
            InputProps={{
              endAdornment: <SportsBasketballIcon style={{ color: "#888" }} />,
            }}
            label="Sport Type"
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
          <TextField
            sx={{ width: 260 }}
            InputProps={{
              endAdornment: <AttachMoneyIcon style={{ color: "#888" }} />,
            }}
            label="Price"
            onChange={(e) => setPrice(e.target.value)}
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
            gap: "1rem",
          }}>
          <TextField
            sx={{ width: "100%" }}
            id="outlined-multiline-static"
            multiline
            rows={4}
            label="Description"
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            marginTop: "1rem",
            gap: "1rem",
          }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onChange={(e) => {
              setLessorImage(e.target.files[0]);
              setFile(URL.createObjectURL(e.target.files[0]));
            }}
            startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            marginTop: "1rem",
          }}>
          {file && (
            <Box sx={{ display: "flex", gap: ".6rem" }}>
              <img
                loading="lazy"
                src={file}
                alt="Select a file"
                width={200}
                height={100}
              />
              <i className="fa-solid fa-x" onClick={() => setFile(null)}></i>
            </Box>
          )}
        </Box>

        <Divider sx={{ margin: "1rem 0", marginTop: "1rem" }} />

        <Box
          sx={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: "1rem",
          }}>
          <Button variant="outlined" color="error" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handlePostingFacility} variant="outlined">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
