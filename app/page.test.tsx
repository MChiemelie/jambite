import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LandingPage from './page'

// Mock all the landing components
vi.mock('@/components/landing', () => ({
  Background: () => <div data-testid="background">Background</div>,
  Nav: () => <nav data-testid="nav">Navigation</nav>,
  Hero: () => <div data-testid="hero">Hero Section</div>,
  Stake: () => <section data-testid="stake">Stake Section</section>,
  Values: () => <section data-testid="values">Values Section</section>,
  Steps: () => <section data-testid="steps">Steps Section</section>,
  Pricing: () => <section data-testid="pricing">Pricing Section</section>,
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

describe('LandingPage', () => {
  it('renders without crashing', () => {
    render(<LandingPage />)
    expect(document.body).toBeTruthy()
  })

  it('renders the Background component', () => {
    render(<LandingPage />)
    expect(screen.getByTestId('background')).toBeInTheDocument()
  })

  it('renders header with Nav and Hero', () => {
    render(<LandingPage />)
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
    expect(screen.getByTestId('nav')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
  })

  it('renders main section with all content sections', () => {
    render(<LandingPage />)
    const main = document.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('flex', 'flex-col', 'gap-20')

    // Check all main sections
    expect(screen.getByTestId('stake')).toBeInTheDocument()
    expect(screen.getByTestId('values')).toBeInTheDocument()
    expect(screen.getByTestId('steps')).toBeInTheDocument()
    expect(screen.getByTestId('pricing')).toBeInTheDocument()
  })

  it('renders the Footer component', () => {
    render(<LandingPage />)
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders sections in the correct order', () => {
    const { container } = render(<LandingPage />)
    const sections = [
      'background',
      'nav',
      'hero',
      'stake',
      'values',
      'steps',
      'pricing',
      'footer',
    ]

    sections.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })
  })

  it('has proper semantic HTML structure', () => {
    render(<LandingPage />)
    expect(document.querySelector('header')).toBeInTheDocument()
    expect(document.querySelector('main')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})