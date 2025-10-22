// e2e/characters.spec.js
import { test, expect } from '@playwright/test';

// Test-Credentials
const TEST_USER = {
  email: 'test@test.ch',
  password: 'test123',
};

test.describe('Characters Section (Charaktere)', () => {
  let projectId;

  // Helper: Login
  async function login(page) {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/app');
  }

  // Helper: Projekt erstellen und zu Characters navigieren
  async function setupProject(page) {
    // Öffne "Neues Projekt" Modal
    await page.getByTestId('new-project-button').click();
    await expect(page.locator('.modal-dialog')).toBeVisible();

    // Erstelle Projekt
    await page.getByTestId('project-title-input').fill('Characters Test Project');
    await page.getByTestId('create-project-submit').click();
    await expect(page.locator('.modal-dialog')).not.toBeVisible();
    await page.waitForTimeout(500);

    // Hole Projekt-ID
    const projectCards = await page.locator('[data-testid^="project-card-"]').all();
    const firstCard = projectCards[0];
    const testId = await firstCard.getAttribute('data-testid');
    const pid = testId.replace('project-card-', '');

    // Navigiere zu Characters
    await page.goto(`/app/project/${pid}/characters`);
    await page.waitForTimeout(500);

    return pid;
  }

  // Helper: Projekt löschen
  async function deleteProject(page, pid) {
    if (!pid) return;
    await page.goto('/app');
    await page.waitForTimeout(300);

    const deleteButton = page.getByTestId(`project-delete-${pid}`);
    if (await deleteButton.count() > 0) {
      await deleteButton.click();
      await page.locator('.modal-dialog button:has-text("Delete"), .modal-dialog button:has-text("Löschen")').click();
      await expect(page.locator('.modal-dialog')).not.toBeVisible();
    }
  }

  // Vor jedem Test: Login und Projekt mit Characters-Page
  test.beforeEach(async ({ page }) => {
    await login(page);
    projectId = await setupProject(page);
    expect(projectId).toBeTruthy();
  });

  // Nach jedem Test: Projekt löschen
  test.afterEach(async ({ page }) => {
    await deleteProject(page, projectId);
  });

  test('should create a new character', async ({ page }) => {
    // Klicke auf "+ Character" Button
    await page.getByTestId('add-character-button').click();

    // Warte bis erstes Character erscheint
    const firstChar = page.locator('[data-testid^="character-"]').first();
    await expect(firstChar).toBeVisible();

    // Prüfe dass Default-Name angezeigt wird
    await expect(firstChar).toContainText(/New Character|Neuer Charakter/i);
  });

  test('should edit character basic fields', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    const firstChar = page.locator('[data-testid^="character-"]').first();
    await expect(firstChar).toBeVisible();

    // Warte bis Tab sichtbar ist
    await expect(page.getByTestId('character-tab-basic')).toBeVisible();

    // Fülle First Name aus (Core Field - immer sichtbar)
    const firstNameInput = page.getByTestId('character-field-first_name');
    await expect(firstNameInput).toBeVisible();
    await firstNameInput.fill('John');

    // Fülle Last Name aus (Core Field - immer sichtbar)
    const lastNameInput = page.getByTestId('character-field-last_name');
    await lastNameInput.fill('Doe');

    // Warte auf Autosave (700ms debounce + etwas extra für Name-Update)
    await page.waitForTimeout(1500);

    // Prüfe dass Name in Sidebar aktualisiert wurde
    await expect(firstChar).toContainText('John Doe');

    // Reload und prüfe Persistenz
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.locator('[data-testid^="character-"]').first()).toContainText('John Doe');
    await expect(page.getByTestId('character-field-first_name')).toHaveValue('John');
    await expect(page.getByTestId('character-field-last_name')).toHaveValue('Doe');
  });

  test('should switch between character tabs', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Klicke auf verschiedene Tabs
    await page.getByTestId('character-tab-appearance').click();
    await expect(page.getByTestId('character-field-hair_color')).toBeVisible();

    await page.getByTestId('character-tab-personality').click();
    await expect(page.getByTestId('character-field-traits')).toBeVisible();

    await page.getByTestId('character-tab-skills').click();
    await expect(page.getByTestId('character-skills-input')).toBeVisible();

    // Zurück zu Basic
    await page.getByTestId('character-tab-basic').click();
    await expect(page.getByTestId('character-field-first_name')).toBeVisible();
  });

  test('should add skills to a character', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Gehe zu Skills Tab
    await page.getByTestId('character-tab-skills').click();
    const skillsInput = page.getByTestId('character-skills-input');
    await expect(skillsInput).toBeVisible();

    // Füge Skills hinzu
    await skillsInput.fill('Swordfighting');
    await page.keyboard.press('Enter');

    await skillsInput.fill('Magic');
    await page.keyboard.press('Enter');

    await skillsInput.fill('Diplomacy');
    await page.keyboard.press('Enter');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Prüfe dass Skills als Tags angezeigt werden
    await expect(page.locator('text=Swordfighting')).toBeVisible();
    await expect(page.locator('text=Magic')).toBeVisible();
    await expect(page.locator('text=Diplomacy')).toBeVisible();

    // Reload und prüfe Persistenz
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.getByTestId('character-tab-skills').click();
    await expect(page.locator('text=Swordfighting')).toBeVisible();
    await expect(page.locator('text=Magic')).toBeVisible();
    await expect(page.locator('text=Diplomacy')).toBeVisible();
  });

  test('should create relationship between characters', async ({ page }) => {
    // Erstelle ersten Character
    await page.getByTestId('add-character-button').click();
    const char1 = page.locator('[data-testid^="character-"]').first();
    await expect(char1).toBeVisible();

    // Fülle Namen aus
    await page.getByTestId('character-field-first_name').fill('Alice');
    await page.waitForTimeout(1000); // Autosave

    // Erstelle zweiten Character
    await page.getByTestId('add-character-button').click();
    await page.waitForTimeout(500);
    const char2 = page.locator('[data-testid^="character-"]').nth(1);
    await expect(char2).toBeVisible();

    // Fülle Namen für zweiten Character aus
    await page.getByTestId('character-field-first_name').fill('Bob');
    await page.waitForTimeout(1000); // Autosave

    // Gehe zu Links/Relationships Tab
    await page.getByTestId('character-tab-links').click();
    await page.waitForTimeout(500);

    // Wähle Target Character (Alice)
    const targetSelect = page.getByTestId('relation-target-select');
    await expect(targetSelect).toBeVisible();

    // Warte bis Alice in der Select-Liste erscheint
    await page.waitForTimeout(500);

    // Finde die Option mit "Alice" im Text und wähle sie
    const aliceOption = targetSelect.locator('option').filter({ hasText: 'Alice' }).first();
    await aliceOption.waitFor({ state: 'attached' }); // Warte bis Option im DOM ist
    const aliceValue = await aliceOption.getAttribute('value');
    await targetSelect.selectOption(aliceValue);

    // Wähle Relationship Type
    const typeSelect = page.getByTestId('relation-type-select');
    await typeSelect.selectOption({ index: 1 }); // Erste echte Option (index 0 ist meist placeholder)

    // Optional: Füge Note hinzu
    await page.getByTestId('relation-note-input').fill('Best friends since childhood');

    // Klicke auf Add Button
    await page.getByTestId('relation-add-button').click();

    // Warte kurz
    await page.waitForTimeout(1000);

    // Prüfe dass Relation angezeigt wird (suche nach dem spezifischen li.panel mit der Relation)
    const relationItem = page.locator('li.panel').filter({ hasText: 'Best friends since childhood' });
    await expect(relationItem).toBeVisible();
    await expect(relationItem).toContainText('Alice');
  });

  test('should switch between characters and preserve data', async ({ page }) => {
    // Erstelle ersten Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Warte bis Input-Feld bereit ist
    await expect(page.getByTestId('character-field-first_name')).toBeVisible();

    // Fülle ersten Character aus
    await page.getByTestId('character-field-first_name').fill('Character One');
    await page.waitForTimeout(1500); // Warte auf Autosave (700ms debounce + extra Zeit)

    // Hole ID des ersten Characters
    const char1 = page.locator('[data-testid^="character-"]').first();
    const char1TestId = await char1.getAttribute('data-testid');

    // Erstelle zweiten Character
    await page.getByTestId('add-character-button').click();
    await page.waitForTimeout(500);

    const char2 = page.locator('[data-testid^="character-"]').nth(1);
    await expect(char2).toBeVisible();

    // Warte bis das Input-Feld für den zweiten Character geladen ist und leer ist
    await expect(page.getByTestId('character-field-first_name')).toHaveValue('');

    // Fülle zweiten Character aus
    await page.getByTestId('character-field-first_name').fill('Character Two');
    await page.waitForTimeout(1500); // Warte auf Autosave

    // Wechsle zurück zu Character One
    await page.locator(`[data-testid="${char1TestId}"]`).click();
    await page.waitForTimeout(300);

    // Warte bis die Daten von Character One geladen sind
    await expect(page.getByTestId('character-field-first_name')).toHaveValue('Character One', { timeout: 10000 });

    // Wechsle zu Character Two
    await char2.click();
    await page.waitForTimeout(300);

    // Warte bis die Daten von Character Two geladen sind
    await expect(page.getByTestId('character-field-first_name')).toHaveValue('Character Two', { timeout: 10000 });
  });

  test('should delete a character', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    const firstChar = page.locator('[data-testid^="character-"]').first();
    await expect(firstChar).toBeVisible();

    // Hole Character-ID
    const charTestId = await firstChar.getAttribute('data-testid');
    const charId = charTestId.replace('character-', '');

    // Klicke auf Delete-Button
    await page.getByTestId(`delete-character-${charId}`).click();

    // Bestätige Deletion im Modal
    await page.locator('.modal-dialog button:has-text("Delete"), .modal-dialog button:has-text("Löschen")').click();

    // Prüfe dass Character entfernt wurde
    await expect(firstChar).not.toBeVisible();
  });

  test('should fill appearance fields', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Gehe zu Appearance Tab
    await page.getByTestId('character-tab-appearance').click();

    // Fülle Appearance-Felder aus (nur Core Fields)
    await page.getByTestId('character-field-hair_color').fill('Blonde');
    await page.getByTestId('character-field-eye_color').fill('Blue');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe Persistenz
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.getByTestId('character-tab-appearance').click();
    await expect(page.getByTestId('character-field-hair_color')).toHaveValue('Blonde');
    await expect(page.getByTestId('character-field-eye_color')).toHaveValue('Blue');
  });

  test('should fill personality fields', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Gehe zu Personality Tab
    await page.getByTestId('character-tab-personality').click();

    // Fülle Personality-Felder aus
    const traitsField = page.getByTestId('character-field-traits');
    await expect(traitsField).toBeVisible();
    await traitsField.fill('Brave, honest, sometimes impulsive');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe Persistenz
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.getByTestId('character-tab-personality').click();
    await expect(page.getByTestId('character-field-traits')).toHaveValue('Brave, honest, sometimes impulsive');
  });

  // ==================== ADD ATTRIBUTES TESTS ====================

  test('should add optional field via "Add Attributes" in Basic tab', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Prüfe dass das optionale Feld "nickname" initial nicht sichtbar ist
    await expect(page.getByTestId('character-field-nickname')).not.toBeVisible();

    // Klicke auf "Add Attribute" Button
    await page.getByTestId('add-attribute-button').click();

    // Prüfe dass das Menü geöffnet ist
    await expect(page.getByTestId('add-attribute-menu')).toBeVisible();

    // Klicke auf "nickname" im Menü
    await page.getByTestId('add-field-nickname').click();

    // Prüfe dass das Feld jetzt sichtbar ist
    await expect(page.getByTestId('character-field-nickname')).toBeVisible();

    // Fülle das Feld aus
    await page.getByTestId('character-field-nickname').fill('Johnny');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe Persistenz
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Prüfe dass das Feld noch sichtbar ist und den Wert hat
    await expect(page.getByTestId('character-field-nickname')).toBeVisible();
    await expect(page.getByTestId('character-field-nickname')).toHaveValue('Johnny');
  });

  test('should add multiple optional fields in Basic tab', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Füge "age" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-age').click();
    await expect(page.getByTestId('character-field-age')).toBeVisible();
    await page.getByTestId('character-field-age').fill('32');

    // Füge "gender" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-gender').click();
    await expect(page.getByTestId('character-field-gender')).toBeVisible();
    await page.getByTestId('character-field-gender').fill('Male');

    // Füge "residence" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-residence').click();
    await expect(page.getByTestId('character-field-residence')).toBeVisible();
    await page.getByTestId('character-field-residence').fill('New York');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe alle Felder
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByTestId('character-field-age')).toHaveValue('32');
    await expect(page.getByTestId('character-field-gender')).toHaveValue('Male');
    await expect(page.getByTestId('character-field-residence')).toHaveValue('New York');
  });

  test('should add optional fields in Appearance tab', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Gehe zu Appearance Tab
    await page.getByTestId('character-tab-appearance').click();

    // Füge "height" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-height').click();
    await expect(page.getByTestId('character-field-height')).toBeVisible();
    await page.getByTestId('character-field-height').fill('185 cm');

    // Füge "weight" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-weight').click();
    await expect(page.getByTestId('character-field-weight')).toBeVisible();
    await page.getByTestId('character-field-weight').fill('80 kg');

    // Füge "build" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-build').click();
    await expect(page.getByTestId('character-field-build')).toBeVisible();
    await page.getByTestId('character-field-build').fill('Athletic');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.getByTestId('character-tab-appearance').click();
    await expect(page.getByTestId('character-field-height')).toHaveValue('185 cm');
    await expect(page.getByTestId('character-field-weight')).toHaveValue('80 kg');
    await expect(page.getByTestId('character-field-build')).toHaveValue('Athletic');
  });

  test('should add optional textarea field in Appearance tab', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Gehe zu Appearance Tab
    await page.getByTestId('character-tab-appearance').click();

    // Füge "general_impression" (textarea) hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-general_impression').click();
    await expect(page.getByTestId('character-field-general_impression')).toBeVisible();

    const impressionText = 'A tall, imposing figure with a commanding presence. Often wears dark colors.';
    await page.getByTestId('character-field-general_impression').fill(impressionText);

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.getByTestId('character-tab-appearance').click();
    await expect(page.getByTestId('character-field-general_impression')).toHaveValue(impressionText);
  });

  test('should add optional fields in Personality tab', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Gehe zu Personality Tab
    await page.getByTestId('character-tab-personality').click();

    // Füge "fears" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-fears').click();
    await expect(page.getByTestId('character-field-fears')).toBeVisible();
    await page.getByTestId('character-field-fears').fill('Heights, spiders');

    // Füge "goals_motivation" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-goals_motivation').click();
    await expect(page.getByTestId('character-field-goals_motivation')).toBeVisible();
    await page.getByTestId('character-field-goals_motivation').fill('To protect his family');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.getByTestId('character-tab-personality').click();
    await expect(page.getByTestId('character-field-fears')).toHaveValue('Heights, spiders');
    await expect(page.getByTestId('character-field-goals_motivation')).toHaveValue('To protect his family');
  });

  test('should add optional fields in Background tab', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Gehe zu Background Tab (key ist "relations", nicht "background")
    await page.getByTestId('character-tab-relations').click();

    // Füge "education" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-education').click();
    await expect(page.getByTestId('character-field-education')).toBeVisible();
    await page.getByTestId('character-field-education').fill('PhD in Physics');

    // Füge "occupation" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-occupation').click();
    await expect(page.getByTestId('character-field-occupation')).toBeVisible();
    await page.getByTestId('character-field-occupation').fill('Research Scientist');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Reload und prüfe
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.getByTestId('character-tab-relations').click();
    await expect(page.getByTestId('character-field-education')).toHaveValue('PhD in Physics');
    await expect(page.getByTestId('character-field-occupation')).toHaveValue('Research Scientist');
  });

  test('should remove optional field', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Füge "nickname" hinzu
    await page.getByTestId('add-attribute-button').click();
    await page.getByTestId('add-field-nickname').click();
    await expect(page.getByTestId('character-field-nickname')).toBeVisible();
    await page.getByTestId('character-field-nickname').fill('Johnny');

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Entferne das Feld
    await page.getByTestId('remove-field-nickname').click();

    // Prüfe dass das Feld nicht mehr sichtbar ist
    await expect(page.getByTestId('character-field-nickname')).not.toBeVisible();

    // Warte auf Autosave der Entfernung
    await page.waitForTimeout(1000);

    // Reload und prüfe dass das Feld noch immer weg ist
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByTestId('character-field-nickname')).not.toBeVisible();
  });

  test('should close Add Attributes menu with close button', async ({ page }) => {
    // Erstelle Character
    await page.getByTestId('add-character-button').click();
    await expect(page.locator('[data-testid^="character-"]').first()).toBeVisible();

    // Öffne das Menü
    await page.getByTestId('add-attribute-button').click();
    await expect(page.getByTestId('add-attribute-menu')).toBeVisible();

    // Schließe das Menü mit dem Close Button
    await page.getByTestId('close-attribute-menu').click();

    // Prüfe dass das Menü geschlossen ist
    await expect(page.getByTestId('add-attribute-menu')).not.toBeVisible();
  });
});
