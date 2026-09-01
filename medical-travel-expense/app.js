(function () {
  const { el } = Dom;
  let state = Presets.typical();

  function rerender() {
    renderDocument(state);
  }

  function loadPreset(name) {
    state = Presets[name]();
    buildEditor();
    rerender();
  }

  function buildEditor() {
    const panel = document.getElementById('control-panel');
    panel.innerHTML = '';

    panel.appendChild(el('h2', { text: 'Sample datasets' }));
    const presetBar = el('div', { className: 'preset-bar' });
    [
      ['empty', 'Empty form'],
      ['typical', 'One entry each'],
      ['multiple', 'Multiple entries'],
    ].forEach(([key, label]) => {
      const btn = el('button', { className: 'btn secondary small', text: label });
      btn.type = 'button';
      btn.addEventListener('click', () => loadPreset(key));
      presetBar.appendChild(btn);
    });
    panel.appendChild(presetBar);
    panel.appendChild(el('p', { className: 'hint', text: 'Presets swap the entire dataset so you can see the layout react to 0, 1, or many rows per table — and to more pages than fit on one sheet.' }));

    panel.appendChild(el('h2', { text: 'Claim details' }));
    panel.appendChild(Editor.buildField(state, 'workerName', { label: 'Worker name', onChange: rerender }));
    panel.appendChild(Editor.buildField(state, 'claimNo', { label: 'Claim No.', onChange: rerender }));
    const row = el('div', { className: 'field-row' }, [
      Editor.buildField(state, 'workerAppId', { label: 'Worker App ID', onChange: rerender }),
      Editor.buildField(state, 'submitted', { label: 'Submitted (footer)', onChange: rerender }),
    ]);
    panel.appendChild(row);
    panel.appendChild(Editor.buildField(state, 'privacyChecked', { type: 'checkbox', label: 'Privacy notice acknowledged', onChange: rerender }));

    const tableEditors = [
      { title: 'Prescription Drugs', key: 'prescriptionDrugs', fields: [
        { key: 'drugName', label: 'Drug name' },
        { key: 'prescriptionDate', label: 'Prescription date', type: 'date' },
        { key: 'datePurchased', label: 'Date purchased', type: 'date' },
        { key: 'healthcareProviderName', label: 'Healthcare provider' },
        { key: 'paidAmount', label: 'Paid amount', type: 'number' },
      ]},
      { title: 'Over-the-Counter Drugs', key: 'otcDrugs', fields: [
        { key: 'drugName', label: 'Drug name' },
        { key: 'datePurchased', label: 'Date purchased', type: 'date' },
        { key: 'paidAmount', label: 'Paid amount', type: 'number' },
        { key: 'sellerName', label: "Seller's name" },
        { key: 'reason', label: 'Reason for purchasing' },
      ]},
      { title: 'Bandages, Braces or Supplies', key: 'supplies', fields: [
        { key: 'itemPurchased', label: 'Item purchased' },
        { key: 'datePurchased', label: 'Date purchased', type: 'date' },
        { key: 'wasPrescribed', label: 'Was this prescribed?', type: 'select', options: ['Yes', 'No'] },
        { key: 'healthcareProviderName', label: 'Healthcare provider' },
        { key: 'paidAmount', label: 'Paid amount', type: 'number' },
        { key: 'sellerName', label: "Seller's name" },
      ]},
      { title: 'Parking', key: 'parking', fields: [
        { key: 'address', label: 'Healthcare/medical facility address' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'paidAmount', label: 'Paid amount', type: 'number' },
        { key: 'meterUsed', label: 'Meter used?', type: 'select', options: ['Yes', 'No'] },
        { key: 'meterNumber', label: 'Meter number' },
      ]},
      { title: 'Mileage', key: 'mileage', fields: [
        { key: 'appointmentDate', label: 'Appointment date', type: 'date' },
        { key: 'healthcareAddress', label: 'Healthcare/medical facility address' },
        { key: 'workplaceAddress', label: 'Workplace address' },
        { key: 'km', label: 'Number of km (round trip)', type: 'number' },
      ]},
      { title: 'Bus or Taxi Fare', key: 'busTaxi', fields: [
        { key: 'appointmentDate', label: 'Appointment date', type: 'date' },
        { key: 'startingAddress', label: 'Starting point address' },
        { key: 'healthcareAddress', label: 'Healthcare/medical facility address' },
        { key: 'busOrTaxi', label: 'Bus or taxi', type: 'select', options: ['Bus', 'Taxi'] },
        { key: 'totalFare', label: 'Total fare paid', type: 'number' },
      ]},
    ];

    tableEditors.forEach(({ title, key, fields }) => {
      panel.appendChild(
        Editor.buildRepeatableSection({
          title,
          getItems: () => state[key],
          fields,
          onChange: rerender,
        })
      );
    });
  }

  document.getElementById('print-btn').addEventListener('click', () => window.print());

  buildEditor();
  rerender();
})();
