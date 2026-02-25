import { useState } from "react";

interface Props {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "danger";
  onClick?: () => void;
}

const Button = ({ children, color = "primary", onClick }: Props) => {
  return (
    <button className={"btn btn-" + color} onClick={onClick}>
      {children}
    </button>
  );
};

const MySchedule = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const [schedule, setSchedule] = useState<{ [key: string]: string }>({});
  const [savedSchedule, setSavedSchedule] = useState<{ [key: string]: string }>(
    {},
  );

  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Mon");
  const [start, setStart] = useState("8:00 am");
  const [end, setEnd] = useState("9:00 am");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = [
    "8:00 am",
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
  ];

  const handleAddClass = () => {
    if (!title) return;

    const startIndex = times.findIndex((t) => t === start);
    const endIndex = times.findIndex((t) => t === end);

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) return;

    const updated = { ...schedule };

    for (let i = startIndex; i <= endIndex; i++) {
      updated[`${day}-${times[i]}`] = title;
    }

    setSchedule(updated);
    setTitle("");
  };

  const handleReset = () => {
    setSchedule({});
    setSavedSchedule({});
    setShowSavedMessage(false);
    setTitle("");
    setDay("Mon");
    setStart("8:00 am");
    setEnd("9:00 am");
  };

  const handleSaveSchedule = () => {
    setSavedSchedule(schedule);
    setShowSavedMessage(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto pt-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-300 rounded-xl"></div>
          </div>

          {/* MAIN PAGE */}
          {!showUpload && (
            <div className="mt-6">
              <Button
                color="primary"
                onClick={() => {
                  setShowUpload(true);
                  setShowSavedMessage(false);
                }}
              >
                ✏️ Edit My Schedule
              </Button>

              <div style={{ marginTop: 20 }}>
                <strong>My Schedule</strong>

                <div style={{ overflowX: "auto", marginTop: 10 }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      tableLayout: "fixed",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ ...thStyle, width: 90 }}>Time / Day</th>
                        {days.map((d) => (
                          <th key={d} style={thStyle}>
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {times.map((time) => (
                        <tr key={time}>
                          <td style={timeStyle}>{time}</td>

                          {days.map((d) => {
                            const key = `${d}-${time}`;
                            const value = savedSchedule[key];

                            return (
                              <td
                                key={key}
                                style={{
                                  ...tdStyle,
                                  textAlign: "center",
                                  fontWeight: 600,
                                }}
                              >
                                {value || ""}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* EDIT PAGE */}
          {showUpload && (
            <div className="mt-6 border rounded-lg p-6 bg-gray-50 relative">
              <button
                onClick={() => {
                  setShowUpload(false);
                  setShowSavedMessage(false);
                }}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "#1FA64A",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                }}
              >
                X
              </button>

              <div
                style={{ display: "flex", gap: 30, alignItems: "flex-start" }}
              >
                {/* LEFT: TABLE */}
                <div style={{ flex: 1, overflowX: "auto" }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      tableLayout: "fixed",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ ...thStyle, width: 90 }}>Time / Day</th>
                        {days.map((d) => (
                          <th key={d} style={thStyle}>
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {times.map((time) => (
                        <tr key={time}>
                          <td style={timeStyle}>{time}</td>

                          {days.map((d) => {
                            const key = `${d}-${time}`;
                            const value = schedule[key];

                            return (
                              <td
                                key={key}
                                style={{
                                  ...tdStyle,
                                  textAlign: "center",
                                  fontWeight: 600,
                                }}
                              >
                                {value || ""}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* RIGHT: CONTROLS */}
                <div style={{ width: 260 }}>
                  <input
                    placeholder="Class title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", marginBottom: 10 }}
                  />

                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    style={{ width: "100%", marginBottom: 10 }}
                  >
                    {days.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    style={{ width: "100%", marginBottom: 10 }}
                  >
                    {times.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  <select
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    style={{ width: "100%", marginBottom: 15 }}
                  >
                    {times.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  <div style={{ marginBottom: 10 }}>
                    <Button onClick={handleAddClass}>+ Add</Button>
                    <Button color="danger" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>

                  <Button color="primary" onClick={handleSaveSchedule}>
                    Save Schedule
                  </Button>

                  {showSavedMessage && (
                    <div style={{ marginTop: 10, fontWeight: 600 }}>
                      ✅ Schedule saved
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- styles ---------- */

const thStyle = {
  border: "1px solid #ddd",
  padding: 8,
  background: "#f3f4f6",
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
  fontWeight: 700,
  height: 50,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: 4,
  height: 48,
};

const timeStyle = {
  border: "1px solid #ddd",
  padding: "6px 4px",
  fontWeight: 600,
  background: "#f9fafb",
  width: 90,
  minWidth: 90,
  maxWidth: 90,
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
};

export default MySchedule;
