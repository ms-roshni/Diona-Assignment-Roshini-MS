/**
 * Tiny DOM-building helpers shared by both document generators.
 * Keeping these generic means the same helpers can render either PDF's
 * layout purely by being handed different data.
 */
(function (global) {
  function el(tag, opts = {}, children = []) {
    const node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text !== undefined) node.textContent = opts.text;
    if (opts.html !== undefined) node.innerHTML = opts.html;
    if (opts.attrs) {
      Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
    }
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  /** A bordered data table. `columns` = [{key, label}], `rows` = [{...}]. */
  function dataTable(columns, rows, opts = {}) {
    const table = el('table', { className: 'doc-table' });
    const thead = el('thead');
    const headRow = el('tr');
    columns.forEach((col) => headRow.appendChild(el('th', { text: col.label })));
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = el('tbody');
    if (rows.length === 0) {
      const tr = el('tr');
      const td = el('td', {
        className: 'empty-row',
        text: opts.emptyText || 'No entries submitted.',
        attrs: { colspan: String(columns.length) },
      });
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      rows.forEach((row) => {
        const tr = el('tr');
        columns.forEach((col) => {
          const raw = col.format ? col.format(row[col.key], row) : row[col.key];
          const td = el('td', { className: 'data-value' });
          td.textContent = raw === undefined || raw === null || raw === '' ? '\u2014' : raw;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    table.appendChild(tbody);
    return table;
  }

  /** A titled block wrapping arbitrary children — the atomic "page block" unit. */
  function section(titleText, children, opts = {}) {
    const wrap = el('div', { className: 'doc-section' + (opts.className ? ' ' + opts.className : '') });
    if (titleText) wrap.appendChild(el('h2', { className: 'section-title', text: titleText }));
    (Array.isArray(children) ? children : [children]).forEach((c) => c && wrap.appendChild(c));
    return wrap;
  }

  /** Renders a ☑ / ☐ style checkbox with a label, used throughout both forms. */
  function checkOption(checked, labelText) {
    const row = el('label', { className: 'check-option' });
    row.appendChild(el('span', { className: 'check-box' + (checked ? ' checked' : ''), text: checked ? '\u2611' : '\u2610' }));
    row.appendChild(el('span', { className: 'check-label', text: labelText }));
    return row;
  }

  /**
   * A descriptor (not a DOM node) for a titled table that the pagination
   * engine is allowed to split across pages at row boundaries, repeating
   * its column headers instead of shrinking or being pushed whole onto the
   * next page. `intro` is optional explanatory HTMLElement(s) shown once,
   * above the table, only on the first page it appears on.
   */
  function tableBlock({ title, intro, columns, rows, emptyText }) {
    return { __tableBlock: true, title: title || null, intro: intro || null, columns, rows: rows || [], emptyText };
  }

  /**
   * One self-contained "value + underline + label" unit. The label always
   * stays directly under its own value/underline no matter what neighboring
   * fields contain, because it lives in the same flex column as the value —
   * see `.field-unit` / `.field-sentence` in common.css.
   */
  function fieldUnit(value, labelText) {
    const wrap = el('div', { className: 'field-unit' });
    wrap.appendChild(el('div', { className: 'field-value data-value', text: value || '\u00A0' }));
    wrap.appendChild(el('div', { className: 'field-line' }));
    wrap.appendChild(el('div', { className: 'field-label', text: labelText || '\u00A0' }));
    return wrap;
  }

  /**
   * A plain sentence fragment placed inside a `fieldSentence`. It reserves
   * the same invisible underline/label rows as a real `fieldUnit` so its
   * text baseline lines up with adjacent fields regardless of their label
   * length.
   */
  function staticText(text) {
    const wrap = el('div', { className: 'field-unit field-static' });
    wrap.appendChild(el('div', { className: 'field-value', text }));
    wrap.appendChild(el('div', { className: 'field-line' }));
    wrap.appendChild(el('div', { className: 'field-label', text: '\u00A0' }));
    return wrap;
  }

  /** A flex row of `fieldUnit`/`staticText` pieces that reads as one sentence. */
  function fieldSentence(children) {
    return el('p', { className: 'field-sentence' }, children);
  }

  function moneyFmt(n) {
    if (n === undefined || n === null || n === '') return '';
    const num = Number(n);
    if (Number.isNaN(num)) return String(n);
    return `$${num.toFixed(2)}`;
  }

  function dateFmt(isoOrText) {
    if (!isoOrText) return '';
    const d = new Date(isoOrText);
    if (Number.isNaN(d.getTime())) return isoOrText;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  global.Dom = { el, dataTable, section, checkOption, tableBlock, fieldUnit, staticText, fieldSentence, moneyFmt, dateFmt };
})(window);
