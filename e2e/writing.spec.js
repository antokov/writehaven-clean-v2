// e2e/writing.spec.js
import { test, expect } from '@playwright/test';

// Test-Credentials
const TEST_USER = {
  email: 'test@test.ch',
  password: 'test123',
};

test.describe('Writing Section (Schreiben)', () => {
  let projectId;

  // Helper: Login
  async function login(page) {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/app');
  }

  // Helper: Neues Projekt erstellen
  async function createProject(page, projectName = 'Test Project') {
    // Klicke auf "New Project" Button
    await page.getByTestId('new-project-button').click();

    // Warte bis Modal erscheint
    await expect(page.locator('.modal-dialog')).toBeVisible();

    // Fülle Projektnamen aus
    await page.getByTestId('project-title-input').fill(projectName);

    // Klicke auf "Create" Button
    await page.getByTestId('create-project-submit').click();

    // Warte bis Modal geschlossen ist
    await expect(page.locator('.modal-dialog')).not.toBeVisible();

    // Warte kurz bis Projekt in Liste erscheint
    await page.waitForTimeout(500);

    // Hole alle Projekte und finde das neueste (erstes in der Liste)
    const projectCards = await page.locator('[data-testid^="project-card-"]').all();

    if (projectCards.length === 0) {
      throw new Error('No project cards found after creation');
    }

    // Das neueste Projekt ist das erste in der Liste
    const firstCard = projectCards[0];
    const testId = await firstCard.getAttribute('data-testid');
    const pid = testId.replace('project-card-', '');

    // Öffne das Kontextmenü des Projekts
    await page.getByTestId(`project-menu-${pid}`).click();
    await page.waitForTimeout(200);

    // Klicke auf "Open" im Dropdown-Menü
    await page.getByTestId(`project-open-${pid}`).click();

    // Warte bis Projekt-Seite geladen ist
    await page.waitForURL('**/app/project/*');

    return pid;
  }

  // Helper: Projekt löschen
  async function deleteProject(page, pid) {
    if (!pid) return;

    // Navigiere zu Dashboard
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

  // Vor jedem Test: Login und Projekt erstellen
  test.beforeEach(async ({ page }) => {
    await login(page);
    projectId = await createProject(page);
    expect(projectId).toBeTruthy();
  });

  // Nach jedem Test: Projekt löschen
  test.afterEach(async ({ page }) => {
    await deleteProject(page, projectId);
  });

  test('should create a new chapter', async ({ page }) => {
    // Klicke auf "+ Kapitel" Button
    await page.getByTestId('add-chapter-button').click();

    // Warte bis erstes Kapitel erscheint
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    // Prüfe dass Kapitel-Text angezeigt wird
    await expect(firstChapter).toContainText(/Kapitel|Chapter/i);
  });

  test('should create a scene in a chapter', async ({ page }) => {
    // Erstelle Kapitel
    await page.getByTestId('add-chapter-button').click();
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    // Hole Kapitel-ID
    const chapterTestId = await firstChapter.getAttribute('data-testid');
    const chapterId = chapterTestId.replace('chapter-', '');

    // Klicke auf "+ Szene" Button für dieses Kapitel
    await page.getByTestId(`add-scene-${chapterId}`).click();

    // Warte bis Szene erscheint
    const firstScene = page.locator('[data-testid^="scene-"]').first();
    await expect(firstScene).toBeVisible();

    // Prüfe dass Editor sichtbar ist
    await expect(page.getByTestId('scene-content-editor')).toBeVisible();
  });

  test('should write and autosave content in a scene', async ({ page }) => {
    // Erstelle Kapitel
    await page.getByTestId('add-chapter-button').click();
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    // Hole Kapitel-ID und erstelle Szene
    const chapterTestId = await firstChapter.getAttribute('data-testid');
    const chapterId = chapterTestId.replace('chapter-', '');
    await page.getByTestId(`add-scene-${chapterId}`).click();

    // Warte auf Editor
    const editor = page.getByTestId('scene-content-editor');
    await expect(editor).toBeVisible();

    // Hole Szene-ID für später
    const firstScene = page.locator('[data-testid^="scene-"]').first();
    const sceneTestId = await firstScene.getAttribute('data-testid');

    // Schreibe Text - EntityHighlighter ist ein ContentEditable, nicht ein Input
    const testContent = 'Es war einmal in einem fernen Land...';

    // Klicke in den Editor und tippe Text
    await editor.click();
    await page.keyboard.type(testContent);

    // Warte auf Autosave (600ms debounce + Puffer)
    await page.waitForTimeout(1000);

    // Lade Seite neu und warte bis vollständig geladen
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Öffne die Szene wieder (nach Reload zeigt es Kapitel-Übersicht)
    await page.locator(`[data-testid="${sceneTestId}"]`).click();

    // Warte bis Editor wieder da ist
    await expect(page.getByTestId('scene-content-editor')).toBeVisible();

    // Prüfe dass Text gespeichert wurde - ContentEditable verwendet textContent
    await expect(page.getByTestId('scene-content-editor')).toContainText(testContent);
  });

  test('should rename a chapter', async ({ page }) => {
    // Erstelle Kapitel
    await page.getByTestId('add-chapter-button').click();
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    // Klicke auf Kapitel um es zu aktivieren (Kapitel-Übersicht)
    await firstChapter.click();

    // Warte bis Kapitel-Titel Input erscheint
    const titleInput = page.getByTestId('chapter-title-input');
    await expect(titleInput).toBeVisible();

    // Ändere Titel
    const newTitle = 'Der Anfang';
    await titleInput.fill(newTitle);

    // Trigger blur event (autosave)
    await titleInput.blur();

    // Warte auf Autosave
    await page.waitForTimeout(800);

    // Prüfe dass neuer Titel in Sidebar erscheint
    await expect(firstChapter).toContainText(newTitle);

    // Reload und prüfe Persistenz
    await page.reload();
    await expect(page.locator('[data-testid^="chapter-"]').first()).toContainText(newTitle);
  });

  test('should rename a scene', async ({ page }) => {
    // Erstelle Kapitel und Szene
    await page.getByTestId('add-chapter-button').click();
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    const chapterTestId = await firstChapter.getAttribute('data-testid');
    const chapterId = chapterTestId.replace('chapter-', '');
    await page.getByTestId(`add-scene-${chapterId}`).click();

    // Warte auf Szenen-Titel Input
    const sceneTitleInput = page.getByTestId('scene-title-input');
    await expect(sceneTitleInput).toBeVisible();

    // Ändere Titel
    const newTitle = 'Die Eröffnung';
    await sceneTitleInput.fill(newTitle);

    // Trigger blur
    await sceneTitleInput.blur();

    // Warte auf Autosave
    await page.waitForTimeout(1000);

    // Prüfe dass neuer Titel in Sidebar erscheint
    const firstScene = page.locator('[data-testid^="scene-"]').first();
    await expect(firstScene).toContainText(newTitle);
  });

  test('should switch between scenes and preserve content', async ({ page }) => {
    // Erstelle Kapitel
    await page.getByTestId('add-chapter-button').click();
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    const chapterTestId = await firstChapter.getAttribute('data-testid');
    const chapterId = chapterTestId.replace('chapter-', '');

    // Erstelle erste Szene
    await page.getByTestId(`add-scene-${chapterId}`).click();
    const editor = page.getByTestId('scene-content-editor');
    await expect(editor).toBeVisible();

    // Hole Scene-ID
    const scene1 = page.locator('[data-testid^="scene-"]').first();
    const scene1TestId = await scene1.getAttribute('data-testid');

    // Schreibe in erste Szene - ContentEditable verwenden
    const content1 = 'Inhalt der ersten Szene.';
    await editor.click();
    await page.keyboard.type(content1);
    await page.waitForTimeout(1000); // Autosave

    // Erstelle zweite Szene
    await page.getByTestId(`add-scene-${chapterId}`).click();
    await page.waitForTimeout(500);

    const scene2 = page.locator('[data-testid^="scene-"]').nth(1);
    await expect(scene2).toBeVisible();

    // Schreibe in zweite Szene
    const content2 = 'Inhalt der zweiten Szene.';
    await editor.click();
    await page.keyboard.type(content2);
    await page.waitForTimeout(1000); // Autosave

    // Klicke zurück auf Szene 1
    await page.locator(`[data-testid="${scene1TestId}"]`).click();
    await expect(editor).toContainText(content1);

    // Klicke auf Szene 2
    await scene2.click();
    await expect(editor).toContainText(content2);
  });

  test('should delete a scene', async ({ page }) => {
    // Erstelle Kapitel und Szene
    await page.getByTestId('add-chapter-button').click();
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    const chapterTestId = await firstChapter.getAttribute('data-testid');
    const chapterId = chapterTestId.replace('chapter-', '');
    await page.getByTestId(`add-scene-${chapterId}`).click();

    const firstScene = page.locator('[data-testid^="scene-"]').first();
    await expect(firstScene).toBeVisible();

    // Hole Scene-ID
    const sceneTestId = await firstScene.getAttribute('data-testid');
    const sceneId = sceneTestId.replace('scene-', '');

    // Klicke auf Delete-Button
    await page.getByTestId(`delete-scene-${sceneId}`).click();

    // Bestätige Deletion im Modal
    await page.locator('.modal-dialog button:has-text("Delete"), .modal-dialog button:has-text("Löschen")').click();

    // Warte bis Modal geschlossen ist
    await expect(page.locator('.modal-dialog')).not.toBeVisible();

    // Prüfe dass Szene entfernt wurde
    await expect(page.getByTestId(`scene-${sceneId}`)).not.toBeVisible();
  });

  test('should delete a chapter', async ({ page }) => {
    // Erstelle Kapitel
    await page.getByTestId('add-chapter-button').click();
    const firstChapter = page.locator('[data-testid^="chapter-"]').first();
    await expect(firstChapter).toBeVisible();

    // Hole Chapter-ID
    const chapterTestId = await firstChapter.getAttribute('data-testid');
    const chapterId = chapterTestId.replace('chapter-', '');

    // Klicke auf Delete-Icon
    await page.getByTestId(`delete-chapter-${chapterId}`).click();

    // Bestätige Deletion
    await page.locator('.modal-dialog button:has-text("Delete"), .modal-dialog button:has-text("Löschen")').click();

    // Prüfe dass Kapitel entfernt wurde
    await expect(firstChapter).not.toBeVisible();
  });
});
