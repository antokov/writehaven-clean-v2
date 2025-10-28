// e2e/world.spec.js
import { test, expect } from '@playwright/test';

// Test-Credentials
const TEST_USER = {
  email: 'test@test.ch',
  password: 'test123',
};

test.describe('World Section (Welten)', () => {
  let projectId;

  // Helper: Login
  async function login(page) {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/app');
  }

  // Helper: Projekt erstellen und zu World navigieren
  async function setupProject(page) {
    // Öffne "Neues Projekt" Modal
    await page.getByTestId('new-project-button').click();
    await expect(page.locator('.modal-dialog')).toBeVisible();

    // Erstelle Projekt
    await page.getByTestId('project-title-input').fill('World Test Project');
    await page.getByTestId('create-project-submit').click();
    await expect(page.locator('.modal-dialog')).not.toBeVisible();
    await page.waitForTimeout(500);

    // Hole Projekt-ID
    const projectCards = await page.locator('[data-testid^="project-card-"]').all();
    const firstCard = projectCards[0];
    const testId = await firstCard.getAttribute('data-testid');
    const pid = testId.replace('project-card-', '');

    // Navigiere zu World
    await page.goto(`/app/project/${pid}/world`);
    await page.waitForTimeout(500);

    return pid;
  }

  // Helper: Projekt löschen
  async function deleteProject(page, pid) {
    if (!pid) return;
    await page.goto('/app');
    await page.waitForTimeout(300);

    // Prüfe ob das Projekt existiert
    const projectCard = page.getByTestId(`project-card-${pid}`);

    if (await projectCard.count() > 0) {
      // Öffne das Kontextmenü des Projekts
      await page.getByTestId(`project-menu-${pid}`).click();
      await page.waitForTimeout(200);

      // Klicke auf Delete Button im Dropdown
      await page.getByTestId(`project-delete-${pid}`).click();

      // Bestätige im Modal
      await page.locator('.modal-dialog button:has-text("Delete"), .modal-dialog button:has-text("Löschen")').click();

      // Warte bis Modal geschlossen
      await expect(page.locator('.modal-dialog')).not.toBeVisible();
    }
  }

  // Vor jedem Test: Login und Projekt mit World-Page
  test.beforeEach(async ({ page }) => {
    await login(page);
    projectId = await setupProject(page);
    expect(projectId).toBeTruthy();
  });

  // Nach jedem Test: Projekt löschen
  test.afterEach(async ({ page }) => {
    await deleteProject(page, projectId);
  });

  test('should create a new world element', async ({ page }) => {
    // Klicke auf "+ World Element" Button
    await page.getByTestId('add-world-button').click();

    // Warte bis erstes World-Element erscheint
    await page.waitForTimeout(500);
    const firstWorld = page.locator('li[data-testid^="world-"]').first();
    await expect(firstWorld).toBeVisible();

    // Prüfe dass Default-Name angezeigt wird
    await expect(firstWorld).toContainText(/New Element|Neues Element/i);
  });

  test('should edit world element basic fields', async ({ page }) => {
    // Erstelle World-Element
    await page.getByTestId('add-world-button').click();
    const firstWorld = page.locator('li[data-testid^="world-"]').first();
    await expect(firstWorld).toBeVisible();

    // Fülle Title aus
    const titleInput = page.getByTestId('world-field-title');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('Rivendell');

    // Fülle Summary aus
    const summaryInput = page.getByTestId('world-field-summary');
    await summaryInput.fill('The Last Homely House, home of Elrond');

    // Warte auf Autosave
    await page.waitForTimeout(1500);

    // Prüfe dass Title in Sidebar aktualisiert wurde
    await expect(firstWorld).toContainText('Rivendell');

    // Reload und prüfe Persistenz
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.locator('li[data-testid^="world-"]').first()).toContainText('Rivendell');
    await expect(page.getByTestId('world-field-title')).toHaveValue('Rivendell');
    await expect(page.getByTestId('world-field-summary')).toHaveValue('The Last Homely House, home of Elrond');
  });

  test('should create multiple world elements', async ({ page }) => {
    // Erstelle erstes Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').first()).toBeVisible();
    await page.getByTestId('world-field-title').fill('Location One');
    await page.waitForTimeout(1000);

    // Erstelle zweites Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').nth(1)).toBeVisible();
    await page.getByTestId('world-field-title').fill('Location Two');
    await page.waitForTimeout(1000);

    // Erstelle drittes Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').nth(2)).toBeVisible();
    await page.getByTestId('world-field-title').fill('Location Three');
    await page.waitForTimeout(1000);

    // Prüfe dass alle drei Elemente in der Sidebar sind
    await expect(page.locator('li[data-testid^="world-"]')).toHaveCount(3);
    await expect(page.locator('text=Location One')).toBeVisible();
    await expect(page.locator('text=Location Two')).toBeVisible();
    await expect(page.locator('text=Location Three')).toBeVisible();
  });

  test('should switch between world elements and preserve data', async ({ page }) => {
    // Erstelle erstes Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').first()).toBeVisible();

    // Warte bis Input-Felder bereit sind
    await expect(page.getByTestId('world-field-title')).toBeVisible();

    await page.getByTestId('world-field-title').fill('Castle Blackwood');
    await page.getByTestId('world-field-summary').fill('A dark fortress in the north');
    await page.waitForTimeout(1500); // Warte auf Autosave (700ms debounce + extra Zeit)

    // Hole ID des ersten Elements
    const world1 = page.locator('li[data-testid^="world-"]').first();
    const world1TestId = await world1.getAttribute('data-testid');

    // Erstelle zweites Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    const world2 = page.locator('li[data-testid^="world-"]').nth(1);
    await expect(world2).toBeVisible();

    // Warte bis Input-Felder für zweites Element geladen sind
    await expect(page.getByTestId('world-field-title')).not.toHaveValue('Castle Blackwood');

    await page.getByTestId('world-field-title').fill('Emerald Forest');
    await page.getByTestId('world-field-summary').fill('A magical woodland');
    await page.waitForTimeout(1500); // Warte auf Autosave

    // Wechsle zurück zu erstem Element
    await page.locator(`li[data-testid="${world1TestId}"]`).click();
    await page.waitForTimeout(300);

    // Warte bis die Daten von Element One geladen sind
    await expect(page.getByTestId('world-field-title')).toHaveValue('Castle Blackwood', { timeout: 10000 });
    await expect(page.getByTestId('world-field-summary')).toHaveValue('A dark fortress in the north');

    // Wechsle zu zweitem Element
    await world2.click();
    await page.waitForTimeout(300);

    // Warte bis die Daten von Element Two geladen sind
    await expect(page.getByTestId('world-field-title')).toHaveValue('Emerald Forest', { timeout: 10000 });
    await expect(page.getByTestId('world-field-summary')).toHaveValue('A magical woodland');
  });

  test('should delete a world element', async ({ page }) => {
    // Erstelle World-Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    const firstWorld = page.locator('li[data-testid^="world-"]').first();
    await expect(firstWorld).toBeVisible();

    // Hole World-ID
    const worldTestId = await firstWorld.getAttribute('data-testid');
    const worldId = worldTestId.replace('world-', '');

    // Klicke auf Delete-Button
    await page.getByTestId(`delete-world-${worldId}`).click();

    // Bestätige Deletion im Modal
    await page.locator('.modal-dialog button:has-text("Delete"), .modal-dialog button:has-text("Löschen")').click();

    // Warte kurz
    await page.waitForTimeout(500);

    // Prüfe dass Element entfernt wurde
    await expect(firstWorld).not.toBeVisible();
  });

  test('should create world element with long summary', async ({ page }) => {
    // Erstelle World-Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').first()).toBeVisible();

    const longSummary = `The Kingdom of Valoria is an ancient land steeped in magic and mystery.
Founded over a thousand years ago, it has witnessed the rise and fall of countless dynasties.
The kingdom is protected by powerful enchantments and guarded by elite warriors known as the Silver Shields.
Its capital city, Argentum, is renowned for its magnificent architecture and vibrant markets where traders
from across the realm gather to exchange goods and stories.`;

    await page.getByTestId('world-field-title').fill('Kingdom of Valoria');
    await page.getByTestId('world-field-summary').fill(longSummary);

    // Warte auf Autosave
    await page.waitForTimeout(1500);

    // Reload und prüfe
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByTestId('world-field-title')).toHaveValue('Kingdom of Valoria');
    await expect(page.getByTestId('world-field-summary')).toHaveValue(longSummary);
  });

  test('should handle empty summary field', async ({ page }) => {
    // Erstelle World-Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').first()).toBeVisible();

    // Nur Title ausfüllen, Summary leer lassen
    await page.getByTestId('world-field-title').fill('Mystery Location');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByTestId('world-field-title')).toHaveValue('Mystery Location');
    await expect(page.getByTestId('world-field-summary')).toHaveValue('');
  });

  test('should switch to relationships tab', async ({ page }) => {
    // Erstelle World-Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').first()).toBeVisible();

    // Fülle ein paar Basisdaten aus
    await page.getByTestId('world-field-title').fill('Test Location');
    await page.waitForTimeout(500);

    // Wechsle zum Relationships Tab
    await page.getByTestId('world-tab-relations').click();
    await page.waitForTimeout(500);

    // Prüfe dass Relations-UI sichtbar ist (suche nach einer select für target)
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('should persist changes after reload', async ({ page }) => {
    // Erstelle World-Element
    await page.getByTestId('add-world-button').click();
    await page.waitForTimeout(500);
    await expect(page.locator('li[data-testid^="world-"]').first()).toBeVisible();

    // Fülle alle Felder aus
    await page.getByTestId('world-field-title').fill('Dragon Mountain');
    await page.getByTestId('world-field-summary').fill('A treacherous mountain range inhabited by ancient dragons');

    // Warte auf Autosave
    await page.waitForTimeout(1500);

    // Reload und prüfe alle Felder
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByTestId('world-field-title')).toHaveValue('Dragon Mountain');
    await expect(page.getByTestId('world-field-summary')).toHaveValue('A treacherous mountain range inhabited by ancient dragons');
  });

  test('should show empty state when no elements exist', async ({ page }) => {
    // Prüfe dass Empty State angezeigt wird
    await expect(page.locator('.tree-empty')).toBeVisible();
    await expect(page.locator('.tree-empty')).toContainText(/Empty|Leer|No elements|Keine Elemente/i);
  });

  test('should show "none selected" message before creating element', async ({ page }) => {
    // Prüfe dass "None Selected" Nachricht angezeigt wird
    await expect(page.locator('.panel')).toContainText(/None selected|Nichts ausgewählt|Select|Wähle/i);
  });
});
