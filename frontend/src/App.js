import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Alert,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const API_URL = "http://localhost:5000/api";

// Styled Components
const DropZone = styled(Paper)(({ theme, isDragActive }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  border: `2px dashed ${
    isDragActive ? theme.palette.primary.main : theme.palette.divider
  }`,
  backgroundColor: isDragActive
    ? theme.palette.action.hover
    : theme.palette.background.paper,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateX(8px)",
    boxShadow: theme.shadows[2],
  },
}));

const SummaryText = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));

const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
}));

const FileInputBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
});

const DocumentInfoBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const ButtonStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const HiddenInput = styled("input")({
  display: "none",
});

const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

function App() {
  const [documents, setDocuments] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data);
    } catch (error) {
      setError("Error fetching documents. Please try again later.");
      console.error("Error fetching documents:", error);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    const file = event.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      handleUpload(file);
    } else {
      setError("Please upload only PDF or DOCX files.");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("document", file);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchDocuments();
    } catch (error) {
      setError("Error uploading document. Please try again.");
      console.error("Error uploading document:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/documents/${id}`);
      fetchDocuments();
    } catch (error) {
      setError("Error deleting document. Please try again.");
      console.error("Error deleting document:", error);
    }
  };

  return (
    <MainContainer maxWidth="md">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Document Management System
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <DropZone
          isDragActive={isDragActive}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <HiddenInput
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            id="file-input"
          />
          <label htmlFor="file-input">
            <FileInputBox>
              <UploadIcon />
              <Typography variant="h6" color="textSecondary">
                Drag and drop your files here or click to browse
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Supported formats: PDF, DOCX
              </Typography>
              {isUploading && (
                <Typography variant="body2" color="primary">
                  Uploading...
                </Typography>
              )}
            </FileInputBox>
          </label>
        </DropZone>

        <Typography variant="h6" gutterBottom>
          Uploaded Documents
        </Typography>

        <List>
          {documents.map((doc) => (
            <StyledListItem key={doc.id} component={Paper}>
              <ListItemText
                primary={doc.title}
                secondary={
                  <DocumentInfoBox>
                    <Typography variant="body2" color="text.primary">
                      Category: {doc.category}
                    </Typography>
                    <Typography variant="body2">
                      Upload Date:{" "}
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </Typography>
                    <SummaryText variant="body2">
                      Summary: {doc.summary}
                    </SummaryText>
                    <ButtonStack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => window.open(doc.s3Url, "_blank")}
                        variant="outlined"
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(doc.id)}
                        variant="outlined"
                        color="error"
                      >
                        Delete
                      </Button>
                    </ButtonStack>
                  </DocumentInfoBox>
                }
              />
            </StyledListItem>
          ))}
        </List>
      </Box>
    </MainContainer>
  );
}

export default App;
