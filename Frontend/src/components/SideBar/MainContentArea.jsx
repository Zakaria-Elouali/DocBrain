// import Dashboard from "@/pages/Dashboard/dashboard";
// import AppointmentModal from "components/SideBar/calendar/AppointmentModal";
//
// export const MainContentArea = ({ activePanel }) => {
//     return (
//         <div className="main-content-area fixed top-[50px] right-0 w-[calc(100%-310px)] h-[calc(100vh-50px)] bg-white shadow-md z-20">
//             {activePanel === 'dashboard' && (
//                 <div className="dashboard-wrapper w-full h-full overflow-auto">
//                     <Dashboard />
//                 </div>
//             )}
//             {activePanel === 'calendar' && (
//                 <div id="calendar-wrapper" className="w-full h-full">
//                     <Calendar
//                         appointments={appointments}
//                         currentDate={currentDate}
//                         selectedDate={selectedDate}
//                         onDateChange={setCurrentDate}
//                         onSelectedDateChange={setSelectedDate}
//                         onNewAppointment={handleNewAppointment}
//                         onEditAppointment={handleEditAppointment}
//                     />
//                     <AppointmentModal
//                         isOpen={modalOpen}
//                         onClose={handleModalClose}
//                         appointment={selectedAppointment}
//                         mode={modalMode}
//                     />
//                 </div>
//             )}
//             {/* Add other main content components */}
//         </div>
//     );
// };