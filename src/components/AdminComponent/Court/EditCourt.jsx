/* eslint-disable react/prop-types */
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
import { useState, useEffect, useCallback } from "react";
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
  courtId,
}) {
  const token = authToken();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lessorImages, setLessorImages] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const metadata = {
    contentType: "image/*",
  };

  const getCourtById = useCallback(async () => {
    try {
      const request = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/lessor/facility/${facilityId}/court/${courtId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = request.data.court;
      setName(data.name);
      setDescription(data.description);
      setExistingImages(data.image || []);
    } catch (err) {
      console.log(err.message);
    }
  }, [courtId, facilityId, token]);

  useEffect(() => {
    if (courtId && open) {
      getCourtById();
    }
  }, [courtId, open, getCourtById]);

  const handlePostingCourt = async (e) => {
    e.preventDefault();

    const imageUrls = [...existingImages];

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

      const postingProduct = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/lessor/facility/${facilityId}/court/${courtId}`,
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
      notify("Court Update Successfully");
    } catch (err) {
      console.error("Error posting product:", err);
      errorAlert("Update Failed");
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

  const handleRemoveExistingImage = (index) => {
    const updatedExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedExistingImages);
  };

  console.log(existingImages);

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
          Edit Court
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
            value={name}
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
            value={description}
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
          {existingImages.map((file, index) => (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "start", gap: "1rem" }}>
              <img
                loading="lazy"
                src={file}
                alt="Existing"
                width={150}
                height={100}
              />
              <i
                className="fa-solid fa-x"
                onClick={() => handleRemoveExistingImage(index)}
                style={{ cursor: "pointer", fontSize: ".8rem" }}></i>
            </Box>
          ))}
          {filePreviews.map((file, index) => (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "start", gap: "1rem" }}>
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
