import { render } from '@testing-library/react'

import ClientIcons from './client-icons'

describe('ClientIcons', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientIcons />)
    expect(baseElement).toBeTruthy()
  })
})
