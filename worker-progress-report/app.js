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

  function radioField(label, obj, key, options) {
    const wrap = el('div', { className: 'field' });
    wrap.appendChild(el('label', { text: label }));
    wrap.appendChild(Editor.buildRadioGroup(obj, key, options, rerender));
    return wrap;
  }

  function buildEditor() {
    const panel = document.getElementById('control-panel');
    panel.innerHTML = '';

    panel.appendChild(el('h2', { text: 'Sample datasets' }));
    const presetBar = el('div', { className: 'preset-bar' });
    [
      ['empty', 'Empty form'],
      ['typical', 'Matches sample PDF'],
      ['detailed', 'Long answers'],
    ].forEach(([key, label]) => {
      const btn = el('button', { className: 'btn secondary small', text: label });
      btn.type = 'button';
      btn.addEventListener('click', () => loadPreset(key));
      presetBar.appendChild(btn);
    });
    panel.appendChild(presetBar);
    panel.appendChild(
      el('p', {
        className: 'hint',
        text: 'This form has no repeating tables — its dynamic elements are the selections, the pain scale, and free-text answer lengths. Try "Long answers" to see extra pages appear.',
      })
    );

    panel.appendChild(el('h2', { text: 'Claim details' }));
    panel.appendChild(Editor.buildField(state, 'workerName', { label: 'Worker name', onChange: rerender }));
    const idRow = el('div', { className: 'field-row' }, [
      Editor.buildField(state, 'claimNo', { label: 'Claim No.', onChange: rerender }),
      Editor.buildField(state, 'workerAppId', { label: 'Worker App ID', onChange: rerender }),
    ]);
    panel.appendChild(idRow);
    panel.appendChild(Editor.buildField(state, 'submitted', { label: 'Submitted (footer)', onChange: rerender }));

    panel.appendChild(el('h2', { text: 'Return to Work' }));
    panel.appendChild(
      radioField('Status', state.returnToWork, 'selection', [
        { value: 'notMissed', label: 'Have not missed time' },
        { value: 'notReturned', label: 'Have not returned' },
        { value: 'returnedOn', label: 'Returned on...' },
      ])
    );
    panel.appendChild(Editor.buildField(state.returnToWork, 'returnDate', { label: 'Return date', type: 'date', onChange: rerender }));

    panel.appendChild(
      radioField('I am working', state.working, 'selection', [
        { value: 'fullRegular', label: 'Full duties, regular hours' },
        { value: 'fullReduced', label: 'Full duties, reduced hours' },
        { value: 'modifiedRegular', label: 'Modified duties, regular hours' },
        { value: 'modifiedReduced', label: 'Modified duties, reduced hours' },
        { value: 'other', label: 'Other' },
      ])
    );
    panel.appendChild(Editor.buildField(state.working, 'otherText', { label: 'Other (describe)', onChange: rerender }));

    panel.appendChild(Editor.buildField(state, 'returnGoing', { label: 'My return to work is going:', type: 'textarea', onChange: rerender }));
    panel.appendChild(Editor.buildField(state, 'expectReturnDate', { label: 'I expect to return to work on', type: 'date', onChange: rerender }));
    panel.appendChild(Editor.buildField(state, 'concerns', { label: 'Concerns about returning to work', type: 'textarea', onChange: rerender }));
    const contactRow = el('div', { className: 'field-row' }, [
      Editor.buildField(state, 'recentContactName', { label: 'Most recent employer contact', onChange: rerender }),
      Editor.buildField(state, 'recentContactDate', { label: 'Date', type: 'date', onChange: rerender }),
    ]);
    panel.appendChild(contactRow);

    panel.appendChild(el('h2', { text: 'Recovery' }));
    panel.appendChild(
      radioField('Status', state.recovery, 'selection', [
        { value: 'notFull', label: 'Not fully recovered' },
        { value: 'full', label: 'Fully recovered' },
      ])
    );
    panel.appendChild(Editor.buildField(state.recovery, 'comments', { label: 'Comments about recovery', type: 'textarea', onChange: rerender }));
    panel.appendChild(
      Editor.buildField(state, 'painScale', {
        label: 'Pain scale (1-10)',
        type: 'select',
        options: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        onChange: rerender,
      })
    );

    panel.appendChild(el('h2', { text: 'Treatment' }));
    panel.appendChild(
      radioField('Status', state.treatment, 'selection', [
        { value: 'notContinuing', label: 'Not continuing treatment' },
        { value: 'continuing', label: 'Continuing treatment from...' },
      ])
    );
    panel.appendChild(Editor.buildField(state.treatment, 'providerType', { label: 'Medical provider type', onChange: rerender }));
    const lastRow = el('div', { className: 'field-row' }, [
      Editor.buildField(state.lastTreatment, 'date', { label: 'Last treatment date', type: 'date', onChange: rerender }),
      Editor.buildField(state.lastTreatment, 'providerName', { label: 'Provider name', onChange: rerender }),
    ]);
    panel.appendChild(lastRow);
    const nextRow = el('div', { className: 'field-row' }, [
      Editor.buildField(state.nextTreatment, 'date', { label: 'Next treatment date', type: 'date', onChange: rerender }),
      Editor.buildField(state.nextTreatment, 'providerName', { label: 'Provider name', onChange: rerender }),
    ]);
    panel.appendChild(nextRow);
    panel.appendChild(Editor.buildField(state, 'chiroFrequency', { label: 'Chiropractor/Physiotherapist frequency', onChange: rerender }));

    panel.appendChild(el('h2', { text: 'Medication & Exercises' }));
    panel.appendChild(
      radioField('Medication status', state.medication, 'selection', [
        { value: 'not', label: 'Not taking medication' },
        { value: 'taking', label: 'Taking medication...' },
      ])
    );
    panel.appendChild(Editor.buildField(state.medication, 'medName', { label: 'Name of prescribed medication', onChange: rerender }));
    panel.appendChild(
      radioField('Home exercises', state.homeExercises, 'selection', [
        { value: 'not', label: 'Not doing home exercises' },
        { value: 'doing', label: 'Doing home exercises...' },
      ])
    );
    panel.appendChild(Editor.buildField(state.homeExercises, 'list', { label: 'List the exercises', type: 'textarea', onChange: rerender }));

    panel.appendChild(el('h2', { text: 'Other information' }));
    panel.appendChild(Editor.buildField(state, 'otherInfo', { label: 'Additional information', type: 'textarea', onChange: rerender }));

    panel.appendChild(el('h2', { text: 'Certification' }));
    panel.appendChild(Editor.buildField(state, 'certifyChecked', { type: 'checkbox', label: 'I certify this information is true', onChange: rerender }));
    panel.appendChild(Editor.buildField(state, 'privacyChecked', { type: 'checkbox', label: 'Privacy notice acknowledged', onChange: rerender }));
  }

  document.getElementById('print-btn').addEventListener('click', () => window.print());

  buildEditor();
  rerender();
})();
