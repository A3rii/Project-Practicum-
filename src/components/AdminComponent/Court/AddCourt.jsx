/* eslint-disable react/prop-types */
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
import { notify, errorAlert } from "./../../../utils/toastAlert";
import { v4 } from "uuid";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
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

export default function AddCourt({
  open,
  closeModal,
  updateModal,
  facilityId,
}) {
  const token = authToken();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lessorImages, setLessorImages] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  console.log(facilityId);

  const metadata = {
    contentType: "image/*",
  };

  const handlePostingCourt = async (e) => {
    e.preventDefault();

    if (lessorImages.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const imageUrls = [];

    for (let i = 0; i < lessorImages.length; i++) {
      const image = lessorImages[i];
      const imageID = v4();
      const imageFormat = image.type.split("/")[1];
      const imgRef = ref(storage, `court_image/${imageID}.${imageFormat}`);
      const uploadTask = uploadBytesResumable(imgRef, image, metadata);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading image:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            imageUrls.push(downloadURL);
            resolve();
          }
        );
      });
    }

    try {
      const credentials = {
        name: name,
        description: description,
        image: imageUrls,
      };

      const postingProduct = await axios.post(
        `${import.meta.env.VITE_API_URL}/lessor/court/${facilityId}`,
        credentials,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Product posted successfully:", postingProduct.data);

      closeModal();
      updateModal();
      notify("Court Add Successfully");
    } catch (err) {
      console.error("Error posting product:", err);
      errorAlert("Fail to add court.");
      if (err.response) {
        console.error("Error response data:", err.response.data);
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setLessorImages(files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(filePreviews);
  };

  const handleRemoveFile = (index) => {
    const updatedLessorImages = lessorImages.filter((_, i) => i !== index);
    setLessorImages(updatedLessorImages);
    const updatedFilePreviews = filePreviews.filter((_, i) => i !== index);
    setFilePreviews(updatedFilePreviews);
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={closeModal}
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
            sx={{ width: "100%" }}
            InputProps={{
              endAdornment: <SportsBasketballIcon style={{ color: "#888" }} />,
            }}
            label="Court"
            onChange={(e) => setName(e.target.value)}
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
            variant="contained"
            startIcon={<CloudUploadIcon />}>
            Upload files
            <VisuallyHiddenInput
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            marginTop: "1rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
          {filePreviews.map((file, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <img
                loading="lazy"
                src={file}
                alt="Preview"
                width={150}
                height={100}
              />
              <i
                className="fa-solid fa-x"
                onClick={() => handleRemoveFile(index)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  cursor: "pointer",
                }}></i>
            </Box>
          ))}
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
          <Button onClick={handlePostingCourt} variant="outlined">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
