import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  saveSchedule,
  getMySchedule,
  getUserSchedule,
} from "../apiCalls/schedule";

import { useParams } from "react-router-dom";

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
  return `${h12}:${mm}${ampm}`;
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
  const [showUpload, _setShowUpload] = useState(true);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // store real events (not per-cell)
  const [events, setEvents] = useState<EventItem[]>([]);
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);

  const navigate = useNavigate();
  const { userId } = useParams();

  if (!events) {
    return <div style={{ padding: 40 }}>Loading schedule...</div>;
  }

  const [title, setTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState<Day[]>(["Mon"]);

  // HTML time input uses 24-hour "HH:MM"
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:00");

  const hourStarts = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i,
  );

  const handleSaveChanges = async () => {
    console.log("Saving events:", events);

    try {
      const response = await saveSchedule(events);
      console.log("Server response:", response);

      if (response.success) {
        setSavedEvents(events);
        setShowSavedMessage(true);
      } else {
        console.log("Error:", response.message);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        let response;

        if (userId) {
          // viewing someone else's schedule
          response = await getUserSchedule(userId);
        } else {
          // viewing your own schedule
          response = await getMySchedule();
        }

        if (response.success) {
          const schedule = response.data?.schedule || response.data || [];

          setEvents(schedule);
          setSavedEvents(schedule);
        } else {
          setEvents([]);
          setSavedEvents([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSchedule();
  }, [userId]);

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
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
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
    data = [],
    compact = false,
  }: {
    data: EventItem[];
    compact?: boolean;
  }) => {
    // hover vs. selected: hover shows temporary bring-to-front, selected persists
    const [hoverEventId, setHoverEventId] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const rowHeight = compact ? 44 : 60; // smaller on profile
    const pxPerMinute = rowHeight / 60; // keeps hours, but supports minutes
    const gridHeight = hourStarts.length * rowHeight;

    const computeEventStyle = (ev: EventItem) => {
      const s = parseTimeHHMM(ev.start);
      const e = parseTimeHHMM(ev.end);
      const dayStart = hourStarts[0] * 60;

      const topMinutes = s - dayStart;
      // Use the actual duration (end - start). Previous code added 60 minutes
      // which made 1-hour events render as 2 hours. Keep a small minimum so
      // very short events are visible.
      const durationMinutes = Math.max(30, e - s);

      return {
        top: Math.round(topMinutes * pxPerMinute),
        height: Math.round(durationMinutes * pxPerMinute) + 1,
      };
    };

    const colMin = compact ? 130 : 160; // ✅ tighter columns on profile so Sun fits
    const colTemplate = `repeat(${days.length}, minmax(${colMin}px, 1fr))`;

    return (
      <div style={{ width: "100%", overflowX: "auto" }}>
        {/* header row (Time + days headers) */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 90, minWidth: 90 }}>
            <div style={{ ...thStyle, height: 46 }}>Time</div>
          </div>

          <div style={{ flex: 1 }}>
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
          <div style={{ flex: 1 }}>
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

                  {/* events: compute column layout so overlapping events sit side-by-side */}
                  {(() => {
                    const evs = (data || []).filter((ev) =>
                      ev.days?.includes(d),
                    );

                    // map of id -> { colIndex, totalCols }
                    const layoutMap: Record<
                      string,
                      { col: number; cols: number }
                    > = {};

                    if (evs.length > 0) {
                      // convert to items with numeric times
                      const items = evs
                        .map((ev) => ({
                          ev,
                          start: parseTimeHHMM(ev.start),
                          end: parseTimeHHMM(ev.end),
                        }))
                        .sort((a, b) => a.start - b.start || b.end - a.end);

                      const columns: Array<typeof items> = [];

                      for (const item of items) {
                        let placed = false;
                        for (let i = 0; i < columns.length; i++) {
                          const col = columns[i];
                          const last = col[col.length - 1];
                          // no overlap if this item's start >= last.end
                          if (item.start >= last.end) {
                            col.push(item);
                            layoutMap[item.ev.id] = { col: i, cols: 0 };
                            placed = true;
                            break;
                          }
                        }

                        if (!placed) {
                          columns.push([item]);
                          layoutMap[item.ev.id] = {
                            col: columns.length - 1,
                            cols: 0,
                          };
                        }
                      }

                      const total = columns.length;
                      // fill total cols for each mapped id
                      for (let i = 0; i < columns.length; i++) {
                        for (const it of columns[i]) {
                          layoutMap[it.ev.id].cols = total;
                        }
                      }
                    }

                    return evs.map((ev) => {
                      const { top, height } = computeEventStyle(ev);
                      const layout = layoutMap[ev.id] || { col: 0, cols: 1 };
                      const colIndex = layout.col;
                      const totalCols = Math.max(1, layout.cols);

                      const leftPercent = (colIndex / totalCols) * 100;
                      const widthPercent = 100 / totalCols;

                      return (
                        <div
                          key={`${ev.id}-${d}`}
                          onMouseEnter={() => setHoverEventId(ev.id)}
                          onMouseLeave={() => setHoverEventId(null)}
                          onClick={() =>
                            setSelectedEventId((prev) =>
                              prev === ev.id ? null : ev.id,
                            )
                          }
                          style={{
                            position: "absolute",
                            top,
                            // when selected we want a square card (aspect ratio 1:1)
                            // otherwise use the computed duration height
                            height:
                              selectedEventId === ev.id ? undefined : height,
                            minHeight: height,
                            // keep event inside its computed column bounds
                            left: `${leftPercent}%`,
                            // selected card becomes a bit wider within its column
                            width:
                              selectedEventId === ev.id
                                ? `calc(${widthPercent}% - 8px)`
                                : `calc(${widthPercent}% - 16px)`,
                            marginLeft: 8,
                            background: getColor(ev.title),
                            borderRadius: 16,
                            boxSizing: "border-box",
                            padding: compact ? "8px 10px" : "10px 12px",
                            lineHeight: 1.15,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                            // allow overflow visible for selected so the popover can render
                            overflow:
                              selectedEventId === ev.id ? "visible" : "hidden",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            zIndex:
                              hoverEventId === ev.id ||
                              selectedEventId === ev.id
                                ? 2000
                                : 1,
                            cursor: "pointer",
                            // aspect-ratio will make the selected card square (width -> height)
                            ...(selectedEventId === ev.id
                              ? {
                                  aspectRatio: "1 / 1",
                                  // ensure it doesn't grow past the bottom of the grid
                                  maxHeight: `${Math.max(40, gridHeight - top - 8)}px`,
                                }
                              : {}),
                          }}
                          title={`${ev.title} ${formatTime12(
                            ev.start,
                          )} – ${formatTime12(ev.end)}`}
                        >
                          {selectedEventId === ev.id ? (
                            // when selected show a very minimal card to keep the grid clean;
                            // full details live in the popover to the right
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                fontSize: compact ? 12 : 13,
                                fontWeight: 900,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                padding: "6px",
                              }}
                            >
                              {ev.title.length > 10
                                ? `${ev.title.slice(0, 10)}…`
                                : ev.title}
                            </div>
                          ) : (
                            <>
                              <div
                                style={{
                                  // slightly reduce font when multiple columns to avoid overlap
                                  fontSize: compact
                                    ? 13
                                    : totalCols > 1
                                      ? 12
                                      : 14,
                                  fontWeight: 900,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  paddingRight: 6,
                                }}
                              >
                                {ev.title}
                              </div>

                              <div
                                style={{
                                  fontSize: compact
                                    ? 11
                                    : totalCols > 1
                                      ? 10
                                      : 12,
                                  fontWeight: 800,
                                  opacity: 0.95,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  paddingRight: 6,
                                }}
                              >
                                {formatTime12(ev.start)}–{formatTime12(ev.end)}
                              </div>
                            </>
                          )}
                          {/* Popover with full details (renders when selected) */}
                          {selectedEventId === ev.id && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: `calc(100% + 8px)`,
                                width: 220,
                                background: "white",
                                border: "1px solid rgba(0,0,0,0.08)",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                                borderRadius: 8,
                                padding: 10,
                                zIndex: 3000,
                                color: "#111827",
                              }}
                            >
                              <div style={{ fontWeight: 900, marginBottom: 6 }}>
                                {ev.title}
                              </div>
                              <div
                                style={{ fontWeight: 800, color: "#374151" }}
                              >
                                {formatTime12(ev.start)} –{" "}
                                {formatTime12(ev.end)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
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
      <div style={{ width: "100%", position: "relative" }}>
        {userId && (
          <button
            onClick={() => navigate("/find-users")}
            style={{
              position: "fixed",
              top: 12,
              right: 12,
              background: "#1FA64A",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "4px 8px",
              zIndex: 1000,
            }}
          >
            X
          </button>
        )}

        {/* push ONLY the table down */}
        <div style={{ marginTop: 60 }}>
          <ScheduleGrid data={savedEvents} compact />
        </div>
      </div>
    );
  }

  // ---------- FULL PAGE VIEW (/myschedule) ----------
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto pt-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div style={{ marginTop: 50 }} />

          {showUpload && (
            <div className="mt-6 border rounded-lg p-6 bg-gray-50 relative">
              <button
                onClick={() => {
                  navigate("/profile");
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
                  <ScheduleGrid data={events || []} />
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
