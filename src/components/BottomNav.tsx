import { CalendarDays, Lightbulb, UsersRound, Waypoints } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/today', label: '今日', Icon: CalendarDays },
  { to: '/people', label: '重要的人', Icon: UsersRound },
  { to: '/timeline', label: '时间线', Icon: Waypoints },
  { to: '/insights', label: '洞察', Icon: Lightbulb },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="主要导航">
      {items.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} aria-label={label}>
          <Icon size={20} strokeWidth={1.8} />
        </NavLink>
      ))}
    </nav>
  )
}
