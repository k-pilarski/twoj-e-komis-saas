// client/src/utils/printSaleAgreement.js

export const printOrDownloadAgreementPdf = (agreement) => {
  if (!agreement) return;

  const { contractNumber, saleDate, salePlace, paymentMethod, salePrice, additionalNotes, seller, buyer, vehicle } = agreement;
  const formattedPrice = Number(salePrice).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedMileage = vehicle.mileage !== null && vehicle.mileage !== undefined
    ? `${Number(vehicle.mileage).toLocaleString('pl-PL')} km`
    : 'Nie podano';

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Zezwól przeglądarce na otwieranie wyskakujących okien, aby wygenerować plik PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8" />
      <title>Umowa_${contractNumber.replace(/\//g, '_')}</title>
      <style>
        @page {
          size: A4;
          margin: 18mm 18mm 18mm 18mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: "Times New Roman", Times, serif;
          font-size: 11.5pt;
          line-height: 1.45;
          color: #000;
          background: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 18px;
          padding-bottom: 10px;
          border-bottom: 2px solid #000;
        }
        .header h1 {
          font-size: 16pt;
          font-weight: bold;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .header .meta {
          font-size: 10.5pt;
          margin-top: 4px;
        }
        .parties-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 18px;
        }
        .party-box {
          border: 1px solid #000;
          padding: 10px 12px;
        }
        .party-box h3 {
          font-size: 11pt;
          text-transform: uppercase;
          border-bottom: 1px solid #ccc;
          padding-bottom: 4px;
          margin-bottom: 8px;
        }
        .party-box p {
          font-size: 10.5pt;
          margin-bottom: 3px;
        }
        .section {
          margin-bottom: 14px;
          text-align: justify;
        }
        .section-title {
          font-weight: bold;
          text-align: center;
          margin-bottom: 6px;
          font-size: 11.5pt;
        }
        .vehicle-table {
          width: 100%;
          border-collapse: collapse;
          margin: 8px 0 12px 0;
        }
        .vehicle-table td {
          border: 1px solid #000;
          padding: 5px 8px;
          font-size: 10.5pt;
        }
        .vehicle-table td.label {
          font-weight: bold;
          width: 28%;
          background-color: #f5f5f5;
        }
        .price-highlight {
          font-weight: bold;
          font-size: 12pt;
        }
        .notes-box {
          border: 1px dashed #555;
          padding: 8px 10px;
          margin-top: 6px;
          font-size: 10pt;
        }
        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 55px;
          page-break-inside: avoid;
        }
        .signature-line {
          border-top: 1px solid #000;
          text-align: center;
          padding-top: 6px;
          font-size: 10pt;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Umowa Kupna-Sprzedaży Pojazdu</h1>
        <div class="meta">
          Nr dokumentu: <strong>${contractNumber}</strong> &nbsp;|&nbsp;
          Zawarta w dniu <strong>${saleDate} r.</strong> w miejscowości <strong>${salePlace}</strong>
        </div>
      </div>

      <div class="parties-grid">
        <div class="party-box">
          <h3>Sprzedający</h3>
          <p><strong>Firma / Komis:</strong> ${seller.dealerName}</p>
          <p><strong>Reprezentowany przez:</strong> ${seller.ownerName}</p>
          <p><strong>Adres:</strong> ${seller.address}</p>
          ${seller.phoneNumber ? `<p><strong>Telefon:</strong> ${seller.phoneNumber}</p>` : ''}
        </div>

        <div class="party-box">
          <h3>Kupujący (${buyer.type === 'COMPANY' ? 'Podmiot gospodarczy' : 'Osoba prywatna'})</h3>
          <p><strong>${buyer.type === 'COMPANY' ? 'Nazwa firmy' : 'Imię i nazwisko'}:</strong> ${buyer.name}</p>
          <p><strong>Adres:</strong> ${buyer.address}</p>
          ${buyer.type === 'PRIVATE' ? `
            <p><strong>PESEL:</strong> ${buyer.pesel}</p>
            <p><strong>Dokument tożsamości:</strong> ${buyer.idNumber}</p>
          ` : `
            <p><strong>NIP:</strong> ${buyer.nip}</p>
          `}
        </div>
      </div>

      <div class="section">
        <div class="section-title">§ 1. Przedmiot umowy</div>
        <p>
          Sprzedający oświadcza, że jest wyłącznym właścicielem niżej wymienionego pojazdu, pojazd ten jest wolny od wad prawnych, praw osób trzecich, nie toczy się żadne postępowanie, którego przedmiotem jest ten pojazd, oraz że nie stanowi on również przedmiotu zabezpieczenia:
        </p>
        <table class="vehicle-table">
          <tr>
            <td class="label">Marka i model</td>
            <td><strong>${vehicle.brand} ${vehicle.model}</strong></td>
            <td class="label">Rok produkcji</td>
            <td>${vehicle.year}</td>
          </tr>
          <tr>
            <td class="label">Numer VIN</td>
            <td><strong>${vehicle.vin}</strong></td>
            <td class="label">Nr rejestracyjny</td>
            <td>${vehicle.licensePlate}</td>
          </tr>
          <tr>
            <td class="label">Przebieg</td>
            <td>${formattedMileage}</td>
            <td class="label">Rodzaj paliwa</td>
            <td>${vehicle.fuelType || 'Nie podano'}</td>
          </tr>
          <tr>
            <td class="label">Pojemność / Moc</td>
            <td>${vehicle.engineCapacity ? `${vehicle.engineCapacity} cm³` : '-'} / ${vehicle.enginePower ? `${vehicle.enginePower} kW` : '-'}</td>
            <td class="label">Kolor</td>
            <td>${vehicle.color || 'Nie podano'}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">§ 2. Cena i warunki płatności</div>
        <p>
          1. Sprzedający sprzedaje, a Kupujący kupuje opisany w § 1 pojazd za uzgodnioną przez strony kwotę:
          <span class="price-highlight">${formattedPrice} PLN</span> (brutto).
        </p>
        <p>
          2. Płatność realizowana jest w formie: <strong>${paymentMethod}</strong>. Sprzedający potwierdza otrzymanie należności, a Kupujący kwituje odbiór pojazdu, kluczyków oraz dokumentów niezbędnych do przerejestrowania.
        </p>
      </div>

      <div class="section">
        <div class="section-title">§ 3. Stan techniczny pojazdu i postanowienia dodatkowe</div>
        <p>
          1. Kupujący oświadcza, że stan techniczny pojazdu jest mu znany, zapoznał się z nim przed zawarciem umowy i nie wnosi do niego zastrzeżeń.
          ${vehicle.isDamaged ? '<strong>Uwaga: Pojazd został sprzedany jako uszkodzony, o czym Kupujący został szczegółowo poinformowany.</strong>' : ''}
        </p>
        ${additionalNotes ? `
          <div class="notes-box">
            <strong>Dodatkowe ustalenia stron:</strong> ${additionalNotes}
          </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">§ 4. Postanowienia końcowe</div>
        <p>
          1. W sprawach nieuregulowanych w niniejszej umowie zastosowanie mają obowiązujące w tym zakresie przepisy Kodeksu Cywilnego.
        </p>
        <p>
          2. Niniejszą umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.
        </p>
      </div>

      <div class="signatures">
        <div class="signature-line">
          <strong>SPRZEDAJĄCY</strong><br />
          (czytelny podpis i pieczęć)
        </div>
        <div class="signature-line">
          <strong>KUPUJĄCY</strong><br />
          (czytelny podpis)
        </div>
      </div>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};