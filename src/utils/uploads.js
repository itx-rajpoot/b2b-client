import { message } from "antd";

export const beforeUpload = function(file) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    message.error("Image format must be .png or .jpeg");
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("Image size must be less than 5MB");
  }
  return isJPG && isLt2M;
};

export const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess(file);
  }, 100);
};