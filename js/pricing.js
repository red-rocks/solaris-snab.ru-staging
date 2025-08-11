(function() {
  function fetchPricing() {
    const section = document.getElementById("pricing");
    if (!section) {
      console.error("No pricing section found");
      return;
    }

    const sheetUrl = section.getAttribute("data-sheet-url");
    if (!sheetUrl) {
      console.error("No sheet URL found in #pricing data attribute");
      return;
    }

    const pricingUpdateBlock = document.getElementById("pricing-update-ts");
    const pricingUpdateCellAddress = [0, 1];
    const pricingTable = document.getElementById("pricing-table");
    if (!pricingTable) {
      console.error("No pricing table found");
      return;
    }
    const pricingTableCellAddress = [2, 0];

    const priceUpdater = document.getElementById("priceUpdater");
    if(priceUpdater) priceUpdater.style.display = 'none';

    // Hide the pricing table while fetching
    pricingTable.style.visibility = 'hidden';
        pricingTable.classList.add('hidden');

    fetch(sheetUrl)
      .then(response => response.text())
      .then(csv => {
        pricingTable.classList.remove("loading-error");
        const rows = parseCSV(csv.trim());

        if (pricingUpdateBlock) {
          const dateText = rows[pricingUpdateCellAddress[0]][pricingUpdateCellAddress[1]];
          pricingUpdateBlock.innerHTML = `на ${dateText}`;
        }

        let html = `
        <article class="card pricing-row pricing-header">
          <div class="oil-type">Тип топлива</div>
          <div class="oil-brand">Поставщик</div>
          <div class="price-volume">Цена / объем</div>
          <div class="price-weight">Цена / тонна</div>
        </article>
        <hr>`;
        for (let i = 0; i < rows.length - pricingTableCellAddress[0]; i++) {
          const rowData = rows[pricingTableCellAddress[0] + i];
          if (!rowData || rowData.length < 2) continue;

          html += `
          <article class="card pricing-row">
            <div class="oil-type">${rowData[0] || ''}</div>
            <div class="oil-brand">${rowData[1] || ''}</div>
            <div class="price-volume">${rowData[2] || ''}</div>
            <div class="price-weight">${rowData[3] || ''}</div>
          </article>
          `;
        }
        html += `<hr>`;
        pricingTable.innerHTML = html;

        // Show the pricing table again after data is loaded
        pricingTable.style.visibility = '';
        pricingTable.classList.remove('hidden');

        if(priceUpdater) priceUpdater.style.display = '';
      })
      .catch(err => {
        pricingTable.classList.add("loading-error");
        pricingTable.textContent = "Не удалось загрузить данные по ценам";

        // Show the pricing table even on error so message is visible
        pricingTable.style.display = '';
        pricingTable.classList.remove('hidden');

        if(priceUpdater) priceUpdater.style.display = '';
        console.error(err);
      });
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field);
        field = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }
    if (field !== '' || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  document.addEventListener("DOMContentLoaded", fetchPricing);

  // expose to global for button click
  window.fetchPricing = fetchPricing;
})();
