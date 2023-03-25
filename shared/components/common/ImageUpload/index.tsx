import React, {useCallback} from "react";
import {styled} from "@mui/system";
import {Typography} from "@mui/material";

const DropzoneContainer = styled("div")({
  border: "2px dashed #c4c4c4",
  borderRadius: "4px",
  padding: "1rem",
  textAlign: "center",
  cursor: "pointer",
});

type ImageUploadProps = {
  value: File | null;
  classes?: Partial<Record<"root", string>>;
  onChange: (file: File | null) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({value, onChange, classes}) => {
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      onChange(file);
    },
    [onChange]
  );

  const openFileDialog = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", handleFileUpload as any);
    fileInput.click();
  }, [handleFileUpload]);

  return (
    <DropzoneContainer onClick={openFileDialog} className={classes?.root}>
      <Typography variant="body1">
        {value ? "Image selected" : "Click or drag and drop an image"}
      </Typography>
    </DropzoneContainer>
  );
};

export default ImageUpload;
