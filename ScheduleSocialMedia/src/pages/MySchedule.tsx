import { useEffect, useState, type ReactNode } from "react";

type Props = {
  /** If true, renders ONLY the schedule grid (no full-page wrappers / edit UI) */
  embedded?: boolean;
};

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---- time helpers (supports 3:30 / 9:50 etc.) ----
const parseTimeHHMM = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const formatHourLabel = (h24: number) => {
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12} ${ampm}`;
};

const formatTime12 = (hhmm: string) => {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  const mm = String(m).padStart(2, "0");
  return `${h12}:${mm} ${ampm}`;
};

interface ButtonProps {
  children: ReactNode;
  color?: "primary" | "secondary" | "danger" | "success" | "warning";
  onClick?: () => void;
}

const Button = ({ children, color = "primary", onClick }: ButtonProps) => {
  return (
    <button
      className={"btn btn-" + color}
      onClick={onClick}
      style={{ marginRight: 10 }}
      type="button"
    >
      {children}
    </button>
  );
};

type EventItem = {
  id: string;
  title: string;
  days: Day[];
  start: string; // "HH:MM" 24hr (input uses this)
  end: string; // "HH:MM" 24hr
};

const START_HOUR = 8;
const END_HOUR = 20; // 8pm

// nice colors
const classColors: { [key: string]: string } = {};
const palette = [
  "#fecaca",
  "#bfdbfe",
  "#bbf7d0",
  "#fde68a",
  "#ddd6fe",
  "#fbcfe8",
  "#fed7aa",
  "#a7f3d0",
  "#fcd34d",
  "#c7d2fe",
];

const getColor = (title: string) => {
  if (!classColors[title]) {
    const index = Object.keys(classColors).length % palette.length;
    classColors[title] = palette[index];
  }
  return classColors[title];
};

const safeUUID = () => {
  // crypto.randomUUID() is supported in modern browsers, but just in case:
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function MySchedule({ embedded = false }: Props) {
  const [showUpload, setShowUpload] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // store real events (not per-cell)
  const [events, setEvents] = useState<EventItem[]>([]);
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);

  const [title, setTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState<Day[]>(["Mon"]);

  // HTML time input uses 24-hour "HH:MM"
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:00");

  const hourStarts = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i
  );

  const handleSaveChanges = () => {
    setSavedEvents(events);
    localStorage.setItem("savedEvents", JSON.stringify(events));  
    setShowSavedMessage(true);
  };

  useEffect(() => {
    const stored = localStorage.getItem("savedEvents");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as EventItem[];
        setSavedEvents(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSavedEvents([]);
      }
    }
  }, []);

  const handleReset = () => {
    setEvents([]);
    setSavedEvents([]);
    setShowSavedMessage(false);
    setTitle("");
    setSelectedDays(["Mon"]);
    setStart("08:00");
    setEnd("09:00");
    localStorage.removeItem("savedEvents");
  };

  const toggleDay = (d: Day) => {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleAddClass = () => {
    if (!title.trim()) return;
    if (selectedDays.length === 0) return;

    const s = parseTimeHHMM(start);
    const e = parseTimeHHMM(end);
    if (e <= s) return;

    // keep inside our schedule window
    const minStart = START_HOUR * 60;
    const maxEnd = (END_HOUR + 1) * 60; // allow ending up to 9:00 PM
    if (s < minStart || e > maxEnd) return;

    const newEvent: EventItem = {
      id: safeUUID(),
      title: title.trim(),
      days: selectedDays,
      start,
      end,
    };

    setEvents((prev) => [...prev, newEvent]);
    setTitle("");
    setShowSavedMessage(false);
  };

  // shared schedule grid component
  const ScheduleGrid = ({
    data,
    compact = false,
  }: {
    data: EventItem[];
    compact?: boolean;
  }) => {
    const rowHeight = compact ? 44 : 60; // smaller on profile
    const pxPerMinute = rowHeight / 60; // keeps hours, but supports minutes
    const gridHeight = hourStarts.length * rowHeight;

    const computeEventStyle = (ev: EventItem) => {
      const s = parseTimeHHMM(ev.start);
      const e = parseTimeHHMM(ev.end);
      const dayStart = hourStarts[0] * 60;

      const topMinutes = s - dayStart;
      const durationMinutes = Math.max(12, e - s);

      return {
        top: Math.round(topMinutes * pxPerMinute),
        height: Math.round(durationMinutes * pxPerMinute),
      };
    };

    const colMin = compact ? 110 : 140; // ✅ tighter columns on profile so Sun fits
const colTemplate = `repeat(${days.length}, minmax(${colMin}px, 1fr))`;

    return (
      <div style={{ width: "100%" }}>
        {/* header row (Time + days headers) */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 90, minWidth: 90 }}>
            <div style={{ ...thStyle, height: 46 }}>Time</div>
          </div>

          <div style={{ flex: 1, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: colTemplate,
                borderLeft: "1px solid #ddd",
                borderRight: "1px solid #ddd",
              }}
            >
              {days.map((d) => (
                <div
                  key={d}
                  style={{
                    ...thStyle,
                    height: 46,
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* body (ONE shared vertical scroll for time + grid) */}
        <div
          style={{
            display: "flex",
            gap: 12,
            width: "100%",
            // ✅ embedded/compact should NOT be its own vertical scroll box
            maxHeight: compact ? undefined : undefined,
            overflowY: "visible",
          }}
        >
          {/* time column */}
          <div style={{ width: 90, minWidth: 90 }}>
            {hourStarts.map((h) => (
              <div
              key={h}
              style={{
                ...timeRowStyle,
                height: rowHeight,
                display: "flex",
                alignItems: "center",
              }}
            >
                {formatHourLabel(h)}
              </div>
            ))}
          </div>

          {/* days area (NO vertical scroll here) */}
          <div style={{ flex: 1, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: colTemplate,
                borderLeft: "1px solid #ddd",
                borderRight: "1px solid #ddd",
              }}
            >
              {days.map((d) => (
                <div
                  key={`col-${d}`}
                  style={{
                    position: "relative",
                    height: gridHeight,
                    borderRight: "1px solid #ddd",
                    background: "white",
                  }}
                >
                  {/* background hour rows */}
                  {hourStarts.map((h) => (
                    <div
                      key={`${d}-bg-${h}`}
                      style={{
                        height: rowHeight,
                        borderBottom: "1px solid #eee",
                        boxSizing: "border-box",
                      }}
                    />
                  ))}

                  {/* events */}
                  {data
                    .filter((ev) => ev.days.includes(d))
                    .map((ev) => {
                      const { top, height } = computeEventStyle(ev);
                      return (
                        <div
                          key={`${ev.id}-${d}`}
                          style={{
                            position: "absolute",
                            top,
                            height,
                            left: 8,
                            right: 8,
                            background: getColor(ev.title),
                            borderRadius: 16,
                            boxSizing: "border-box",
                            padding: compact ? "8px 10px" : "10px 12px",
                            lineHeight: 1.15,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                          title={`${ev.title} ${formatTime12(
                            ev.start
                          )} – ${formatTime12(ev.end)}`}
                        >
                          <div
                            style={{
                              fontSize: compact ? 13 : 14,
                              fontWeight: 900,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ev.title}
                          </div>

                          <div
                            style={{
                              fontSize: compact ? 11 : 12,
                              fontWeight: 800,
                              opacity: 0.95,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {formatTime12(ev.start)} – {formatTime12(ev.end)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>

            <div style={{ height: compact ? 6 : 10 }} />
          </div>
        </div>
      </div>
    );
  };

  // ---------- EMBEDDED VIEW (Profile preview) ----------
  if (embedded) {
    return (
      <div style={{ marginTop: 10, width: "100%" }}>
        <ScheduleGrid data={savedEvents} compact />
      </div>
    );
  }

  // ---------- FULL PAGE VIEW (/myschedule) ----------
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto pt-10">
        <div className="bg-white rounded-xl shadow-md p-6">
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
                <div style={{ marginTop: 10 }}>
                  <ScheduleGrid data={savedEvents} />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 50 }} />

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
                  background: "#1FA64A",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                }}
                type="button"
              >
                X
              </button>

              <div
                style={{ display: "flex", gap: 30, alignItems: "flex-start" }}
              >
                {/* LEFT = TABLE */}
                <div style={{ flex: 1, overflowX: "auto" }}>
                  <ScheduleGrid data={events} />
                </div>

                {/* RIGHT = CONTROLS */}
                <div style={{ width: 260 }}>
                  <div style={{ marginTop: 20 }} />

                  <input
                    placeholder="Class title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", marginBottom: 10 }}
                  />

                  {/* multi-day selection */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>Days</div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 6,
                      }}
                    >
                      {days.map((d) => (
                        <label
                          key={d}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDays.includes(d)}
                            onChange={() => toggleDay(d)}
                          />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* time inputs */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>
                        Start
                      </div>
                      <input
                        type="time"
                        step={600}
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>
                        End
                      </div>
                      <input
                        type="time"
                        step={600}
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <Button onClick={handleAddClass}>+Add</Button>
                    <Button color="danger" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>

                  <Button color="success" onClick={handleSaveChanges}>
                    Save Schedule
                  </Button>

                  {showSavedMessage && (
                    <div
                      style={{
                        marginTop: 10,
                        fontWeight: 600,
                        color: "#1FA64A",
                      }}
                    >
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
}

const thStyle = {
  border: "1px solid #ddd",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
  fontWeight: 800,
  color: "#111827",
  boxSizing: "border-box" as const, 
};

const timeRowStyle = {
  borderLeft: "1px solid #ddd",
  borderRight: "1px solid #ddd",
  borderBottom: "1px solid #eee",
  padding: "8px 6px",
  fontWeight: 800,
  background: "#f9fafb",
  color: "#111827",
  boxSizing: "border-box" as const, 
};
