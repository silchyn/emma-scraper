import { Attachment, Bid, File } from '@/typedefs';
import { Browser, chromium, Locator, Page } from 'playwright';

export class Scraper {
  private browser?: Browser;
  private page?: Page;

  async init() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
  }

  async close() {
    await this.browser?.close();
  }

  private async parseFiles(cellLocator: Locator): Promise<File[]> {
    const fileLocator = cellLocator
      .locator('div > div > div > div > ul > li > div');
    const filesCount = await fileLocator.count();
    const fileLocators = filesCount === 1
      ? [fileLocator]
      : await fileLocator.all();

    return Promise.all(fileLocators.map(async (fileLocator) => {
      const [name, link] = await Promise.all([
        fileLocator.locator('a > span').textContent(),
        fileLocator.locator('a').getAttribute('href'),
      ]);

      return ({
        name: name?.trim() || '',
        link: `https://emma.maryland.gov${link}`,
      });
    }));
  };

  private async parseAttachments(): Promise<Attachment[]> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const rowLocator = this.page
      .locator('table[id="body_x_tabc_rfp_ext_prxrfp_ext_x_prxDoc_x_grid_grd"] > tbody > tr');
    const rowsCount = await rowLocator.count();

    if (!rowsCount) {
      return [];
    }

    const rowLocators = rowsCount === 1
      ? [rowLocator]
      : await rowLocator.all();

    return Promise.all(rowLocators.map(async (rowLocator) => {
      const cells = await rowLocator.locator('td').all();
      const [
        title,
        type,
        modificationDate,
        creationDate,
        validityEndDate,
        files,
      ] = await Promise.all([
        cells[0].textContent(),
        cells[1].textContent(),
        cells[3].textContent(),
        cells[4].textContent(),
        cells[5].textContent(),
        this.parseFiles(cells[2]),
      ]);

      return ({
        title: title?.trim() || '',
        type: type?.trim() || '',
        modificationDate: modificationDate?.trim() || '',
        creationDate: creationDate?.trim() || '',
        validityEndDate: validityEndDate?.trim() || '',
        files,
      });
    }));
  };

  private async parseBidData(bidId: string): Promise<Bid> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const titleLocator = this.page
      .locator('span[id="body_x_tabc_rfp_ext_prxrfp_ext_x_lblLabel"]');
    const dueDateLocator = this.page
      .locator('input[id="body_x_tabc_rfp_ext_prxrfp_ext_x_txtRfpEndDateEst"]');
    const summaryLocator = this.page
      .locator('div[id="body_x_tabc_rfp_ext_prxrfp_ext_x_lblSummary"]');
    const categoryLocator = this.page
      .locator('input[id="body_x_tabc_rfp_ext_prxrfp_ext_x_txtFamLabel"]');
    const typeLocator = this.page
      .locator('input[id="body_x_tabc_rfp_ext_prxrfp_ext_x_selRfptypeCode_search"] + div');
    const [
      titlesCount,
      dueDatesCount,
      summariesCount,
      categoriesCount,
      typesCount,
    ] = await Promise.all([
      titleLocator.count(),
      dueDateLocator.count(),
      summaryLocator.count(),
      categoryLocator.count(),
      typeLocator.count(),
    ]);

    const [
      title,
      dueDate,
      summary,
      category,
      type,
      attachments,
    ] = await Promise.all([
      titlesCount
        ? titleLocator.textContent()
        : '',
      dueDatesCount
        ? dueDateLocator.inputValue()
        : '',
      summariesCount
        ? summaryLocator.innerText()
        : '',
      categoriesCount
        ? categoryLocator.inputValue()
        : '',
      typesCount
        ? typeLocator.textContent()
        : '',
      this.parseAttachments(),
    ]);

    return {
      id: bidId,
      title: title?.trim() || '',
      dueDate: dueDate.trim(),
      summary: summary?.trim() || '',
      category: category.trim(),
      type: type?.trim() || '',
      attachments,
    };
  };

  private async parseBidPath(bidId: string): Promise<string | null> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const rowLocator = this.page
      .locator('table[id="body_x_grid_grd"] > tbody > tr');
    const rowsCount = await rowLocator.count();

    if (!rowsCount) {
      return null;
    }

    const rowLocators = rowsCount === 1
      ? [rowLocator]
      : await rowLocator.all();
    let matchingRowLocator: Locator | undefined;

    for (const rowLocator of rowLocators) {
      const cellLocators = await rowLocator.locator('td').all();
      const rowId = await cellLocators[1].textContent();

      if (rowId?.trim() === bidId) {
        matchingRowLocator = rowLocator;

        break;
      }
    }

    if (!matchingRowLocator) {
      return null;
    }

    const linkLocator = matchingRowLocator.locator('td > a');
    const linksCount = await linkLocator.count();

    if (!linksCount) {
      return null;
    }

    const linkLocators = linksCount === 1
      ? [linkLocator]
      : await linkLocator.all();

    return linkLocators[0].getAttribute('href');
  };

  private async filterBidsById(id: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    await this.page
      .locator('input[id="body_x_txtBpmCodeCalculated_3"]').fill(id);
    await this.page
      .locator('button[id="body_x_prxFilterBar_x_cmdSearchBtn"]').click();
    await this.page.waitForLoadState('networkidle');
  };

  async parseBid(bidId: string): Promise<Bid | null> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    await this.page
      .goto('https://emma.maryland.gov/page.aspx/en/rfp/request_browse_public');
    await this.filterBidsById(bidId);

    const bidPath = await this.parseBidPath(bidId);

    if (!bidPath) {
      return null;
    }

    await this.page.goto(`https://emma.maryland.gov${bidPath}`);

    return this.parseBidData(bidId);
  }
}
