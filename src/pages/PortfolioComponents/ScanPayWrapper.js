import { ContentPairProvider } from '@waku/react'
import ScanAndPay from './ScanAndPay'

export default function ScanPayWrapper() {
  return (
    <ContentPairProvider contentTopic={'/upi/' + 121}>
      <ScanAndPay />
    </ContentPairProvider>
  )
}
