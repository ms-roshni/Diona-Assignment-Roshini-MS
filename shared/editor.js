/**
 * Generic, framework-free editor-panel builders shared by both apps.
 * Every field/row is bound directly to a plain JS object so that changing
 * a value, or adding/removing a repeatable row, immediately re-renders the
 * document preview via the supplied `onChange` callback.
 */
(function (global) {
  const { el } = global.Dom;

  function buildField(obj, key, opts) {
    const wrap = el('div', { className: 'field' });
    if (opts.label) wrap.appendChild(el('label', { text: opts.label }));
    let input;
    if (opts.type === 'select') {
      input = document.createElement('select');
      (opts.options || []).forEach((o) => {
        const optEl = document.createElement('option');
        optEl.value = typeof o === 'object' ? o.value : o;
        optEl.textContent = typeof o === 'object' ? o.label : o;
        input.appendChild(optEl);
      });
      input.value = obj[key] || '';
      input.addEventListener('change', () => {
        obj[key] = input.value;
        opts.onChange && opts.onChange();
      });
    } else if (opts.type === 'textarea') {
      input = document.createElement('textarea');
      input.value = obj[key] || '';
      input.addEventListener('input', () => {
        obj[key] = input.value;
        opts.onChange && opts.onChange();
      });
    } else if (opts.type === 'checkbox') {
      const row = el('label', { className: 'checkbox-inline' });
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!obj[key];
      input.addEventListener('change', () => {
        obj[key] = input.checked;
        opts.onChange && opts.onChange();
      });
      row.appendChild(input);
      row.appendChild(document.createTextNode(opts.label));
      return row;
    } else {
      input = document.createElement('input');
      input.type = opts.type || 'text';
      input.value = obj[key] ?? '';
      input.addEventListener('input', () => {
        obj[key] = input.value;
        opts.onChange && opts.onChange();
      });
    }
    wrap.appendChild(input);
    return wrap;
  }

  function buildRadioGroup(obj, key, options, onChange) {
    const wrap = el('div', { className: 'radio-group' });
    const groupName = `rg-${key}-${Math.random().toString(36).slice(2, 8)}`;
    options.forEach((o) => {
      const label = el('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = groupName;
      input.value = o.value;
      input.checked = obj[key] === o.value;
      input.addEventListener('change', () => {
        obj[key] = o.value;
        onChange && onChange();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + o.label));
      wrap.appendChild(label);
    });
    return wrap;
  }

  /**
   * @param {Object} cfg
   * @param {string} cfg.title
   * @param {()=>Array} cfg.getItems
   * @param {Array<{key:string,label:string,type?:string,options?:Array}>} cfg.fields
   * @param {string} [cfg.addLabel]
   * @param {()=>void} cfg.onChange
   */
  function buildRepeatableSection(cfg) {
    const wrap = el('div', { className: 'repeatable-section' });
    wrap.appendChild(el('h2', { text: cfg.title }));
    const listEl = el('div');
    wrap.appendChild(listEl);

    function renderList() {
      listEl.innerHTML = '';
      const items = cfg.getItems();
      items.forEach((item, idx) => {
        const card = el('div', { className: 'repeat-card' });
        const head = el('div', { className: 'repeat-card-head' }, [el('span', { text: `Entry ${idx + 1}` })]);
        const removeBtn = el('button', { className: 'btn danger small', text: 'Remove' });
        removeBtn.type = 'button';
        removeBtn.addEventListener('click', () => {
          items.splice(idx, 1);
          renderList();
          cfg.onChange();
        });
        head.appendChild(removeBtn);
        card.appendChild(head);

        cfg.fields.forEach((f) => {
          card.appendChild(
            buildField(item, f.key, {
              label: f.label,
              type: f.type,
              options: f.options,
              onChange: cfg.onChange,
            })
          );
        });
        listEl.appendChild(card);
      });
    }
    renderList();

    const addBtn = el('button', { className: 'btn small', text: cfg.addLabel || '+ Add row' });
    addBtn.type = 'button';
    addBtn.addEventListener('click', () => {
      const items = cfg.getItems();
      const blank = {};
      cfg.fields.forEach((f) => (blank[f.key] = ''));
      items.push(blank);
      renderList();
      cfg.onChange();
    });
    wrap.appendChild(addBtn);
    return wrap;
  }

  global.Editor = { buildField, buildRadioGroup, buildRepeatableSection };
})(window);
