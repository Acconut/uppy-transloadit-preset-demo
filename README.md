# Uppy Transloadit Preset Demo

1. Create a Template with following instructions (but enter your own S3 credentials):
```json
{
  "steps": {
    ":original": {
      "robot": "/upload/handle"
    },
    "filter": {
      "use": ":original",
      "robot": "/file/filter",
      "accepts": [
        [
          "${file.mime}",
          "regex",
          "image"
        ]
      ],
      "error_on_decline": true
    },
    "resize_image": {
      "use": "filter",
      "robot": "/image/resize",
      "resize_strategy": "fillcrop",
      "width": 300,
      "height": 300,
      "format": "png",
      "imagemagick_stack": "v2.0.3"
    },
    "avatar": {
      "use": [
        "resize_image"
      ],
      "robot": "/s3/store",
      "credentials": "marius-test-credentials"
    }
  }
}
```
2. Insert your Transloadit Auth Key, Secret and Template ID into `config/index.js`
3. Run `npm start` and navigate to `http://localhost:3000`
