/**
 * Sample data presets for the Worker Progress Report generator.
 * This form has no repeating tables — its "dynamic" data elements are the
 * exclusive selections (radio-style choices), free-text comment lengths,
 * and the 1-10 pain scale. Presets exercise all of these so reviewers can
 * see the page react to short vs. long answers and different selections.
 */
(function (global) {
  function emptyState() {
    return {
      claimNo: '',
      workerName: '',
      workerAppId: '',
      submitted: '',
      returnToWork: { selection: '', returnDate: '' },
      working: { selection: '', otherText: '' },
      returnGoing: '',
      expectReturnDate: '',
      concerns: '',
      recentContactName: '',
      recentContactDate: '',
      recovery: { selection: '', comments: '' },
      painScale: '',
      treatment: { selection: '', providerType: '' },
      lastTreatment: { date: '', providerName: '' },
      nextTreatment: { date: '', providerName: '' },
      chiroFrequency: '',
      medication: { selection: '', medName: '' },
      homeExercises: { selection: '', list: '' },
      otherInfo: '',
      certifyChecked: false,
      privacyChecked: false,
    };
  }

  function typicalState() {
    return {
      claimNo: '20042047',
      workerName: 'Madeleine Willson',
      workerAppId: '712041',
      submitted: 'March 19, 2024 19:21',
      returnToWork: { selection: 'returnedOn', returnDate: '2024-03-15' },
      working: { selection: 'modifiedReduced', otherText: '' },
      returnGoing: 'Terrible. Testing Testing',
      expectReturnDate: '',
      concerns: '',
      recentContactName: '',
      recentContactDate: '',
      recovery: { selection: 'full', comments: '' },
      painScale: '',
      treatment: { selection: '', providerType: '' },
      lastTreatment: { date: '', providerName: '' },
      nextTreatment: { date: '', providerName: '' },
      chiroFrequency: '',
      medication: { selection: '', medName: '' },
      homeExercises: { selection: '', list: '' },
      otherInfo: 'No info Testing Testing',
      certifyChecked: true,
      privacyChecked: true,
    };
  }

  function detailedState() {
    return {
      claimNo: '20155312',
      workerName: 'Jordan Ali',
      workerAppId: '918234',
      submitted: 'August 20, 2026 14:10',
      returnToWork: { selection: 'notReturned', returnDate: '' },
      working: { selection: 'other', otherText: 'Working from home, answering phones only, 2 hours/day' },
      returnGoing: 'It is going slowly. I can only manage light desk work before my shoulder starts to ache, and I need to take frequent breaks to stretch and ice the area. Some days are better than others depending on how much sleep I got the night before.',
      expectReturnDate: '2026-09-15',
      concerns: 'I am worried that my workstation is not set up correctly and that going back to full duties too soon will cause a setback. I would like an ergonomic assessment before increasing my hours.',
      recentContactName: 'Priya Nandan',
      recentContactDate: '2026-08-18',
      recovery: { selection: 'notFull', comments: 'Range of motion in my right shoulder is improving but I still have sharp pain when lifting anything over 5 lbs above shoulder height.' },
      painScale: '6',
      treatment: { selection: 'continuing', providerType: 'Physiotherapist' },
      lastTreatment: { date: '2026-08-14', providerName: 'Riverbend Physiotherapy Clinic' },
      nextTreatment: { date: '2026-08-28', providerName: 'Riverbend Physiotherapy Clinic' },
      chiroFrequency: 'Twice per week',
      medication: { selection: 'taking', medName: 'Naproxen 250mg, twice daily' },
      homeExercises: { selection: 'doing', list: 'Pendulum swings, wall crawls, and resistance band external rotations, 3 sets of 15 reps, twice a day.' },
      otherInfo: 'I have an upcoming MRI scheduled for September 3rd to check on the rotator cuff. I will share results with WCB as soon as they are available.',
      certifyChecked: true,
      privacyChecked: true,
    };
  }

  global.Presets = {
    empty: emptyState,
    typical: typicalState,
    detailed: detailedState,
  };
})(window);
