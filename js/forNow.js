function seeLocation({ lat, lng, zoom, name }) {
  map = new google.maps.Map(document.querySelector("#map"), {
    title: name,
    center: { lat, lng },
    zoom,
  });
  new google.maps.Marker({
    position: { lat, lng },
    map,
    title: name,
  });
}
