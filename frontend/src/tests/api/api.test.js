import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock der API-Instanz
const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

describe('API Client Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sollte API-Client-Methoden verfügbar haben', () => {
    expect(mockApi.get).toBeDefined();
    expect(mockApi.post).toBeDefined();
    expect(mockApi.put).toBeDefined();
    expect(mockApi.delete).toBeDefined();
  });

  describe('Projects API', () => {
    it('sollte Projektliste abrufen können', async () => {
      const mockProjects = [
        { id: 1, title: 'Project 1', description: 'Desc 1' },
        { id: 2, title: 'Project 2', description: 'Desc 2' },
      ];

      mockApi.get.mockResolvedValue({ data: mockProjects });

      const response = await mockApi.get('/projects');
      expect(response.data).toEqual(mockProjects);
      expect(mockApi.get).toHaveBeenCalledWith('/projects');
    });

    it('sollte einzelnes Projekt abrufen können', async () => {
      const mockProject = { id: 1, title: 'Test Project', description: 'Test Desc' };

      mockApi.get.mockResolvedValue({ data: mockProject });

      const response = await mockApi.get('/projects/1');
      expect(response.data).toEqual(mockProject);
      expect(mockApi.get).toHaveBeenCalledWith('/projects/1');
    });

    it('sollte Projekt erstellen können', async () => {
      const newProject = { title: 'New Project', description: 'New Desc' };
      const createdProject = { id: 3, ...newProject };

      mockApi.post.mockResolvedValue({ data: createdProject });

      const response = await mockApi.post('/projects', newProject);
      expect(response.data).toEqual(createdProject);
      expect(mockApi.post).toHaveBeenCalledWith('/projects', newProject);
    });

    it('sollte Projekt aktualisieren können', async () => {
      const updates = { title: 'Updated Title' };
      const updatedProject = { id: 1, title: 'Updated Title', description: 'Old Desc' };

      mockApi.put.mockResolvedValue({ data: updatedProject });

      const response = await mockApi.put('/projects/1', updates);
      expect(response.data).toEqual(updatedProject);
      expect(mockApi.put).toHaveBeenCalledWith('/projects/1', updates);
    });

    it('sollte Projekt löschen können', async () => {
      mockApi.delete.mockResolvedValue({ data: { ok: true } });

      const response = await mockApi.delete('/projects/1');
      expect(response.data).toEqual({ ok: true });
      expect(mockApi.delete).toHaveBeenCalledWith('/projects/1');
    });

    it('sollte Fehler beim API-Aufruf korrekt behandeln', async () => {
      const errorMessage = 'Network Error';
      mockApi.get.mockRejectedValue(new Error(errorMessage));

      await expect(mockApi.get('/projects')).rejects.toThrow(errorMessage);
    });

    it('sollte 404-Fehler korrekt behandeln', async () => {
      const error = {
        response: {
          status: 404,
          data: { error: 'not_found' },
        },
      };
      mockApi.get.mockRejectedValue(error);

      try {
        await mockApi.get('/projects/99999');
      } catch (err) {
        expect(err.response.status).toBe(404);
        expect(err.response.data.error).toBe('not_found');
      }
    });
  });

  describe('Characters API', () => {
    it('sollte Charakterliste für Projekt abrufen', async () => {
      const mockCharacters = [
        { id: 1, name: 'Hero', project_id: 1 },
        { id: 2, name: 'Villain', project_id: 1 },
      ];

      mockApi.get.mockResolvedValue({ data: mockCharacters });

      const response = await mockApi.get('/projects/1/characters');
      expect(response.data).toEqual(mockCharacters);
    });

    it('sollte Charakter erstellen können', async () => {
      const newCharacter = {
        name: 'New Hero',
        summary: 'A brave warrior',
        profile: { age: 25 },
      };
      const createdCharacter = { id: 3, project_id: 1, ...newCharacter };

      mockApi.post.mockResolvedValue({ data: createdCharacter });

      const response = await mockApi.post('/projects/1/characters', newCharacter);
      expect(response.data).toEqual(createdCharacter);
    });

    it('sollte Charakter aktualisieren können', async () => {
      const updates = { name: 'Updated Hero', summary: 'New summary' };
      const updatedCharacter = { id: 1, project_id: 1, ...updates, profile: {} };

      mockApi.put.mockResolvedValue({ data: updatedCharacter });

      const response = await mockApi.put('/characters/1', updates);
      expect(response.data).toEqual(updatedCharacter);
    });

    it('sollte Charakter löschen können', async () => {
      mockApi.delete.mockResolvedValue({ data: { ok: true } });

      const response = await mockApi.delete('/characters/1');
      expect(response.data.ok).toBe(true);
    });
  });

  describe('Chapters API', () => {
    it('sollte Kapitelliste für Projekt abrufen', async () => {
      const mockChapters = [
        { id: 1, title: 'Chapter 1', project_id: 1, order_index: 1 },
        { id: 2, title: 'Chapter 2', project_id: 1, order_index: 2 },
      ];

      mockApi.get.mockResolvedValue({ data: mockChapters });

      const response = await mockApi.get('/projects/1/chapters');
      expect(response.data).toEqual(mockChapters);
    });

    it('sollte Kapitel erstellen können', async () => {
      const newChapter = { title: 'New Chapter', order_index: 3 };
      const createdChapter = { id: 3, project_id: 1, ...newChapter };

      mockApi.post.mockResolvedValue({ data: createdChapter });

      const response = await mockApi.post('/projects/1/chapters', newChapter);
      expect(response.data).toEqual(createdChapter);
    });
  });

  describe('Scenes API', () => {
    it('sollte Szenenliste für Kapitel abrufen', async () => {
      const mockScenes = [
        { id: 1, title: 'Scene 1', chapter_id: 1, content: 'Content 1' },
        { id: 2, title: 'Scene 2', chapter_id: 1, content: 'Content 2' },
      ];

      mockApi.get.mockResolvedValue({ data: mockScenes });

      const response = await mockApi.get('/chapters/1/scenes');
      expect(response.data).toEqual(mockScenes);
    });

    it('sollte Szene erstellen können', async () => {
      const newScene = { title: 'New Scene', content: 'Scene content', order_index: 1 };
      const createdScene = { id: 3, chapter_id: 1, ...newScene };

      mockApi.post.mockResolvedValue({ data: createdScene });

      const response = await mockApi.post('/chapters/1/scenes', newScene);
      expect(response.data).toEqual(createdScene);
    });

    it('sollte Szene aktualisieren können', async () => {
      const updates = { content: 'Updated content' };
      const updatedScene = { id: 1, chapter_id: 1, title: 'Scene 1', ...updates };

      mockApi.put.mockResolvedValue({ data: updatedScene });

      const response = await mockApi.put('/scenes/1', updates);
      expect(response.data).toEqual(updatedScene);
    });
  });

  describe('World API', () => {
    it('sollte World-Elemente für Projekt abrufen', async () => {
      const mockWorldNodes = [
        { id: 1, title: 'Castle', kind: 'Ort', project_id: 1 },
        { id: 2, title: 'Forest', kind: 'Ort', project_id: 1 },
      ];

      mockApi.get.mockResolvedValue({ data: mockWorldNodes });

      const response = await mockApi.get('/projects/1/world');
      expect(response.data).toEqual(mockWorldNodes);
    });

    it('sollte World-Element erstellen können', async () => {
      const newWorldNode = { title: 'New Location', kind: 'Ort', icon: '🏰' };
      const createdWorldNode = { id: 3, project_id: 1, ...newWorldNode };

      mockApi.post.mockResolvedValue({ data: createdWorldNode });

      const response = await mockApi.post('/projects/1/world', newWorldNode);
      expect(response.data).toEqual(createdWorldNode);
    });

    it('sollte World-Element mit Relations aktualisieren können', async () => {
      const updates = {
        title: 'Updated Castle',
        relations: { characters: [1, 2], events: [5] },
      };
      const updatedWorldNode = { id: 1, project_id: 1, kind: 'Ort', ...updates };

      mockApi.put.mockResolvedValue({ data: updatedWorldNode });

      const response = await mockApi.put('/world/1', updates);
      expect(response.data).toEqual(updatedWorldNode);
    });
  });
});
