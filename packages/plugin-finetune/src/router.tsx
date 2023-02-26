import React from 'react'
import { Route } from 'react-router-dom'

import FineTuneManagerLayout from './PageLayout'
import FineTuneManager from './screens/Home'
import Completions from '/completions'
import NewFineTune from './screens/NewFineTune'
import CompletionDetails from './completions/CompletionDetails'

export const () => (
    <Route element={<FineTuneManagerLayout />}>
    <Route path="/fineTuneManager" element={<FineTuneManager />} />
    <Route
      path="/fineTuneManager/completions"
      element={<Completions />}
    />
    <Route
      path="/fineTuneManager/fine-tunes/new"
      element={<NewFineTune />}
    />
    <Route
      path="/fineTuneManager/fine-tune/:fineTuneId"
      element={<CompletionDetails />}
    />
  </Route>
)