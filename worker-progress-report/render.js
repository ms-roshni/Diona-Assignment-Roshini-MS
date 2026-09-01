/**
 * Builds the Worker Progress Report document from `state` and paginates it
 * into #document-root. Called on load and after every edit.
 */
(function (global) {
  const { el, section, checkOption, dateFmt, fieldUnit, staticText, fieldSentence } = global.Dom;

  function buildHeader(state) {
    const masthead = global.Components.buildMasthead({
      orgName: 'WCB',
      addressLines: ['333 Broadway', 'Winnipeg, MB R3C 4W3', 'Phone: (204) 954-4321', 'Toll Free: 1-855-954-4321', 'wcb.mb.ca'],
      formTitle: 'Worker Progress Report',
      claimNo: state.claimNo || '\u2014',
      formCode: 'WP',
    });

    const intro = el('p', { className: 'doc-intro' }, [
      el('span', { className: 'data-value', text: state.workerName || 'A worker' }),
      ' provided the following updates in relation to their claim:',
    ]);

    return el('div', { className: 'doc-header-block' }, [masthead, intro]);
  }

  function selectBox(labelText, options) {
    const box = el('div', { className: 'select-box' });
    box.appendChild(el('span', { className: 'select-label', text: labelText }));
    const group = el('div', { className: 'check-group' });
    options.filter(Boolean).forEach((o) => group.appendChild(o));
    box.appendChild(group);
    return box;
  }

  function freeTextBox(labelText, valueText) {
    const box = el('div', { className: 'free-text-box' });
    box.appendChild(el('span', { className: 'fld-label', text: labelText }));
    if (valueText) box.appendChild(el('div', { className: 'fld-value data-value', text: valueText }));
    return box;
  }

  function buildBlocks(state) {
    const blocks = [];

    blocks.push(
      section('Return to Work', [
        selectBox('Select one:', [
          checkOption(state.returnToWork.selection === 'notMissed', 'I have not missed time from work'),
          checkOption(state.returnToWork.selection === 'notReturned', 'I have not returned to work'),
          checkOption(state.returnToWork.selection === 'returnedOn', 'I returned to work on:'),
          state.returnToWork.selection === 'returnedOn' ? fieldUnit(dateFmt(state.returnToWork.returnDate), 'Date') : null,
        ]),
        selectBox('I am working:', [
          checkOption(state.working.selection === 'fullRegular', 'Full duties, regular hours'),
          checkOption(state.working.selection === 'fullReduced', 'Full duties, reduced hours'),
          checkOption(state.working.selection === 'modifiedRegular', 'Modified duties, regular hours'),
          checkOption(state.working.selection === 'modifiedReduced', 'Modified duties, reduced hours'),
          checkOption(state.working.selection === 'other', 'Other:'),
          state.working.selection === 'other' ? fieldUnit(state.working.otherText, 'Description') : null,
        ]),
      ])
    );

    blocks.push(section(null, [freeTextBox('My return to work is going:', state.returnGoing)]));

    blocks.push(
      section(null, [
        fieldSentence([
          staticText('I expect to return to work on:'),
          fieldUnit(dateFmt(state.expectReturnDate), 'Date'),
        ]),
      ])
    );

    blocks.push(section(null, [freeTextBox('I have the following concerns about returning to work:', state.concerns)]));

    blocks.push(
      section(null, [
        fieldSentence([
          staticText('I was most recently in contact with:'),
          fieldUnit(state.recentContactName, 'Name of employer contact'),
          staticText('on'),
          fieldUnit(dateFmt(state.recentContactDate), 'Date'),
        ]),
      ])
    );

    blocks.push(
      section('Recovery', [
        selectBox('Select one:', [
          checkOption(state.recovery.selection === 'notFull', 'I have not fully recovered from my workplace injury.'),
          checkOption(state.recovery.selection === 'full', 'I have fully recovered from my workplace injury.'),
        ]),
        freeTextBox('I have provided the following comments about my recovery:', state.recovery.comments),
      ])
    );

    const painGrid = el('div', { className: 'pain-grid' });
    for (let i = 1; i <= 10; i++) {
      painGrid.appendChild(checkOption(String(state.painScale) === String(i), String(i)));
    }
    blocks.push(
      section(null, [
        el('div', { className: 'pain-scale' }, [
          el('p', { text: 'I rate my current pain/discomfort on a scale of 1-10, where 1 is no pain and 10 is severe pain out of 10.' }),
          painGrid,
        ]),
      ])
    );

    blocks.push(
      section(null, [
        selectBox('Select one:', [
          checkOption(state.treatment.selection === 'notContinuing', 'I am not continuing to receive medical treatment for my workplace injury.'),
          checkOption(state.treatment.selection === 'continuing', 'I am continuing to receive medical treatment for my workplace injury from:'),
          state.treatment.selection === 'continuing' ? fieldUnit(state.treatment.providerType, 'Medical Provider Type') : null,
        ]),
      ])
    );

    blocks.push(
      section(null, [
        fieldSentence([
          staticText('My last medical treatment was'),
          fieldUnit(dateFmt(state.lastTreatment.date), 'Date'),
          staticText('from'),
          fieldUnit(state.lastTreatment.providerName, 'Medical Provider Name'),
        ]),
      ])
    );

    blocks.push(
      section(null, [
        fieldSentence([
          staticText('My next medical treatment is'),
          fieldUnit(dateFmt(state.nextTreatment.date), 'Date'),
          staticText('from'),
          fieldUnit(state.nextTreatment.providerName, 'Medical Provider Name'),
        ]),
      ])
    );

    blocks.push(
      section(null, [
        fieldSentence([
          staticText('I am attending a Chiropractor or Physiotherapist'),
          fieldUnit(state.chiroFrequency, 'Frequency'),
        ]),
      ])
    );

    blocks.push(
      section(null, [
        selectBox('Select one:', [
          checkOption(state.medication.selection === 'not', 'I am not taking medication for my workplace injury.'),
          checkOption(state.medication.selection === 'taking', 'I am taking medication for my workplace injury:'),
          state.medication.selection === 'taking' ? fieldUnit(state.medication.medName, 'Name of prescribed medication') : null,
        ]),
      ])
    );

    blocks.push(
      section(null, [
        selectBox('Select one:', [
          checkOption(state.homeExercises.selection === 'not', 'I am not doing home exercises for my workplace injury.'),
          checkOption(state.homeExercises.selection === 'doing', 'I am doing home exercises for my workplace injury.'),
        ]),
        freeTextBox('List the exercises you are doing:', state.homeExercises.list),
      ])
    );

    blocks.push(
      section('Other Information', [
        freeTextBox('I would like to provide the following additional information about my claim/injury:', state.otherInfo),
      ])
    );

    blocks.push(
      section(null, [
        el('div', { className: 'certify-block' }, [
          el('span', { className: 'check-box' + (state.certifyChecked ? ' checked' : ''), text: state.certifyChecked ? '\u2611' : '\u2610' }),
          el('span', {
            text:
              'I certify that the information given on this form is true, correct and complete to the best of my knowledge. I agree to notify the Workers Compensation Board of Manitoba (WCB) immediately once I return to any form of work and/or employment. I understand that it is an offence to knowingly make a false statement to the WCB. I also understand that it is an offence to withhold information from WCB which affects my entitlement to compensation (e.g., full or partial recovery from injury, ability to return to work, sources of additional income, etc.). I understand that refusing to co-operate with, or follow my treatment, may result in the WCB reducing or suspending my benefits.',
          }),
        ]),
      ])
    );

    blocks.push(
      section(null, [
        el('div', { className: 'privacy-line' }, [
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
        ]),
      ])
    );

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
