/**
 * STATS VIEW
 * Show aggregate statistics and insights using strict compliance rules.
 */
function showStats(data) {
  if (!data || data.length === 0) return `<div class="stat-card">No Data Available</div>`;

  // --- 1. THE SHARED LOGIC HELPER ---
  const checkCompliance = (item) => {
    const result = (item.properties.inspection_results || "").trim();
    
    // Explicit Pass phrases
    const compliantPhrases = [
      "Facility Reopened",
      "Compliant - No Health Risk",
      "Compliance Schedule - Completed",
      "Compliance Schedule - Outstanding"
    ];

    // Explicit Fail phrases
    const nonCompliantPhrases = [
      "Non-Compliant - Violations Observed",
      "Critical Violations observed",
      "------"
    ];

    // Check if it's in the pass list
    let isOk = compliantPhrases.some(phrase => result.includes(phrase));

    // Force failure if it's in the fail list (even if it somehow has pass words)
    if (nonCompliantPhrases.some(phrase => result.includes(phrase))) {
      isOk = false;
    }
    
    return isOk;
  };

  // --- 2. CALCULATIONS ---
  const total = data.length;

  // Use the helper to count
  const compliant = data.filter(item => checkCompliance(item)).length;
  const notCompliant = total - compliant;

  // Percentages
  const percentYes = ((compliant / total) * 100).toFixed(1);
  const percentNot = (100 - parseFloat(percentYes)).toFixed(1);

  // --- 3. CITY ANALYTICS ---
  const cityStats = {};

  data.forEach(item => {
    const city = item.properties.city || "Unknown";
    const isCompliant = checkCompliance(item);

    if (!cityStats[city]) {
      cityStats[city] = { total: 0, compliant: 0 };
    }

    cityStats[city].total++;
    if (isCompliant) cityStats[city].compliant++;
  });

  // Calculate Worst/Best safely
  const cityEntries = Object.entries(cityStats);
  
  const worstCity = cityEntries.length > 0 
    ? cityEntries.map(([city, stats]) => ({
        city,
        violations: stats.total - stats.compliant
      })).sort((a, b) => b.violations - a.violations)[0]
    : { city: "N/A", violations: 0 };

  const bestCity = cityEntries.length > 0
    ? cityEntries.map(([city, stats]) => ({
        city,
        rate: stats.compliant / stats.total
      })).sort((a, b) => b.rate - a.rate)[0]
    : { city: "N/A", rate: 0 };
  
  // --- 4. RETURN HTML ---
  return `
    <h2 class="view-title">STATS OVERVIEW</h2>

    <p style="font-family: 'Roboto Mono', monospace; font-weight: bold; margin-bottom: 20px;">
      ONLY ${percentYes}% of restaurants meet compliance standards.
    </p>

    <div class="stats-container">

      <div class="stat-card highlight" style="border-width: 6px;">
        <h3>TOTAL RECORDS</h3>
        <p class="big-number">${total}</p>
      </div>

      <div class="stat-card">
        <h3>IN COMPLIANCE</h3>
        <p class="big-number" style="color: black;">${percentYes}%</p>
        <p>${compliant} Restaurants</p>
      </div>

      <div class="stat-card" style="border-color: #e31837;">
        <h3>NOT IN COMPLIANCE</h3>
        <p class="big-number" style="color: #e31837;">${percentNot}%</p>
        <p>${notCompliant} Restaurants</p>
      </div>

      <div class="stat-card">
        <h3>HIGHEST RISK AREA</h3>
        <p class="big-number">${worstCity.city}</p>
        <p>${worstCity.violations} Total Violations</p>
      </div>

      <div class="stat-card">
        <h3>TOP PERFORMANCE</h3>
        <p class="big-number">${bestCity.city}</p>
        <p>${(bestCity.rate * 100).toFixed(1)}% Compliance Rate</p>
      </div>

    </div>
  `;
}

export default showStats;