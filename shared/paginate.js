/**
 * Generic "paper page" pagination engine.
 *
 * Given a header element (rendered only on page 1), a flat list of content
 * blocks, and a footer factory, this measures the *real* rendered height of
 * every block inside an offscreen page-sized sandbox and greedily
 * distributes blocks across as many pages as are needed. Because the
 * measurement happens against the current data, adding/removing rows (or
 * switching datasets, or typing a longer answer) automatically changes how
 * many pages are produced, and every footer's "Page X of Y" is recalculated
 * to match. The reserved footer height is subtracted from every page's
 * content budget so body content can never collide with the footer.
 *
 * Two kinds of blocks are supported:
 *  - a plain HTMLElement: an atomic, non-splittable chunk of content.
 *  - a "table block" descriptor (see Dom.tableBlock in dom.js): a titled
 *    table that is allowed to split across pages at row boundaries,
 *    repeating its column headers (and a "(continued)" heading) on any
 *    page it spills onto, instead of shrinking or being pushed whole onto
 *    the next page and leaving a large blank gap behind it.
 */
(function (global) {
  const PAGE_WIDTH_PX = 816; // 8.5in @ 96dpi
  const PAGE_HEIGHT_PX = 1056; // 11in @ 96dpi
  const PAGE_PADDING_PX = 48; // ~0.5in

  function createPageShell() {
    const page = document.createElement('section');
    page.className = 'paper-page';
    const content = document.createElement('div');
    content.className = 'page-content';
    const footer = document.createElement('footer');
    footer.className = 'page-footer';
    page.appendChild(content);
    page.appendChild(footer);
    return { page, content, footer };
  }

  // getBoundingClientRect() never includes an element's own margin, but
  // every block/heading/free-text-box in these documents only ever sets a
  // bottom margin (never top), so "rect height + computed margin-bottom"
  // is an exact measure of the vertical space a block occupies in the flow.
  function heightWithMargin(elm) {
    const rect = elm.getBoundingClientRect();
    const marginBottom = parseFloat(getComputedStyle(elm).marginBottom) || 0;
    return rect.height + marginBottom;
  }

  function buildTableChunk({ title, intro, columns, rows, continued, emptyText }) {
    const wrap = document.createElement('div');
    wrap.className = 'doc-section table-chunk';
    if (title) {
      const h = document.createElement('h2');
      h.className = 'section-title';
      h.textContent = continued ? `${title} (continued)` : title;
      wrap.appendChild(h);
    }
    if (intro && !continued) {
      (Array.isArray(intro) ? intro : [intro]).forEach((n) => n && wrap.appendChild(n));
    }
    wrap.appendChild(global.Dom.dataTable(columns, rows, { emptyText }));
    return wrap;
  }

  /** Measures a table block's heading/intro/thead/per-row heights once. */
  function measureTableBlock(block, sandboxContent) {
    const wrap = buildTableChunk({
      title: block.title,
      intro: block.intro,
      columns: block.columns,
      rows: block.rows,
      continued: false,
      emptyText: block.emptyText,
    });
    sandboxContent.appendChild(wrap);

    const totalHeight = heightWithMargin(wrap);
    const headingEl = wrap.querySelector(':scope > h2.section-title');
    const headingHeight = headingEl ? heightWithMargin(headingEl) : 0;
    const table = wrap.querySelector(':scope > table.doc-table');
    const theadHeight = table.querySelector('thead').getBoundingClientRect().height;
    const rowHeights = Array.from(table.querySelectorAll('tbody tr')).map((tr) => tr.getBoundingClientRect().height);
    const tableHeight = table.getBoundingClientRect().height;
    const chunkMarginBottom = parseFloat(getComputedStyle(wrap).marginBottom) || 0;
    // Derived by subtraction so any number of intro paragraphs "just work".
    const introHeight = Math.max(0, totalHeight - chunkMarginBottom - headingHeight - tableHeight);

    sandboxContent.removeChild(wrap);

    let continuedHeadingHeight = headingHeight;
    if (block.title) {
      const contH = document.createElement('h2');
      contH.className = 'section-title';
      contH.textContent = `${block.title} (continued)`;
      sandboxContent.appendChild(contH);
      continuedHeadingHeight = heightWithMargin(contH);
      sandboxContent.removeChild(contH);
    }

    return { headingHeight, introHeight, theadHeight, rowHeights, continuedHeadingHeight, chunkMarginBottom };
  }

  /**
   * @param {Object} opts
   * @param {HTMLElement} opts.container - where finished pages get appended
   * @param {HTMLElement|null} opts.headerEl - repeated only on page 1
   * @param {Array<HTMLElement|Object>} opts.blocks - content blocks, in order
   * @param {(pageNum:number, totalPages:number)=>HTMLElement} opts.renderFooter
   */
  function renderPaginated({ container, headerEl, blocks, renderFooter }) {
    container.innerHTML = '';

    // Offscreen sandbox used purely to measure real rendered heights, at the
    // exact same width as a real page so text/table wrapping matches.
    const sandbox = document.createElement('div');
    sandbox.className = 'paper-page paginate-sandbox';
    sandbox.style.height = 'auto';
    sandbox.style.overflow = 'visible';
    const sandboxContent = document.createElement('div');
    sandboxContent.className = 'page-content';
    sandboxContent.style.overflow = 'visible';
    sandbox.appendChild(sandboxContent);
    sandbox.style.position = 'absolute';
    sandbox.style.visibility = 'hidden';
    sandbox.style.pointerEvents = 'none';
    sandbox.style.left = '-99999px';
    sandbox.style.top = '0';
    document.body.appendChild(sandbox);

    let headerHeight = 0;
    if (headerEl) {
      sandboxContent.appendChild(headerEl);
      headerHeight = heightWithMargin(headerEl);
      sandboxContent.removeChild(headerEl);
    }

    // Reserve real footer height so body content can never collide with it.
    const sandboxFooter = document.createElement('footer');
    sandboxFooter.className = 'page-footer';
    sandbox.appendChild(sandboxFooter);
    sandboxFooter.appendChild(renderFooter(1, 1));
    const footerHeight = sandboxFooter.getBoundingClientRect().height;
    sandbox.removeChild(sandboxFooter);

    const availableHeight = PAGE_HEIGHT_PX - PAGE_PADDING_PX * 2 - footerHeight;

    const state = {
      pages: [[]],
      currentHeight: headerHeight,
      availableHeight,
      newPage() {
        this.pages.push([]);
        this.currentHeight = 0;
      },
    };

    function placeAtomic(block) {
      sandboxContent.appendChild(block);
      const h = heightWithMargin(block);
      sandboxContent.removeChild(block);

      const currentPage = state.pages[state.pages.length - 1];
      if (state.currentHeight + h > state.availableHeight && currentPage.length > 0) {
        state.newPage();
      }
      state.pages[state.pages.length - 1].push(block);
      state.currentHeight += h;
    }

    function placeTableBlock(block) {
      const m = measureTableBlock(block, sandboxContent);
      const rows = block.rows;
      let rowIdx = 0;
      let isFirst = true;

      while (rowIdx < rows.length) {
        const headOverhead = (isFirst ? m.headingHeight + m.introHeight : m.continuedHeadingHeight) + m.theadHeight + m.chunkMarginBottom;
        let remaining = state.availableHeight - state.currentHeight;
        const currentPageBlocks = state.pages[state.pages.length - 1];
        if (currentPageBlocks.length > 0 && headOverhead + m.rowHeights[rowIdx] > remaining) {
          state.newPage();
          remaining = state.availableHeight;
        }

        let count = 0;
        let used = headOverhead;
        for (let i = rowIdx; i < rows.length; i++) {
          const rh = m.rowHeights[i];
          if (count > 0 && used + rh > remaining) break;
          used += rh;
          count++;
        }

        const chunkRows = rows.slice(rowIdx, rowIdx + count);
        const chunkEl = buildTableChunk({
          title: block.title,
          intro: isFirst ? block.intro : null,
          columns: block.columns,
          rows: chunkRows,
          continued: !isFirst,
          emptyText: block.emptyText,
        });
        state.pages[state.pages.length - 1].push(chunkEl);
        state.currentHeight += used;
        rowIdx += count;
        isFirst = false;
        if (rowIdx < rows.length) state.newPage();
      }
    }

    blocks.forEach((block) => {
      if (block && block.__tableBlock) {
        placeTableBlock(block);
      } else if (block) {
        placeAtomic(block);
      }
    });

    document.body.removeChild(sandbox);

    const totalPages = state.pages.length;
    state.pages.forEach((pageBlocks, idx) => {
      const { page, content, footer } = createPageShell();
      if (idx === 0 && headerEl) {
        content.appendChild(headerEl);
      }
      pageBlocks.forEach((b) => content.appendChild(b));
      footer.appendChild(renderFooter(idx + 1, totalPages));
      container.appendChild(page);
    });

    return totalPages;
  }

  global.Paginate = {
    render: renderPaginated,
    PAGE_WIDTH_PX,
    PAGE_HEIGHT_PX,
    PAGE_PADDING_PX,
  };
})(window);
