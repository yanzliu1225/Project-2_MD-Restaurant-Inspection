
/**
 * EXTERNAL LIBRARY VIEW
 * Pick an external library and pipe your data to it.
 */
function formatText(str) {
  if (!str) return "Unknown";

  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function showTable(data) {
  // Requirements:
  // - Show data using an external library, such as leaflet.js or chartsjs or similar.
  // - Make a filter on this page so your external library only shows useful data.

    /*
        javascript goes here! you can return it below
    */ 
  
        /*html*/ 
  setTimeout(() => {
    const map = L.map("map").setView([38.9, -76.85], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let markers = [];

    function renderMarkers(filteredData) {
      markers.forEach(m => map.removeLayer(m));
      markers = [];

      filteredData.forEach(item => {
        const coords = item.geometry && item.geometry.coordinates;
        const props = item.properties;

        if (coords) {
          const marker = L.marker([coords[1], coords[0]])
            .addTo(map)
            .bindPopup(`
              <strong>${props.name}</strong><br>
              ${formatText(props.city)}<br>
              ${props.inspection_results}
            `);

          markers.push(marker);
        }
      });
    }

    // initial render
    renderMarkers(data);

    // filter
  const filterEl = document.getElementById("cityFilter");

  if (filterEl) {
    filterEl.addEventListener("change", (e) => {
      const value = e.target.value;

      const filtered =
        value === "all"
          ? data
          : data.filter(d => {
              const city = d.properties.city || "";
              return city.toLowerCase() === value.toLowerCase();
            });

      renderMarkers(filtered);
    });
  }

  }, 0);


  return `
    <h2 class="view-title">Map View</h2>

    <label>Filter by city:</label>
    <select id="cityFilter">
      <option value="all">All</option>
      ${[...new Set(data.map(d => formatText(d.properties.city)))]
  .sort((a, b) => a.localeCompare(b))
        .map(city => `<option value="${city}">${city}</option>`)
        .join("")}
    </select>

    <div id="map" style="height: 500px; margin-top: 20px;"></div>
  `;
}

export default showTable;

