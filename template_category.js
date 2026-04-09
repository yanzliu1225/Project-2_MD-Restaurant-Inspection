/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories - good for understanding relationships and patterns
 */
function showCategories(data) {

  /* JavaScript Goes Here */ 

  /* html */

  const grouped = data.reduce((acc, item) => {
  const key = item.properties.city || "Unknown";

  if (!acc[key]) {
    acc[key] = [];
  }

  acc[key].push(item);
  return acc;
}, {});

const categoryHTML = Object.entries(grouped)
  .map(([category, items]) => {
    return `
      <div class="category-section">
        
        <div class="category-header">
          <span>${category}</span>
          <span>${items.length}</span>
        </div>

        <div class="category-items">
          ${items
            .map((item) => {
              const p = item.properties;

              return `
                <div class="category-item-card">
                  <strong>${p.name}</strong>
                <p>Owner: ${p.owner || "N/A"}</p>
                <p>Inspection Date: ${p.inspection_date?.split("T")[0] || "N/A"}</p>
                <p>${p.inspection_results || "N/A"}</p>
              </div>
              `;
            })
            .join("")}
        </div>

      </div>
    `;
  })
  .join("");

return `
    <h2 class="view-title">Category View</h2>
    <div class="category-container">
      ${categoryHTML}
    </div>
  `;
}

export default showCategories;
