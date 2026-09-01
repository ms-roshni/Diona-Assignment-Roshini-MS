/**
 * Sample data presets for the Medical & Travel Expense Request generator.
 * Switching presets (or editing fields in the panel) demonstrates that the
 * page is fully data-driven: sections hide when empty, tables grow/shrink,
 * and pagination recalculates automatically.
 */
(function (global) {
  function emptyState() {
    return {
      claimNo: '',
      workerName: '',
      workerAppId: '',
      submitted: '',
      privacyChecked: false,
      prescriptionDrugs: [],
      otcDrugs: [],
      supplies: [],
      parking: [],
      mileage: [],
      busTaxi: [],
    };
  }

  function typicalState() {
    return {
      claimNo: '20042047',
      workerName: 'Madeleine Willson',
      workerAppId: '712041',
      submitted: 'March 28, 2024 20:43',
      privacyChecked: true,
      prescriptionDrugs: [
        { drugName: 'Naproxen', prescriptionDate: '2024-02-28', datePurchased: '2024-02-29', healthcareProviderName: 'Dr. Best', paidAmount: '20.00' },
      ],
      otcDrugs: [
        { drugName: 'Advil', datePurchased: '2024-03-28', paidAmount: '8.00', sellerName: 'Shoppers Drug Mart', reason: 'Pain' },
      ],
      supplies: [
        { itemPurchased: 'Tensor', datePurchased: '2024-02-28', wasPrescribed: 'Yes', healthcareProviderName: 'Dr. Best', paidAmount: '10.00', sellerName: 'Shoppers DrugMart' },
      ],
      parking: [
        { address: '333 St Mary Ave, Winnipeg MB R3C4A5, Canada', date: '2024-03-28', paidAmount: '10.00', meterUsed: 'Yes', meterNumber: '12245' },
      ],
      mileage: [
        { appointmentDate: '2024-03-28', healthcareAddress: 'HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', workplaceAddress: 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '20' },
      ],
      busTaxi: [
        { appointmentDate: '2024-03-28', startingAddress: '', healthcareAddress: "HSC Winnipeg Women's Hospital, 665 William Ave, Winnipeg MB R3E 0Z2, Canada", busOrTaxi: 'Bus', totalFare: '3.00' },
        { appointmentDate: '2024-03-27', startingAddress: '25 Furby St, Winnipeg MB R3C2A2, Canada', healthcareAddress: '440 Edmonton St, Winnipeg MB R3B 2M4, Canada', busOrTaxi: 'Taxi', totalFare: '15.00' },
      ],
    };
  }

  function multipleEntriesState() {
    return {
      claimNo: '20099183',
      workerName: 'Jordan Ali',
      workerAppId: '918234',
      submitted: 'August 12, 2026 09:05',
      privacyChecked: true,
      prescriptionDrugs: [
        { drugName: 'Naproxen', prescriptionDate: '2026-06-01', datePurchased: '2026-06-02', healthcareProviderName: 'Dr. Best', paidAmount: '20.00' },
        { drugName: 'Gabapentin', prescriptionDate: '2026-06-15', datePurchased: '2026-06-16', healthcareProviderName: 'Dr. Okoro', paidAmount: '34.50' },
        { drugName: 'Cyclobenzaprine', prescriptionDate: '2026-07-02', datePurchased: '2026-07-02', healthcareProviderName: 'Dr. Best', paidAmount: '18.25' },
        { drugName: 'Amoxicillin', prescriptionDate: '2026-07-20', datePurchased: '2026-07-21', healthcareProviderName: 'Dr. Okoro', paidAmount: '15.75' },
      ],
      otcDrugs: [
        { drugName: 'Advil', datePurchased: '2026-06-05', paidAmount: '8.00', sellerName: 'Shoppers Drug Mart', reason: 'Pain' },
        { drugName: 'Tylenol', datePurchased: '2026-06-20', paidAmount: '9.50', sellerName: 'Rexall', reason: 'Headache' },
        { drugName: 'Robaxacet', datePurchased: '2026-07-10', paidAmount: '11.25', sellerName: 'Walmart', reason: 'Muscle spasm' },
      ],
      supplies: [
        { itemPurchased: 'Tensor', datePurchased: '2026-06-02', wasPrescribed: 'Yes', healthcareProviderName: 'Dr. Best', paidAmount: '10.00', sellerName: 'Shoppers Drug Mart' },
        { itemPurchased: 'Wrist Brace', datePurchased: '2026-06-18', wasPrescribed: 'No', healthcareProviderName: '\u2014', paidAmount: '24.99', sellerName: 'Walmart' },
        { itemPurchased: 'Ice Pack', datePurchased: '2026-07-01', wasPrescribed: 'No', healthcareProviderName: '\u2014', paidAmount: '12.00', sellerName: 'Canadian Tire' },
        { itemPurchased: 'Crutches', datePurchased: '2026-07-22', wasPrescribed: 'Yes', healthcareProviderName: 'Dr. Okoro', paidAmount: '45.00', sellerName: 'Medical Supply Co.' },
      ],
      parking: [
        { address: '333 St Mary Ave, Winnipeg MB R3C4A5, Canada', date: '2026-06-02', paidAmount: '10.00', meterUsed: 'Yes', meterNumber: '12245' },
        { address: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', date: '2026-06-16', paidAmount: '6.50', meterUsed: 'No', meterNumber: '\u2014' },
        { address: '665 William Ave, Winnipeg MB R3E 0Z2, Canada', date: '2026-07-01', paidAmount: '8.00', meterUsed: 'Yes', meterNumber: '58831' },
      ],
      mileage: [
        { appointmentDate: '2026-06-02', healthcareAddress: 'HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', workplaceAddress: 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '20' },
        { appointmentDate: '2026-06-16', healthcareAddress: '440 Edmonton St, Winnipeg MB R3B 2M4, Canada', workplaceAddress: 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '17' },
        { appointmentDate: '2026-07-01', healthcareAddress: '665 William Ave, Winnipeg MB R3E 0Z2, Canada', workplaceAddress: 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '22' },
        { appointmentDate: '2026-07-15', healthcareAddress: '25 Furby St, Winnipeg MB R3C 2A2, Canada', workplaceAddress: 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '19' },
        { appointmentDate: '2026-07-22', healthcareAddress: '10 Osborne St, Winnipeg MB R3L 1Y1, Canada', workplaceAddress: 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '14' },
      ],
      busTaxi: [
        { appointmentDate: '2026-06-02', startingAddress: '', healthcareAddress: "HSC Winnipeg Women's Hospital, 665 William Ave, Winnipeg MB R3E 0Z2, Canada", busOrTaxi: 'Bus', totalFare: '3.00' },
        { appointmentDate: '2026-06-16', startingAddress: '25 Furby St, Winnipeg MB R3C2A2, Canada', healthcareAddress: '440 Edmonton St, Winnipeg MB R3B 2M4, Canada', busOrTaxi: 'Taxi', totalFare: '15.00' },
        { appointmentDate: '2026-07-01', startingAddress: '10 Osborne St, Winnipeg MB R3L 1Y1, Canada', healthcareAddress: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', busOrTaxi: 'Bus', totalFare: '3.00' },
        { appointmentDate: '2026-07-22', startingAddress: '25 Furby St, Winnipeg MB R3C 2A2, Canada', healthcareAddress: '665 William Ave, Winnipeg MB R3E 0Z2, Canada', busOrTaxi: 'Taxi', totalFare: '12.50' },
      ],
    };
  }

  global.Presets = {
    empty: emptyState,
    typical: typicalState,
    multiple: multipleEntriesState,
  };
})(window);
