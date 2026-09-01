/**
 * Builds the Medical & Travel Expense Request document from `state` and
 * paginates it into #document-root. Called on load and after every edit.
 */
(function (global) {
  const { el, dataTable, section, tableBlock, moneyFmt, dateFmt } = global.Dom;

  function buildHeader(state) {
    const masthead = global.Components.buildMasthead({
      orgName: 'WCB',
      addressLines: ['333 Broadway', 'Winnipeg, MB R3C 4W3', 'Phone: (204) 954-4321', 'Toll Free: 1-855-954-4321', 'wcb.mb.ca'],
      formTitle: 'Medical & Travel Expense Request',
      claimNo: state.claimNo || '\u2014',
    });

    const intro = el('p', { className: 'doc-intro' }, [
      el('span', { className: 'data-value', text: state.workerName || 'A worker' }),
      ' requested reimbursement for the following medical and/or travel expenses:',
    ]);

    return el('div', { className: 'doc-header-block' }, [masthead, intro]);
  }

  /**
   * A table with rows becomes a `tableBlock` so the pagination engine can
   * split it across pages (repeating headers) instead of shrinking it or
   * pushing the whole table to the next page. An empty table has nothing to
   * split, so it's rendered as a plain atomic section instead.
   */
  function pushTableSection(blocks, { title, intro, columns, rows, emptyText }) {
    if (rows.length > 0) {
      blocks.push(tableBlock({ title, intro, columns, rows, emptyText }));
    } else {
      blocks.push(section(title, [intro, dataTable(columns, rows, { emptyText })]));
    }
  }

  function buildBlocks(state) {
    const blocks = [];

    pushTableSection(blocks, {
      title: 'Prescription Drugs',
      columns: [
        { key: 'drugName', label: 'Drug Name' },
        { key: 'prescriptionDate', label: 'Prescription Date', format: dateFmt },
        { key: 'datePurchased', label: 'Date Purchased', format: dateFmt },
        { key: 'healthcareProviderName', label: 'Healthcare Provider Name' },
        { key: 'paidAmount', label: 'Paid Amount', format: moneyFmt },
      ],
      rows: state.prescriptionDrugs,
    });

    pushTableSection(blocks, {
      title: 'Over-the-Counter Drugs',
      columns: [
        { key: 'drugName', label: 'Drug Name' },
        { key: 'datePurchased', label: 'Date Purchased', format: dateFmt },
        { key: 'paidAmount', label: 'Paid Amount', format: moneyFmt },
        { key: 'sellerName', label: "Seller's Name" },
        { key: 'reason', label: 'Reason for Purchasing' },
      ],
      rows: state.otcDrugs,
    });

    pushTableSection(blocks, {
      title: 'Bandages, Braces or Other Medical Supplies',
      columns: [
        { key: 'itemPurchased', label: 'Item Purchased' },
        { key: 'datePurchased', label: 'Date Purchased', format: dateFmt },
        { key: 'wasPrescribed', label: 'Was this Prescribed?' },
        { key: 'healthcareProviderName', label: 'Healthcare Provider Name' },
        { key: 'paidAmount', label: 'Paid Amount', format: moneyFmt },
        { key: 'sellerName', label: "Seller's Name" },
      ],
      rows: state.supplies,
    });

    pushTableSection(blocks, {
      title: 'Parking for Medical Appointments',
      columns: [
        { key: 'address', label: 'Address of Healthcare Provider/Medical Facility' },
        { key: 'date', label: 'Date', format: dateFmt },
        { key: 'paidAmount', label: 'Paid Amount', format: moneyFmt },
        { key: 'meterUsed', label: 'Meter Used?' },
        { key: 'meterNumber', label: 'Meter Number' },
      ],
      rows: state.parking,
    });

    pushTableSection(blocks, {
      title: 'Mileage to Medical Appointments',
      intro: el('p', {
        text:
          'The WCB will generally reimburse only those transportation costs which are in excess of costs that would be incurred by the worker while travelling to and from work.',
      }),
      columns: [
        { key: 'appointmentDate', label: 'Appointment Date', format: dateFmt },
        { key: 'healthcareAddress', label: 'Address of Healthcare Provider/Medical Facility' },
        { key: 'workplaceAddress', label: 'Address of Workplace' },
        { key: 'km', label: 'Number of km (Round Trip)' },
      ],
      rows: state.mileage,
    });

    pushTableSection(blocks, {
      title: 'Bus or Taxi Fare for Medical Appointments *',
      intro: el('p', { text: '*Note: Pre-approval is required from your WCB representative to claim taxi fare(s).' }),
      columns: [
        { key: 'appointmentDate', label: 'Appointment Date', format: dateFmt },
        { key: 'startingAddress', label: 'Address of Starting Point' },
        { key: 'healthcareAddress', label: 'Address of Healthcare Provider/Medical Facility' },
        { key: 'busOrTaxi', label: 'Bus or Taxi (indicate one)' },
        { key: 'totalFare', label: 'Total Fare Paid', format: moneyFmt },
      ],
      rows: state.busTaxi,
    });

    const privacy = el('div', { className: 'privacy-line' }, [
      el('span', { className: 'check-box' + (state.privacyChecked ? ' checked' : ''), text: state.privacyChecked ? '\u2611' : '\u2610' }),
      el('span', {}, [
        'I understand that the ',
        (() => {
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = 'Privacy Notice';
          a.addEventListener('click', (e) => e.preventDefault());
          return a;
        })(),
        ' applies to the personal information collected in this document.',
      ]),
    ]);
    blocks.push(el('div', {}, [privacy]));

    return blocks;
  }

  function renderDocument(state) {
    const container = document.getElementById('document-root');
    const header = buildHeader(state);
    const blocks = buildBlocks(state);
    Paginate.render({
      container,
      headerEl: header,
      blocks,
      renderFooter: (pageNum, totalPages) => Components.buildFooter(state, pageNum, totalPages),
    });
  }

  global.renderDocument = renderDocument;
})(window);
