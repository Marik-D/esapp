import React from 'react'
import { render } from 'react-dom'

import { Page, extractPages } from './pages'
import { Story, extractStories } from './stories'
import { Storybook } from './components'

export interface Spec {
  basePath: string
  pages: Page[]
  stories: Story[]
}

/**
 * Called by JS injected into page via the plugin.
 */
export function main(spec: Spec, options: any) {
  render((
    <Storybook
      pages={extractPages(spec.pages)}
      stories={extractStories(spec.stories, spec.basePath)}
      options={options}
    />
  ),
  document.getElementById('root'));
}