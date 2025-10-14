import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TopNav from '../../components/TopNav';

// Helper-Funktion zum Rendern mit Router-Context
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/app/project/:id/*" element={<TopNav />} />
        <Route path="/" element={<TopNav />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('TopNav Component', () => {
  it('sollte nichts rendern wenn keine ID im URL ist', () => {
    const { container } = renderWithRouter('/');
    expect(container.firstChild).toBeNull();
  });

  it('sollte Navigation rendern wenn ID vorhanden ist', () => {
    renderWithRouter('/app/project/123');

    expect(screen.getByText('Schreiben')).toBeInTheDocument();
    expect(screen.getByText('Charaktere')).toBeInTheDocument();
    expect(screen.getByText('Welt')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('sollte alle Navigation-Links mit korrekten Pfaden haben', () => {
    renderWithRouter('/app/project/456');

    const schreibenLink = screen.getByText('Schreiben').closest('a');
    const charaktereLink = screen.getByText('Charaktere').closest('a');
    const weltLink = screen.getByText('Welt').closest('a');
    const exportLink = screen.getByText('Export').closest('a');

    expect(schreibenLink).toHaveAttribute('href', '/app/project/456');
    expect(charaktereLink).toHaveAttribute('href', '/app/project/456/characters');
    expect(weltLink).toHaveAttribute('href', '/app/project/456/world');
    expect(exportLink).toHaveAttribute('href', '/app/project/456/export');
  });

  it('sollte Tab-CSS-Klasse auf allen Links haben', () => {
    renderWithRouter('/app/project/789');

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('tab');
    });
  });

  it('sollte vier Tabs anzeigen', () => {
    renderWithRouter('/app/project/100');

    const tabs = screen.getAllByRole('link');
    expect(tabs).toHaveLength(4);
  });
});
