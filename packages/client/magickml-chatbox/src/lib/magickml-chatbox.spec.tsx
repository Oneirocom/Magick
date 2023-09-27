import { render } from '@testing-library/react'

import MagickmlChatbox from './magickml-chatbox'

describe('MagickmlChatbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MagickmlChatbox />)
    expect(baseElement).toBeTruthy()
  })
})
