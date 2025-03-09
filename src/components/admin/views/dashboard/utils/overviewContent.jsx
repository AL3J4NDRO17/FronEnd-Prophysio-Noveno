import BlogList from "./activity/blogList"
import AppointmentsList from "./activity/appointmentList"
import TestimonialsList from "./activity/testimonialList"
import ActivityList from "./activity/activityList"

export default function OverviewContent() {
  return (
    <div className="adminDashboard-tab-content">
      <div className="adminDashboard-overview-grid">
        <AppointmentsList />
        <ActivityList />
      </div>

      <div className="adminDashboard-bottom-grid">
        <BlogList />
        <TestimonialsList />
      </div>
    </div>
  )
}

