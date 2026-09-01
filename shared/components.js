/**
 * Shared masthead (logo + org address + form title/claim box) and footer,
 * reused by both forms since both PDFs come from the same issuing board.
 * The logo is the exact WCB Manitoba artwork supplied for this assignment
 * (shared/assets/wcb-logo.png), used as-is at its native proportions.
 */
(function (global) {
  const { el } = global.Dom;

  function buildLogo() {
    const img = document.createElement('img');
    img.src = '../shared/assets/wcb-logo.png';
    img.alt = 'WCB Manitoba';
    img.className = 'brand-logo-img';
    return img;
  }

  /**
   * @param {Object} opts
   * @param {string} opts.orgName
   * @param {string[]} opts.addressLines
   * @param {string} opts.formTitle
   * @param {string} opts.claimNo
   * @param {string} [opts.formCode] - short badge e.g. "WP"
   */
  function buildMasthead(opts) {
    const left = el('div', { className: 'brand' }, [buildLogo()]);

    const middle = el(
      'div',
      { className: 'org-address' },
      opts.addressLines.map((line) => el('div', { text: line }))
    );

    const right = el('div', { className: 'doc-title-block' }, [
      el('h1', { className: 'doc-title', text: opts.formTitle }),
      el('div', { className: 'claim-boxes' }, [
        el('div', { className: 'claim-no-box', text: `Claim No. ${opts.claimNo}` }),
        opts.formCode ? el('div', { className: 'form-code-box', text: opts.formCode }) : null,
      ]),
    ]);

    return el('div', { className: 'doc-masthead' }, [left, middle, right]);
  }

  function buildFooter({ workerAppId, submitted }, pageNum, totalPages) {
    return el('div', { className: 'footer-inner' }, [
      el('div', { className: 'footer-left', text: workerAppId ? `Worker App ID: ${workerAppId}` : '' }),
      el('div', { className: 'footer-right' }, [
        el('div', { text: submitted ? `Submitted: ${submitted}` : '' }),
        el('div', { text: `Page ${pageNum} of ${totalPages}` }),
      ]),
    ]);
  }

  global.Components = { buildMasthead, buildFooter };
})(window);
