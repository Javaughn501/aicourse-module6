import { Navbar } from './components/navigation'
import type { NavigationLink, UserMenuAction, UserProfile } from './components/navigation'
import { AnalyticsDashboardDemo } from './pages/AnalyticsDashboardDemo'
import { FeedDemo } from './pages/FeedDemo'
import { KanbanDemo } from './pages/KanbanDemo'
import { ProductsDemo } from './pages/ProductsDemo'
import { RegistrationDemo } from './pages/RegistrationDemo'
import { SettingsDemo } from './pages/SettingsDemo'

const NAV_LINKS: NavigationLink[] = [
  { label: 'Home', href: '#' },
  { label: 'Shop', href: '#product-grid' },
  { label: 'Register', href: '#registration-demo' },
  { label: 'Feed', href: '#social-feed' },
  { label: 'Kanban', href: '#kanban-demo' },
  { label: 'Analytics', href: '#analytics-dashboard' },
  { label: 'Settings', href: '#settings-demo' },
]

const USER: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&facepad=2&crop=face',
}

const USER_MENU: UserMenuAction[] = [
  { id: 'account', label: 'Account settings', href: '#settings-demo' },
  { id: 'orders', label: 'Orders', href: '#' },
  {
    id: 'signout',
    label: 'Sign out',
    destructive: true,
    onSelect: () => {
      /* demo */
    },
  },
]

function App() {
  return (
    <>
      <Navbar
        brandLabel="Acme Shop"
        homeHref="#"
        links={NAV_LINKS}
        user={USER}
        userMenuActions={USER_MENU}
        onSearch={() => {
          /* demo: wire to search route or global state */
        }}
      />
      <ProductsDemo />
      <FeedDemo />
      <RegistrationDemo />
      <KanbanDemo />
      <AnalyticsDashboardDemo />
      <SettingsDemo />
    </>
  )
}

export default App
