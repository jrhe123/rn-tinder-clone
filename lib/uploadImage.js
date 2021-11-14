import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1";
const CLOUD_NAME = "dqtdsrmtz";
const UPLOAD_PRESET = "b7pf403i";

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append("file", {
      uri: file.uri,
      name: "upload.jpg",
      type: "image/jpeg",
    });
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);
    const config = {
      url: `${CLOUDINARY_URL}/${CLOUD_NAME}/image/upload`,
      data: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
    };
    axios(config)
      .then((response) => {
        return JSON.stringify(response.data);
      })
      .then((response) => {
        response = JSON.parse(response);
        resolve(response.url);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default uploadImage;
