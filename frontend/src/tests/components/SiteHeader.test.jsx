import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader';

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <SiteHeader />
    </MemoryRouter>
  );
};

describe('SiteHeader Component', () => {
  it('sollte Header-Element rendern', () => {
    const { container } = renderWithRouter();
    const header = container.querySelector('.site-header');
    expect(header).toBeInTheDocument();
  });

  it('sollte Link zum Dashboard enthalten', () => {
    renderWithRouter();
    const link = screen.getByLabelText('Zum Dashboard');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('sollte Logo-Bild anzeigen', () => {
    renderWithRouter();
    const logo = screen.getByAltText('Writehaven');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('brand-logo');
  });

  it('sollte Feedback-Button anzeigen', () => {
    renderWithRouter();
    const feedbackButton = screen.getByRole('button', { name: 'Feedback' });
    expect(feedbackButton).toBeInTheDocument();
    expect(feedbackButton).toHaveClass('btn', 'ghost');
  });

  it('sollte brand-icon Element haben', () => {
    const { container } = renderWithRouter();
    const brandIcon = container.querySelector('.brand-icon');
    expect(brandIcon).toBeInTheDocument();
    expect(brandIcon).toHaveClass('natural');
  });
});
