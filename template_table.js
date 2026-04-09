/**
 * TABLE VIEW
 * Display data in sortable rows - good for scanning specific information
 */ 

/*html*/ 

function showTable(data) {
  const rows = data.map(item => {
    const p = item.properties;
    const result = (p.inspection_results || "").trim();

    const compliantPhrases = [
        "Facility Reopened", 
        "Compliant - No Health Risk", 
        "Compliance Schedule - Completed", 
        "Compliance Schedule - Outstanding"
    ];

    const nonCompliantPhrases = [
        "Non-Compliant - Violations Observed", 
        "Critical Violations observed", 
        "------"
    ];


    let isOk = compliantPhrases.some(phrase => result.includes(phrase));
    if (nonCompliantPhrases.some(phrase => result.includes(phrase))) {
        isOk = false;
    }

    return `
      <tr>
        <td style="font-weight: bold;">${p.name || "N/A"}</td>
        <td>${p.city || "N/A"}</td>
        <td style="font-size: 0.85rem;">${result || "N/A"}</td>
        <td style="font-family: monospace;">${p.inspection_date?.split("T")[0] || "N/A"}</td>
        <td style="background-color: ${isOk ? '#ccffcc' : '#ffcccc'}; font-weight: 900; color: black;">
          ${isOk ? "✅ COMPLIANT" : "❗ NOT COMPLIANT"}
        </td>
      </tr>
    `;
  }).join("");

  return `
    <h2 class="view-title">INSPECTION LOG</h2>

    <table class="data-table" style="width: 100%; border-collapse: collapse; border: 4px solid black;">
      <thead>
        <tr style="background: black; color: white;">
          <th onclick="sortTable(0)" style="padding: 10px; cursor: pointer;">NAME</th>
          <th onclick="sortTable(1)" style="padding: 10px; cursor: pointer;">CITY</th>
          <th onclick="sortTable(2)" style="padding: 10px; cursor: pointer;">RESULT</th>
          <th onclick="sortTable(3)" style="padding: 10px; cursor: pointer;">DATE</th>
          <th onclick="sortTable(4)" style="padding: 10px; cursor: pointer;">STATUS</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

export default showTable;