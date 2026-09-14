import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { AiOrganizing } from './routes/AiOrganizing'
import { AiPermission } from './routes/AiPermission'
import { Capture } from './routes/Capture'
import { DeleteConfirmation } from './routes/DeleteConfirmation'
import { EmptyStates } from './routes/EmptyStates'
import { Insights } from './routes/Insights'
import { InsightDetail } from './routes/InsightDetail'
import { MemoryDetail } from './routes/MemoryDetail'
import { Onboarding } from './routes/Onboarding'
import { People } from './routes/People'
import { PersonProfile } from './routes/PersonProfile'
import { PersonTimeline } from './routes/PersonTimeline'
import { PrivacySettings } from './routes/PrivacySettings'
import { SaveState } from './routes/SaveState'
import { Today } from './routes/Today'
import { Timeline } from './routes/Timeline'
import { TimelineOverview } from './routes/TimelineOverview'
import { VoiceCapture } from './routes/VoiceCapture'
import { Welcome } from './routes/Welcome'

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/today" element={<Today />} />
        <Route path="/states/save" element={<SaveState />} />
        <Route path="/people" element={<People />} />
        <Route path="/people/:personId" element={<PersonProfile />} />
        <Route path="/people/:personId/timeline" element={<PersonTimeline />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/timeline/overview" element={<TimelineOverview />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:insightId" element={<InsightDetail />} />
        <Route path="/memories/:memoryId" element={<MemoryDetail />} />
        <Route path="/settings" element={<PrivacySettings />} />
        <Route path="/states/empty" element={<EmptyStates />} />
        <Route path="/states/delete-confirmation" element={<DeleteConfirmation />} />
        <Route path="/states/ai-permission" element={<AiPermission />} />
        <Route path="/states/voice-capture" element={<VoiceCapture />} />
        <Route path="/states/organizing" element={<AiOrganizing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
