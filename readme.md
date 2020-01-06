# Sitio Web "gifOS", página de GIFs con API Giphy

### [Live Demo](https://guido732.github.io/gifOS/)

Trabajo número 2 del curso de Desarrollo Web Full Stack de Acámica.

## Recursos y tecnologías utilizadas

- HTML5
- CSS3 - (SCSS)
- FontAwesome
- Google Fonts
- GIT para control de versiones
- [API giphy](https://developers.giphy.com/)
- [RecordRTC](https://recordrtc.org/) para obtener [stream de video](https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/RecordRTCPromisesHandler.html) a través de la cámara del dispositivo para ver durante el preview de la grabación
- [RecprdRTC](https://recordrtc.org/) para obtener [stream de gif](https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/gif-recording.html) para enviar a la api giphy para procesar
- `media.navigator.streams.fake` Para emular data de stream falsa en Firefox
- Timer basado en [ el comentario de maček en StackOverflow](https://stackoverflow.com/a/20319035/11596203)
- Loading Bar basada en [tutorial de W3Schools](https://www.w3schools.com/howto/howto_js_progressbar.asp)
- Testeo de respuestas de éxito/error con [mocky.io](https://www.mocky.io/)

El objetivo del trabajo es generar una página web incorporando los conocimientos adquiridos en la primera etapa que permita obtener datos de la API de giphy a través de un request a la misma.

---

Project #2 from the Full Stack Web Development career in Acámica.

## Resources and technologies used:

- HTML5
- CSS3 - SASS/SCSS
- FontAwesome Icons
- Google Fonts
- Git for version control
- [API giphy](https://developers.giphy.com/)
- [RecordRTC](https://recordrtc.org/) to get [video stream](https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/RecordRTCPromisesHandler.html) through your device's camera to be able to preview the image during recording and review
- [RecprdRTC](https://recordrtc.org/) to get [gif stream](https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/gif-recording.html) to upload to Giphy's API for processing once reviewed
- `media.navigator.streams.fake` To emular fake stream data on Firefox
- Timer based on [maček's comment on StackOverflow](https://stackoverflow.com/a/20319035/11596203)
- Loading Bar based ok [tutorial from W3Schools](https://www.w3schools.com/howto/howto_js_progressbar.asp)
- API response testing using [mocky.io](https://www.mocky.io/)

The goal was to generate a website which would incorporate the knowledge acquired in the first stage of the course that could also communicate with giphy's web API, getting images dynamically through requests sent to it.
