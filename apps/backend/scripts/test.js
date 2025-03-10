const options = {
  method: "POST",
  headers: { "x-api-key": "<api-key>", "Content-Type": "application/json" },
  body: '{"callback_url":"","replica_name":"","train_video_url":""}',
};

fetch("https://tavusapi.com/v2/replicas", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
