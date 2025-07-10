import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useApp } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import logoutUser from '../utils/logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import { FaHeart } from "react-icons/fa";
import { format } from 'date-fns';
import axios from 'axios';
import BASE_URL from '../config';

export default function Navbar({ toggleSidebar }) {
  const { user, institute, loading } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showMasterItems, setShowMasterItems] = useState(false);
  const [showSettingsItems, setShowSettingsItems] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [attendanceState, setAttendanceState] = useState(null);
  const [userName, setUserName] = useState('');
   const [attendance, setAttendance] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const institute_uuid = localStorage.getItem("institute_uuid");

  const instituteTitle =
    institute?.institute_title || institute?.institute_name || 'Your Institute';

  const username = user?.name || 'User';
  const role = user?.role || '';

  useEffect(() => {
          if (user) {
              fetchAttendanceData(user);
          }
          if (user?.name) {
            setLoggedInUser(user.name);
            setUserName(user.name);
        }
      }, [user]);

      useEffect(() => {
              if (userName) {
                  initAttendanceState(userName);
              }
          }, [userName]);

          const initAttendanceState = async (userName) => {
        if (!userName) return;

        try {
            const response = await axios.get(`${BASE_URL}/api/attendance/getTodayAttendance/${userName}`);
            const data = response.data;

            if (!data.success || !Array.isArray(data.flow)) {
                setAttendanceState("In");
                return;
            }

            const flow = data.flow;
            const sequence = ["In", "Break", "Start", "Out"];
            const nextStep = sequence.find(step => !flow.includes(step));

            if (flow.includes("Out")) {
                setAttendanceState(null)
            } else {
                setAttendanceState(nextStep || null);
            }
        } catch (error) {
            console.error("Failed to fetch attendance state:", error);
            setAttendanceState("In");
        } finally {
            setShowButtons(true);
        }
    };

    const saveAttendance = async (type) => {
        if (!userName || !type) return;

        try {
            const formattedTime = new Date().toLocaleTimeString();

            const response = await axios.post(`${BASE_URL}/api/attendance/addAttendance/${institute_uuid}`, {
                User_name: userName,
                Type: type,
                Status: "Present",
                Time: formattedTime
            });

            if (response.data.success) {
                alert(`Attendance saved successfully for ${type}`);
                
                await initAttendanceState(userName);
                await fetchAttendanceData(userName); 
            } else {
                alert("Failed to save attendance.");
            }
        } catch (error) {
            console.error("Error saving attendance:", error);
        }
    };

     const fetchUserNames = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/GetUserList/${institute_uuid}`);
            const data = response.data;
            if (data.success) {
                const userLookup = {};
                data.result.forEach(user => {
                    userLookup[user.user_uuid] = (user.name || '').trim();
                });
                return userLookup;
            } else {
                console.error('Failed to fetch user names:', data);
                return {};
            }
        } catch (error) {
            console.error('Error fetching user names:', error);
            return {};
        }
    };

    const fetchAttendanceData = async (loggedInUser) => {
        try {
            const userLookup = await fetchUserNames();
            const attendanceResponse = await axios.get(`${BASE_URL}/api/attendance/GetAttendanceList`);
            const attendanceRecords = attendanceResponse.data.result || [];

            const formattedData = processAttendanceData(attendanceRecords, userLookup);

            setAttendance(formattedData);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const processAttendanceData = (data, userLookup) => {
        const groupedData = new Map();
        const todayDate = new Date().toISOString().split("T")[0];

        data.forEach(({ Date: recordDate, User, Employee_uuid }) => {
            if (!User || !Array.isArray(User)) return;
            const employeeUuid = (Employee_uuid || "").trim();
            const userName = userLookup[employeeUuid] || 'Unknown';
            const dateKey = new Date().toISOString().split("T")[0];
            const userDateKey = `${userName}-${dateKey}`;

            if (!groupedData.has(userDateKey)) {
                groupedData.set(userDateKey, {
                    Date: dateKey,
                    User_name: userName,
                    In: "N/A",
                    Break: "N/A",
                    Start: "N/A",
                    Out: "N/A",
                    TotalHours: "N/A"
                });
            }

            const record = groupedData.get(userDateKey);
            User.forEach(userEntry => {
                const time = (userEntry.Time || '').trim();
                switch (userEntry.Type) {
                    case "In": record.In = time; break;
                    case "Break": record.Break = time; break;
                    case "Start": record.Start = time; break;
                    case "Out": record.Out = time; break;
                }
            });
        });

        return Array.from(groupedData.values()).map((record) => {
            record.TotalHours = calculateWorkingHours(record.In, record.Out, record.Break, record.Start);
            return record;
        });
    };

    const calculateWorkingHours = (inTime, outTime, breakTime, startTime) => {
        if (!inTime || !outTime) return "N/A";
        const parseTime = (timeStr) => {
            if (!timeStr || timeStr === "N/A") return null;
            const [time, period] = timeStr.split(" ");
            const [hours, minutes] = time.split(":").map(Number);
            let hours24 = hours;
            if (period === "PM" && hours !== 12) hours24 += 12;
            if (period === "AM" && hours === 12) hours24 = 0;
            const now = new Date();
            now.setHours(hours24, minutes, 0, 0);
            return now;
        };
        const inDate = parseTime(inTime);
        const outDate = parseTime(outTime);
        const breakDate = parseTime(breakTime) || 0;
        const startDate = parseTime(startTime) || 0;
        if (!inDate || !outDate) return "N/A";
        let workDuration = (outDate - inDate) / 1000;
        if (breakDate && startDate) {
            const breakDuration = (startDate - breakDate) / 1000;
            workDuration -= breakDuration;
        }
        const hours = Math.floor(workDuration / 3600);
        const minutes = Math.floor((workDuration % 3600) / 60);
        const seconds = workDuration % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

  const toggleDrawer = () => setIsOpen(!isOpen);

  if (loading) {
    return (
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center z-30">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
      </header>
    );
  }

  return (
    <>
      <header className="bg-white  px-4 py-3 flex justify-between items-center z-30 relative">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={toggleSidebar}>
            {/* sidebar icon here if needed */}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="font-bold text-lg text-blue-600 hover:underline focus:outline-none"
          >
            {instituteTitle}
          </button>
        </div>

        <div className="flex items-center pr-3 gap-4 relative">

          {/* 1. Square 'F' */}
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => {/* your action here */ }}
          >
            <div className="w-8 h-8 bg-blue-200 flex items-center justify-center rounded text-lg font-bold text-blue-700">
              F
            </div>
          </button>

          {/* 2. Heart Icon */}
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => {/* your action here */ }}
          >
            <FaHeart className="text-2xl text-red-500" />
          </button>

          {/* 3. User Icon */}
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <AccountCircleIcon className="text-3xl text-blue-500" />
          </button>

          {/* Drawer/menu icon */}
          <button onClick={toggleDrawer} className="text-2xl focus:outline-none">
            <MenuIcon />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute top-12 right-0 w-80 bg-white rounded-lg  z-50 p-4">
                <div className="mb-2">
                  <div className="font-semibold text-gray-800">{username}</div>
                  {role && <div className="text-xs text-gray-500 capitalize">{role}</div>}
                </div>
                {showButtons && attendanceState && (
  <div className="w-full">
    <button
      onClick={async () => {
        setShowButtons(false);
        await saveAttendance(attendanceState);
        setShowButtons(true);
      }}
      disabled={!showButtons}
      className={`w-full text-white font-semibold py-1.5 px-3 text-sm rounded-md transition-all ${
        showButtons
          ? "bg-green-500 hover:bg-green-600 cursor-pointer"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {showButtons
        ? `${userName} ${attendanceState} - ${format(new Date(), 'dd MMM yyyy')}`
        : "Saving..."}
    </button>
  </div>
)}

                <button
                  onClick={logoutUser}
                  className="w-full text-left px-4 py-2 rounded bg-red-50 hover:bg-red-100 text-red-600 font-medium mt-2"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Right Drawer */}
      {isOpen && (
        <>
          <div className="absolute top-12 right-0 w-56 bg-white rounded-lg  z-50 p-4">
            {/* Master Section */}
            <div>
              <div
                className="font-semibold text-gray-700 mb-2 cursor-pointer hover:underline"
                onClick={() => setShowMasterItems(!showMasterItems)}
              >
                Master {showMasterItems}
              </div>
              {showMasterItems && (
                <div className="space-y-2 pl-2">
                  {[
                    { path: '/dashboard/Courses', label: 'Courses', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/Batches', label: 'Batches', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/allbatches', label: 'Manage Batches', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/allexams', label: 'Manage Exams', icon: <EventNoteIcon fontSize="small" /> },
                    { path: '/dashboard/education', label: 'Education', icon: <SchoolIcon fontSize="small" /> },
                    { path: '/dashboard/exam', label: 'Exam', icon: <EventNoteIcon fontSize="small" /> },
                  ].map((item) => (
                    <div
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div>
              <div
                className="font-semibold text-gray-700 mb-2 cursor-pointer hover:underline"
                onClick={() => setShowSettingsItems(!showSettingsItems)}
              >
                Settings {showSettingsItems}
              </div>
              {showSettingsItems && (
                <div className="space-y-2 pl-2">
                  <div
                    onClick={() => {
                      navigate('/dashboard/user');
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                  >
                    <GroupIcon fontSize="small" />
                    User
                  </div>

                  {user?.role === 'admin' && (
                    <div
                      onClick={() => {
                        navigate('/dashboard/instituteProfile');
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                    >
                      <EventNoteIcon fontSize="small" />
                      Profile
                    </div>
                  )}

                  {(user?.role === 'owner' || user?.role === 'super_admin') && (
                    <>
                      <div
                        onClick={() => {
                          navigate('/dashboard/Owner');
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                      >
                        <EventNoteIcon fontSize="small" />
                        Owner
                      </div>
                      <div
                        onClick={() => {
                          navigate('/dashboard/institutes');
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                      >
                        <EventNoteIcon fontSize="small" />
                        Institutes
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Overlay */}
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-25 z-40" />
        </>
      )}
    </>
  );
}
