/**
 * WorkLife Hub Design System — Central Barrel Export
 * Imports from canonical locations (atoms → molecules → organisms → product)
 *
 * Usage:
 *   import { Button, Card, WellbeingScore } from '@/components'
 *   (requires path alias in tsconfig/vite: "@/*" → "src/*")
 *
 *   Or direct path:
 *   import { Button, Card } from '../components'
 */

/* ── Atoms ──────────────────────────────────────────────────────── */
export { Avatar }                              from './atoms/Avatar'
export type { AvatarProps, AvatarSize, AvatarStatus } from './atoms/Avatar'

export { Badge }                               from './atoms/Badge'
export type { BadgeProps, BadgeVariant }       from './atoms/Badge'

export { Button }                              from './atoms/Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './atoms/Button'

export { Card, CardHeader, CardBody, CardFooter } from './atoms/Card'
export type { CardProps, CardSectionProps, CardVariant, CardPadding } from './atoms/Card'

export { Checkbox }                            from './atoms/Checkbox'
export type { CheckboxProps }                  from './atoms/Checkbox'

export { HelperText }                          from './atoms/HelperText'

export { Input }                               from './atoms/Input'

export { Label }                               from './atoms/Label'

export { ProgressBar }                         from './atoms/ProgressBar'
export type { ProgressBarProps, ProgressType, ProgressVariant } from './atoms/ProgressBar'

export { Radio, RadioGroup }                   from './atoms/Radio'
export type { RadioProps, RadioGroupProps }    from './atoms/Radio'

export { Select }                              from './atoms/Select'
export type { SelectProps }                    from './atoms/Select'

export { Skeleton }                            from './atoms/Skeleton'
export type { SkeletonProps }                  from './atoms/Skeleton'

export { Spinner }                             from './atoms/Spinner'
export type { SpinnerProps }                   from './atoms/Spinner'

export { Textarea }                            from './atoms/Textarea'

export { Toggle }                              from './atoms/Toggle'
export type { ToggleProps }                    from './atoms/Toggle'

export { Tag }                                 from './atoms/Tag'
export type { TagProps, TagVariant, TagSize }  from './atoms/Tag'

export { ThemeToggle, useTheme }               from './atoms/ThemeToggle'
export type { ThemeToggleProps, Theme }        from './atoms/ThemeToggle'

export { Tooltip }                             from './atoms/Tooltip'
export type { TooltipProps, TooltipPlacement } from './atoms/Tooltip'

/* ── Molecules ──────────────────────────────────────────────────── */
export { Breadcrumb }                          from './molecules/Breadcrumb'
export type { BreadcrumbProps, BreadcrumbItem } from './molecules/Breadcrumb'
export { Accordion }                           from './molecules/Accordion'
export type { AccordionProps, AccordionItem, AccordionVariant, AccordionSize } from './molecules/Accordion'

export { Callout }                             from './molecules/Callout'
export type { CalloutProps }                   from './molecules/Callout'

export { DatePicker, DEFAULT_PRESETS }         from './molecules/DatePicker'
export type { DatePickerProps, DatePickerMode, DateRange, DatePreset } from './molecules/DatePicker'

export { Dropdown }                            from './molecules/Dropdown'
export type { DropdownProps, DropdownItem, DropdownEntry, DropdownSeparator, DropdownPlacement } from './molecules/Dropdown'

export { EmptyState }                          from './molecules/EmptyState'
export type { EmptyStateProps }                from './molecules/EmptyState'

export { FormField }                           from './molecules/FormField'
export type { FormFieldProps }                 from './molecules/FormField'

export { Pagination }                          from './molecules/Pagination'
export type { PaginationProps }                from './molecules/Pagination'

export { PasswordField }                       from './molecules/PasswordField'
export type { PasswordFieldProps }             from './molecules/PasswordField'

export { SearchField }                         from './molecules/SearchField'
export type { SearchFieldProps }               from './molecules/SearchField'

export { StatCard }                            from './molecules/StatCard'
export type { StatCardProps }                  from './molecules/StatCard'

export { Stepper }                             from './molecules/Stepper'
export type { StepperProps, Step, StepStatus, StepperOrientation } from './molecules/Stepper'

export { Tabs }                                from './molecules/Tabs'
export type { TabsProps, Tab, TabVariant }     from './molecules/Tabs'

/* ── Organisms ──────────────────────────────────────────────────── */
export { Drawer }                              from './organisms/Drawer'
export type { DrawerProps, DrawerPlacement, DrawerSize } from './organisms/Drawer'

export { FilterBar }                           from './organisms/FilterBar'
export type { FilterBarProps, FilterGroup, FilterOption, ActiveFilter } from './organisms/FilterBar'

export { PageHeader }                          from './organisms/PageHeader'
export type { PageHeaderProps }                from './organisms/PageHeader'
export { CommandMenu, CommandProvider, useCommand } from './organisms/CommandMenu'
export type { CommandMenuProps, CommandItem }  from './organisms/CommandMenu'

export { DataTable }                           from './organisms/DataTable'
export type { DataTableProps, Column }         from './organisms/DataTable'

export { Modal, ModalController, useModal, ModalHeader, ModalBody, ModalFooter } from './organisms/Modal'
export type { ModalProps, ModalSize }          from './organisms/Modal'

export { Navbar, NavbarIconButton, NavbarDivider } from './organisms/Navbar'
export type { NavbarProps }                    from './organisms/Navbar'

export { NotificationCenter }                  from './organisms/NotificationCenter'
export type { NotificationCenterProps, Notification } from './organisms/NotificationCenter'

export { Sidebar }                             from './organisms/Sidebar'
export type { SidebarProps, SidebarGroup, SidebarNavItem } from './organisms/Sidebar'

export { ToastProvider, useToast }             from './organisms/Toast'
export type { ToastItem, ToastVariant, ToastPosition } from './organisms/Toast'

/* ── Product Components ─────────────────────────────────────────── */
export { ActivityFeed }                        from './product/ActivityFeed'
export type { ActivityFeedProps, ActivityItem, ActivityType } from './product/ActivityFeed'

export { FocusTimer, DEFAULT_PRESET }          from './product/FocusTimer'
export type { FocusTimerProps, FocusTimerPreset, TimerPhase } from './product/FocusTimer'

export { GoalCard }                            from './product/GoalCard'
export type { GoalCardProps, GoalStatus, GoalMilestone } from './product/GoalCard'

export { HabitTracker }                        from './product/HabitTracker'
export type { HabitTrackerProps, HabitEntry }  from './product/HabitTracker'

export { MoodHistory, MOOD_CONFIG }            from './product/MoodHistory'
export type { MoodHistoryProps, MoodEntry, MoodLevel } from './product/MoodHistory'

export { WellbeingScore }                      from './product/WellbeingScore'
export type { WellbeingScoreProps, WellbeingSize } from './product/WellbeingScore'

export { InsightCard }                         from './product/InsightCard'
export type { InsightCardProps, InsightCategory, InsightPriority, InsightAction } from './product/InsightCard'

export { TeamDashboard }                       from './product/TeamDashboard'
export type { TeamDashboardProps, TeamMember, TeamMetrics, MemberStatus } from './product/TeamDashboard'

export { OnboardingFlow }                      from './product/OnboardingFlow'
export type { OnboardingFlowProps, OnboardingData, OnboardingStepId } from './product/OnboardingFlow'
