"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const orgAgents = [
    { id: "a1", name: "SkyBot", owner: "Rahul Sharma", dept: "Flights", status: "online", color: "#4f8cff" },
    { id: "a2", name: "StayFinder", owner: "Priya Patel", dept: "Hotels", status: "online", color: "#a855f7" },
    { id: "a3", name: "RideSync", owner: "Arjun Mehta", dept: "Cabs", status: "offline", color: "#10b981" },
    { id: "a4", name: "TripPlanner", owner: "Sneha Iyer", dept: "Itinerary", status: "online", color: "#f59e0b" },
    { id: "a5", name: "PriceHawk", owner: "Vikram Singh", dept: "Deals & Pricing", status: "away", color: "#ec4899" },
    { id: "a6", name: "VisaAssist", owner: "Ananya Das", dept: "Documentation", status: "online", color: "#06b6d4" },
    { id: "a7", name: "LoyaltyPro", owner: "Karan Joshi", dept: "Rewards", status: "offline", color: "#8b5cf6" },
    { id: "a8", name: "PayGate", owner: "Deepa Nair", dept: "Payments", status: "online", color: "#f43f5e" },
  ];
  const filteredAgents = orgAgents.filter((a) => a.name.toLowerCase().includes(agentSearch.toLowerCase()) || a.owner.toLowerCase().includes(agentSearch.toLowerCase()) || a.dept.toLowerCase().includes(agentSearch.toLowerCase()));

  // Agent detail data (mock)
  const agentDetailData: Record<string, { currentTask: { title: string; progress: number; status: string } | null; liveConversation: { withAgent: string; withColor: string; messages: { from: string; text: string; time: string }[]; isTyping?: string } | null; history: { id: string; action: string; time: string; type: "task" | "chat" | "analysis" | "report" }[]; conversations: { id: string; withAgent: string; withColor: string; messages: { from: string; text: string; time: string }[] }[] }> = {
    a1: {
      currentTask: { title: "Searching best fares: Mumbai → London (Mar 15-22)", progress: 68, status: "Comparing Airlines" },
      history: [
        { id: "h1", action: "Found 12 flight options for DEL→DXB route", time: "2 min ago", type: "task" },
        { id: "h2", action: "Coordinated with StayFinder for hotel bundling", time: "15 min ago", type: "chat" },
        { id: "h3", action: "Analyzed fare trends for BOM→LHR route", time: "1 hr ago", type: "analysis" },
        { id: "h4", action: "Generated weekly flight booking report", time: "3 hrs ago", type: "report" },
        { id: "h5", action: "Processed 8 group booking requests", time: "5 hrs ago", type: "task" },
      ],
      conversations: [
        { id: "c1", withAgent: "StayFinder", withColor: "#a855f7", messages: [
          { from: "SkyBot", text: "Hey StayFinder, I have a passenger arriving in Dubai on Mar 15. Can you check hotels near Downtown?", time: "15 min ago" },
          { from: "StayFinder", text: "Sure! Found 6 options near Downtown Dubai. Best deal: Marriott at ₹8,500/night. Want me to bundle it?", time: "14 min ago" },
          { from: "SkyBot", text: "Yes, bundle it with the Emirates flight. Total package will save them ₹12,000.", time: "13 min ago" },
        ]},
        { id: "c2", withAgent: "RideSync", withColor: "#10b981", messages: [
          { from: "SkyBot", text: "RideSync, can you arrange airport pickup at DXB Terminal 3 on Mar 15, 8:30 PM?", time: "2 hrs ago" },
          { from: "RideSync", text: "Done! Sedan booked for DXB T3 to Downtown Dubai Marriott. Driver details shared.", time: "2 hrs ago" },
        ]},
      ],
      liveConversation: {
        withAgent: "StayFinder", withColor: "#a855f7",
        messages: [
          { from: "SkyBot", text: "Found a great Emirates deal: BOM→LHR at ₹38,500 roundtrip. Departure 6:15 AM, arrives 11:40 AM.", time: "Just now" },
          { from: "StayFinder", text: "Nice! I have a Hilton near Heathrow at ₹6,200/night. Should I bundle it as a package?", time: "Just now" },
          { from: "SkyBot", text: "Yes, bundle it. Also check if there's a lounge access upgrade available.", time: "Just now" },
          { from: "StayFinder", text: "Checking lounge options now. Meanwhile, the package saves ₹15,800 vs booking separately.", time: "Just now" },
        ],
        isTyping: "SkyBot",
      },
    },
    a2: {
      currentTask: { title: "Comparing 23 hotels in Goa for weekend package", progress: 42, status: "Filtering Results" },
      liveConversation: {
        withAgent: "PriceHawk", withColor: "#ec4899",
        messages: [
          { from: "StayFinder", text: "PriceHawk, I see Taj Exotica dropped to ₹11,200/night. Is this the lowest in 30 days?", time: "Just now" },
          { from: "PriceHawk", text: "Yes! 22% below average. Book now — this rate expires in 2 hours.", time: "Just now" },
          { from: "StayFinder", text: "Locking it in for the customer. Any cashback offers available?", time: "Just now" },
        ],
        isTyping: "PriceHawk",
      },
      history: [
        { id: "h1", action: "Booked Taj Resort for 4 guests (Mar 20-23)", time: "5 min ago", type: "task" },
        { id: "h2", action: "Synced availability with VisaAssist for international stays", time: "30 min ago", type: "chat" },
        { id: "h3", action: "Analyzed hotel pricing trends in Goa region", time: "2 hrs ago", type: "analysis" },
      ],
      conversations: [
        { id: "c1", withAgent: "VisaAssist", withColor: "#06b6d4", messages: [
          { from: "StayFinder", text: "VisaAssist, the Thailand hotel booking needs passport verification. Can you check?", time: "30 min ago" },
          { from: "VisaAssist", text: "Verified! Passport is valid till 2028. Thailand visa-on-arrival eligible. You're clear to book.", time: "28 min ago" },
        ]},
      ],
    },
    a3: {
      currentTask: null,
      liveConversation: null,
      history: [
        { id: "h1", action: "Dispatched 15 airport cabs across Mumbai", time: "1 hr ago", type: "task" },
        { id: "h2", action: "Generated daily ride analytics report", time: "3 hrs ago", type: "report" },
        { id: "h3", action: "Coordinated with SkyBot for flight-aligned pickups", time: "5 hrs ago", type: "chat" },
      ],
      conversations: [],
    },
    a4: {
      currentTask: { title: "Building 7-day Rajasthan itinerary for a family of 5", progress: 85, status: "Almost Done" },
      liveConversation: {
        withAgent: "SkyBot", withColor: "#4f8cff",
        messages: [
          { from: "TripPlanner", text: "SkyBot, I need flights from Delhi to Udaipur on Day 4 and Jaipur to Delhi on Day 7.", time: "Just now" },
          { from: "SkyBot", text: "IndiGo DEL→UDR at ₹4,200 (8 AM) and JAI→DEL at ₹3,800 (6 PM). Both confirmed available.", time: "Just now" },
          { from: "TripPlanner", text: "Perfect, add them to the itinerary. Total flight cost for 5 pax?", time: "Just now" },
          { from: "SkyBot", text: "Total: ₹40,000 for all 5 passengers. Baggage included.", time: "Just now" },
        ],
        isTyping: "TripPlanner",
      },
      history: [
        { id: "h1", action: "Added Udaipur lake tour to Day 4 plan", time: "10 min ago", type: "task" },
        { id: "h2", action: "Generated detailed cost estimation report", time: "1 hr ago", type: "report" },
      ],
      conversations: [
        { id: "c1", withAgent: "PayGate", withColor: "#f43f5e", messages: [
          { from: "TripPlanner", text: "PayGate, the Rajasthan trip total is ₹1,85,000. Can you set up EMI options?", time: "45 min ago" },
          { from: "PayGate", text: "Done! 3-month no-cost EMI available via HDFC & ICICI. Link shared with the customer.", time: "40 min ago" },
        ]},
      ],
    },
    a5: {
      currentTask: { title: "Tracking price drops on Delhi→Singapore flights", progress: 30, status: "Monitoring" },
      liveConversation: null,
      history: [
        { id: "h1", action: "Detected 18% fare drop on BOM→BKK route", time: "20 min ago", type: "analysis" },
        { id: "h2", action: "Sent price alert to 42 subscribed users", time: "2 hrs ago", type: "report" },
      ],
      conversations: [],
    },
    a6: {
      currentTask: { title: "Processing 8 visa applications for Southeast Asia", progress: 55, status: "In Progress" },
      liveConversation: {
        withAgent: "StayFinder", withColor: "#a855f7",
        messages: [
          { from: "VisaAssist", text: "StayFinder, the Phuket resort booking for the Kapoor family — their Thai visa is approved!", time: "Just now" },
          { from: "StayFinder", text: "Great! Confirming the Banyan Tree reservation for 5 nights. Any special requests from the guests?", time: "Just now" },
          { from: "VisaAssist", text: "Yes, they requested early check-in and airport transfer.", time: "Just now" },
        ],
        isTyping: "StayFinder",
      },
      history: [
        { id: "h1", action: "Completed Thailand visa docs for 3 travelers", time: "15 min ago", type: "task" },
        { id: "h2", action: "Updated Malaysia e-visa guidelines", time: "1 hr ago", type: "task" },
      ],
      conversations: [
        { id: "c1", withAgent: "StayFinder", withColor: "#a855f7", messages: [
          { from: "VisaAssist", text: "StayFinder, the Bali booking is confirmed. Visa docs are ready for all 4 guests.", time: "2 hrs ago" },
          { from: "StayFinder", text: "Great! I'll finalize the resort reservation now. Thanks for the quick turnaround!", time: "2 hrs ago" },
        ]},
      ],
    },
    a7: {
      currentTask: null,
      liveConversation: null,
      history: [
        { id: "h1", action: "Redeemed 50,000 miles for 3 free flights", time: "4 hrs ago", type: "task" },
        { id: "h2", action: "Generated loyalty tier upgrade report", time: "6 hrs ago", type: "report" },
      ],
      conversations: [],
    },
    a8: {
      currentTask: { title: "Processing ₹3,45,000 refund for cancelled Maldives trip", progress: 72, status: "In Progress" },
      liveConversation: {
        withAgent: "TripPlanner", withColor: "#f59e0b",
        messages: [
          { from: "PayGate", text: "TripPlanner, the Maldives refund of ₹3,45,000 initiated. 5-7 business days to process.", time: "Just now" },
          { from: "TripPlanner", text: "Got it. The customer wants to rebook for Bali instead. Can you hold the refund credit?", time: "Just now" },
          { from: "PayGate", text: "Yes, converted to travel credit. Valid for 6 months. They can use it for any booking.", time: "Just now" },
        ],
        isTyping: "PayGate",
      },
      history: [
        { id: "h1", action: "Completed payment for 5 hotel bookings", time: "30 min ago", type: "task" },
        { id: "h2", action: "Processed EMI setup for Rajasthan package", time: "45 min ago", type: "task" },
        { id: "h3", action: "Generated daily transaction reconciliation report", time: "3 hrs ago", type: "report" },
      ],
      conversations: [
        { id: "c1", withAgent: "TripPlanner", withColor: "#f59e0b", messages: [
          { from: "PayGate", text: "EMI options are live for the Rajasthan trip package.", time: "40 min ago" },
          { from: "TripPlanner", text: "Perfect. Customer selected 3-month EMI. Finalizing the itinerary now.", time: "38 min ago" },
        ]},
      ],
    },
  };
  const viewedAgent = selectedAgent ? orgAgents.find((a) => a.id === selectedAgent) : null;
  const viewedDetail = selectedAgent ? agentDetailData[selectedAgent] : null;
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "1", title: "Welcome Chat", messages: [], createdAt: new Date() },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("1");
  const [isTyping, setIsTyping] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const active = sessions.find((s) => s.id === activeSessionId);
  const messages = active?.messages || [];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = () => {
    const ns: ChatSession = { id: Date.now().toString(), title: "New Chat", messages: [], createdAt: new Date() };
    setSessions((p) => [ns, ...p]);
    setActiveSessionId(ns.id);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() };
    setSessions((p) => p.map((s) => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? input.trim().slice(0, 28) + (input.trim().length > 28 ? "..." : "") : s.title } : s));
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: `Thanks for reaching out! I'm your Miraee Travel assistant. I can help you with: "${userMsg.content}".\n\n✈️ Flights — Search & compare fares across airlines\n🏨 Hotels — Find the best stays at your destination\n🚗 Cabs — Book airport pickups & local rides\n\nOnce connected to the backend, I'll fetch live pricing and availability for you!`, timestamp: new Date() };
      setSessions((p) => p.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s)));
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleDeleteSession = (id: string) => {
    setSessions((p) => {
      const f = p.filter((s) => s.id !== id);
      if (!f.length) { const ns: ChatSession = { id: Date.now().toString(), title: "New Chat", messages: [], createdAt: new Date() }; setActiveSessionId(ns.id); return [ns]; }
      if (activeSessionId === id) setActiveSessionId(f[0].id);
      return f;
    });
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isMiraeeOrgs = currentPath.includes('/demo');
  const router = useRouter();

  const handleLogout = () => {
    // Clear any auth tokens/state here if needed
    if (isMiraeeOrgs) {
      router.push('/?demo=miraee-orgs');
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; width: 100%; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #f4f4f8;
          color: #2d2d3a;
          text-rendering: optimizeLegibility;
        }

        .dash { display: flex; height: 100vh; overflow: hidden; }

        /* ═══════ LEFT SIDEBAR ═══════ */
        .sb {
          width: 280px;
          background: linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%);
          display: flex; flex-direction: column;
          transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0; overflow: hidden;
          border-right: 1px solid rgba(0,0,0,0.06);
          box-shadow: 2px 0 24px rgba(0,0,0,0.03), 4px 0 8px rgba(0,0,0,0.01);
        }
        .sb.hide { width: 0; border-right: none; box-shadow: none; }

        .sb-head {
          padding: 18px 16px 14px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #ececf0;
        }
        .sb-logo-wrap {
          display: flex; align-items: center; gap: 10px;
        }
        .sb-logo-badge {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #e85d45, #c73a28);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(232,93,69,0.2);
        }
        .sb-logo-text {
          font-size: 16px; font-weight: 700; color: #1a1a2e;
          letter-spacing: -0.02em;
        }
        .sb-x {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          background: #f4f4f8; border: none; border-radius: 8px;
          color: #b0b0be; cursor: pointer; font-size: 13px;
          transition: all 0.2s;
        }
        .sb-x:hover { background: #e8e8ee; color: #888; }

        .sb-new {
          margin: 14px 14px 6px; padding: 12px 16px;
          display: flex; align-items: center; gap: 9px;
          background: linear-gradient(135deg, #e85d45 0%, #c73a28 100%);
          border: none; color: #fff;
          border-radius: 12px; cursor: pointer;
          font-size: 13px; font-weight: 600; font-family: inherit;
          letter-spacing: 0.01em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(232,93,69,0.25), 0 1px 3px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }
        .sb-new::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
          pointer-events: none;
        }
        .sb-new:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(232,93,69,0.3), 0 2px 6px rgba(0,0,0,0.1);
        }
        .sb-new:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(232,93,69,0.2); }

        .sb-list { flex: 1; overflow-y: auto; padding: 6px 10px; }
        .sb-list::-webkit-scrollbar { width: 3px; }
        .sb-list::-webkit-scrollbar-thumb { background: #dddde5; border-radius: 3px; }

        .sb-lbl {
          padding: 14px 8px 6px;
          font-size: 10px; font-weight: 700; color: #b5b5c4;
          text-transform: uppercase; letter-spacing: 0.1em;
        }

        .sb-it {
          padding: 10px 12px; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          transition: all 0.2s; margin-bottom: 3px;
          border: 1px solid transparent;
        }
        .sb-it:hover {
          background: #f7f7fa; border-color: #ececf0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.03);
        }
        .sb-it.on {
          background: rgba(232,93,69,0.05);
          border-color: rgba(232,93,69,0.12);
          box-shadow: 0 2px 10px rgba(232,93,69,0.06);
        }
        .sb-it-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f4f4f8;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #b0b0be; font-size: 12px;
          transition: all 0.2s;
        }
        .sb-it.on .sb-it-icon {
          background: rgba(232,93,69,0.1); color: #e85d45;
        }
        .sb-it-t {
          font-size: 13px; color: #8a8a9a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
        }
        .sb-it.on .sb-it-t { color: #2d2d3a; font-weight: 600; }
        .sb-it-d {
          opacity: 0; background: none; border: none;
          color: #c5c5d0; cursor: pointer; font-size: 11px;
          padding: 4px 6px; border-radius: 6px; transition: all 0.15s; flex-shrink: 0;
        }
        .sb-it:hover .sb-it-d { opacity: 1; }
        .sb-it-d:hover { color: #e85d45; background: rgba(232,93,69,0.06); }

        .sb-foot {
          padding: 14px 16px;
          border-top: 1px solid #ececf0;
          display: flex; align-items: center; gap: 11px;
          background: #f9f9fc;
        }
        .sb-av {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, #e85d45, #c73a28);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 14px; font-weight: 700; flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(232,93,69,0.2);
          position: relative;
        }
        .sb-av::after {
          content: ''; position: absolute; bottom: -1px; right: -1px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #10b981;
          border: 2px solid #f9f9fc;
          box-shadow: 0 0 6px rgba(16,185,129,0.3);
        }
        .sb-nm { font-size: 13px; font-weight: 600; color: #2d2d3a; }
        .sb-em { font-size: 11px; color: #9ca3af; }

        /* Profile Menu */
        .profile-menu-wrap { position: relative; }
        .profile-menu {
          position: absolute; bottom: calc(100% + 12px); left: 16px; width: calc(100% - 32px);
          background: rgba(255,255,255,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(0,0,0,0.06); border-radius: 16px;
          padding: 6px; z-index: 999;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.02);
          transform-origin: bottom left;
          animation: profilePop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes profilePop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pm-head {
          padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.04);
          display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
        }
        .pm-info { flex: 1; min-width: 0; }
        .pm-name { font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .pm-email { font-size: 11px; color: #8a8a9a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pm-plan {
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #e85d45, #c73a28);
          color: #fff; font-size: 9px; font-weight: 800; text-transform: uppercase;
          padding: 3px 8px; border-radius: 6px; letter-spacing: 0.05em;
          box-shadow: 0 2px 8px rgba(232,93,69,0.3);
        }
        .pm-item {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border: none; background: transparent;
          border-radius: 10px; cursor: pointer; color: #3d3d4e;
          font-size: 13px; font-weight: 500; font-family: inherit;
          transition: all 0.2s; text-align: left;
        }
        .pm-item:hover { background: rgba(0,0,0,0.04); color: #1a1a2e; }
        .pm-item-icon { color: #8a8a9a; display: flex; transition: color 0.2s; }
        .pm-item:hover .pm-item-icon { color: #5c5c6e; }
        
        .pm-logout { color: #dc2626; margin-top: 4px; }
        .pm-logout .pm-item-icon { color: #ef4444; }
        .pm-logout:hover { background: rgba(220,38,38,0.08); color: #b91c1c; }
        .pm-logout:hover .pm-item-icon { color: #dc2626; }

        /* ═══════ MAIN ═══════ */
        .main {
          flex: 1; display: flex; flex-direction: column; min-width: 0;
          background: linear-gradient(180deg, #f9f9fc 0%, #f3f3f8 50%, #eff0f5 100%);
        }

        .top {
          height: 60px; display: flex; align-items: center;
          padding: 0 24px; gap: 12px; flex-shrink: 0;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 1px 8px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.01);
        }
        .top-btn {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.8); border: 1px solid rgba(0,0,0,0.06);
          border-radius: 10px; cursor: pointer; color: #999;
          transition: all 0.25s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .top-btn:hover {
          background: #fff; border-color: rgba(0,0,0,0.08); color: #666;
          box-shadow: 0 3px 12px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }
        .top-btn.on { background: rgba(232,93,69,0.06); border-color: rgba(232,93,69,0.18); color: #e85d45; }
        .top-title { flex: 1; font-size: 14px; font-weight: 600; color: #3d3d4e; letter-spacing: -0.01em; }

        /* ═══════ CHAT ═══════ */
        .chat-scroll { flex: 1; overflow-y: auto; padding: 36px 28px 16px; }
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #dddde5; border-radius: 5px; }
        .chat-feed { max-width: 740px; width: 100%; margin: 0 auto; }

        /* Welcome */
        .welcome {
          height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
          animation: rise 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .welcome-logo {
          display: flex; align-items: center; justify-content: center;
          position: relative;
          margin-bottom: 4px;
        }
        .welcome-logo img {
          filter: drop-shadow(0 4px 16px rgba(232,93,69,0.15));
        }
        .welcome-logo::after {
          content: ''; position: absolute; inset: -24px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,93,69,0.06) 0%, transparent 70%);
          z-index: -1;
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .welcome h2 {
          font-size: 30px; font-weight: 800; color: #1a1a2e;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #1a1a2e 0%, #444 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .welcome p {
          font-size: 15px; color: #9ca3af; max-width: 420px;
          text-align: center; line-height: 1.7;
        }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 560px; margin-top: 6px; }
        .chip {
          padding: 11px 22px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 28px;
          font-size: 13px; font-weight: 500; color: #777;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          backdrop-filter: blur(8px);
        }
        .chip:hover {
          border-color: rgba(232,93,69,0.3); color: #e85d45;
          background: rgba(255,255,255,1);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(232,93,69,0.1), 0 2px 6px rgba(0,0,0,0.04);
        }

        /* Messages */
        .msg { display: flex; gap: 14px; margin-bottom: 24px; animation: msgSlide 0.35s ease; }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-av {
          width: 36px; height: 36px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px;
        }
        .msg-av.u {
          background: linear-gradient(135deg, #e85d45, #c73a28);
          color: #fff;
          box-shadow: 0 3px 12px rgba(232,93,69,0.25);
        }
        .msg-av.a {
          background: linear-gradient(135deg, #fafafe, #f2f2f8);
          color: #8a8a9a;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .msg-body { flex: 1; min-width: 0; }
        .msg-who {
          font-size: 10px; font-weight: 700; color: #b5b5c4;
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;
        }
        .msg-txt {
          font-size: 14px; line-height: 1.75; color: #3d3d4e;
          white-space: pre-wrap; word-wrap: break-word;
        }
        .msg.ai .msg-txt {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02);
        }

        .dots { display: flex; gap: 5px; padding: 16px 18px; }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #e85d45; opacity: 0.4;
          animation: pulse 1.4s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes pulse {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-7px); opacity: 1; }
        }

        /* ═══════ INPUT ═══════ */
        .inp-wrap { padding: 12px 28px 28px; flex-shrink: 0; }
        .inp-box {
          max-width: 740px; margin: 0 auto; position: relative;
          background: #fff;
          border: 1.5px solid rgba(0,0,0,0.06);
          border-radius: 18px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 16px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .inp-box:focus-within {
          border-color: rgba(232,93,69,0.25);
          box-shadow:
            0 0 0 4px rgba(232,93,69,0.05),
            0 12px 40px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transform: translateY(-1px);
        }
        .inp-box textarea {
          width: 100%; padding: 18px 60px 18px 22px;
          border: none; outline: none;
          font-size: 14px; font-family: inherit; color: #2d2d3a;
          background: transparent; resize: none; max-height: 150px; line-height: 1.6;
        }
        .inp-box textarea::placeholder { color: #b5b5c4; }
        .inp-send {
          position: absolute; right: 10px; bottom: 10px;
          width: 42px; height: 42px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #e85d45, #c73a28);
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 18px rgba(232,93,69,0.25), 0 1px 3px rgba(0,0,0,0.1);
        }
        .inp-send:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,93,69,0.3), 0 2px 6px rgba(0,0,0,0.1); }
        .inp-send:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
        .inp-hint { text-align: center; font-size: 11px; color: #b5b5c4; margin-top: 12px; letter-spacing: 0.01em; }

        /* ═══════ RIGHT PANEL ═══════ */
        .rp {
          width: 380px;
          background: linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%);
          border-left: 1px solid rgba(0,0,0,0.06);
          display: flex; flex-direction: column;
          transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0; overflow: hidden;
          box-shadow: -3px 0 24px rgba(0,0,0,0.04), -1px 0 4px rgba(0,0,0,0.01);
        }
        .rp.hide { width: 0; border-left: none; box-shadow: none; }
        .rp-hd {
          padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
        }
        .rp-hd h3 { font-size: 15px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.01em; }
        .rp-bd { flex: 1; overflow-y: auto; padding: 20px; }
        .rp-bd::-webkit-scrollbar { width: 3px; }
        .rp-bd::-webkit-scrollbar-thumb { background: #dddde5; border-radius: 3px; }
        .rp-sec { margin-bottom: 0; }
        .rp-sec-t {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 12px; padding: 0 2px;
        }
        .rp-sep { height: 1px; background: #e5e5ed; margin: 18px 0; }

        /* Your Agent Card */
        .my-agent-card {
          background: linear-gradient(145deg, #fff 0%, #f7f7fa 100%);
          border: 1px solid rgba(232,93,69,0.1);
          border-radius: 16px; padding: 16px;
          box-shadow: 0 3px 16px rgba(232,93,69,0.05), 0 1px 3px rgba(0,0,0,0.02);
        }
        .my-agent-user {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(232,93,69,0.08);
        }
        .my-agent-av {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #e85d45, #c73a28);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px; font-weight: 700;
          box-shadow: 0 3px 10px rgba(232,93,69,0.25);
        }
        .my-agent-bot {
          display: flex; align-items: center; gap: 10px;
        }
        .my-agent-bot-av {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #f5f3f0, #eceae7);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .my-agent-status {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; color: #10b981; font-weight: 500;
          margin-top: 2px;
        }
        .my-agent-status::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #10b981;
        }

        /* Agent Farm Search */
        .af-search {
          position: relative; margin-bottom: 14px;
        }
        .af-search input {
          width: 100%; padding: 10px 14px 10px 36px;
          border: 1.5px solid #e5e5ed; border-radius: 10px;
          font-size: 13px; font-family: inherit; color: #2d2d3a;
          background: #f7f7fa; outline: none;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .af-search input:focus {
          border-color: rgba(232,93,69,0.3);
          box-shadow: 0 0 0 3px rgba(232,93,69,0.06);
          background: #fff;
        }
        .af-search input::placeholder { color: #b5b5c4; }
        .af-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #b5b5c4; pointer-events: none;
        }

        /* Agent List */
        .af-list { display: flex; flex-direction: column; gap: 4px; }
        .af-agent {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .af-agent:hover {
          background: rgba(0,0,0,0.02); border-color: rgba(0,0,0,0.04);
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transform: translateX(2px);
        }
        .af-agent.picked {
          background: rgba(232,93,69,0.04); border-color: rgba(232,93,69,0.12);
          box-shadow: 0 2px 12px rgba(232,93,69,0.06);
        }
        .af-agent-av {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 12px; font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: transform 0.2s;
        }
        .af-agent:hover .af-agent-av { transform: scale(1.05); }
        .af-agent-info { flex: 1; min-width: 0; }
        .af-agent-name { font-size: 13px; font-weight: 600; color: #2d2d3a; }
        .af-agent-meta {
          font-size: 11px; color: #9ca3af;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .af-agent-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .af-agent-dot.on { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.3); }
        .af-agent-dot.away { background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.3); }
        .af-agent-dot.off { background: #d1d5db; }
        .af-empty {
          text-align: center; padding: 20px 0;
          font-size: 13px; color: #b5b5c4;
        }

        /* ═══════ AGENT DETAIL PANEL ═══════ */
        .agent-detail {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%);
          display: flex; flex-direction: column;
          z-index: 5;
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .ad-header {
          padding: 16px 20px;
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          flex-shrink: 0;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
        }
        .ad-back {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.04); border: none; border-radius: 9px;
          color: #999; cursor: pointer; transition: all 0.25s;
        }
        .ad-back:hover { background: rgba(0,0,0,0.07); color: #555; transform: translateX(-2px); }
        .ad-header-info { flex: 1; }
        .ad-header-name { font-size: 15px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.01em; }
        .ad-header-sub { font-size: 11px; color: #9ca3af; }

        .ad-body {
          flex: 1; overflow-y: auto; padding: 20px;
        }
        .ad-body::-webkit-scrollbar { width: 3px; }
        .ad-body::-webkit-scrollbar-thumb { background: #dddde5; border-radius: 3px; }

        /* Live Task Card */
        .ad-live {
          background: linear-gradient(135deg, #fff8f6 0%, #fff 100%);
          border: 1px solid rgba(232,93,69,0.12);
          border-radius: 14px; padding: 16px;
          margin-bottom: 18px;
          box-shadow: 0 2px 12px rgba(232,93,69,0.05);
          position: relative; overflow: hidden;
        }
        .ad-live::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #e85d45, #f59e0b);
        }
        .ad-live-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px 3px 7px;
          background: rgba(16,185,129,0.08); border-radius: 20px;
          font-size: 10px; font-weight: 700; color: #10b981;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 10px;
        }
        .ad-live-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: #10b981;
          animation: livePulse 2s infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .ad-live-title {
          font-size: 13px; font-weight: 600; color: #2d2d3a;
          margin-bottom: 12px; line-height: 1.4;
        }
        .ad-live-bar-wrap {
          background: #eff0f5; border-radius: 6px; height: 6px;
          overflow: hidden; margin-bottom: 6px;
        }
        .ad-live-bar {
          height: 100%; border-radius: 6px;
          background: linear-gradient(90deg, #e85d45, #f59e0b);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ad-live-meta {
          display: flex; justify-content: space-between;
          font-size: 11px; color: #9ca3af;
        }

        /* Idle state */
        .ad-idle {
          background: #f7f7fa; border: 1px solid #e5e5ed;
          border-radius: 14px; padding: 20px;
          text-align: center; margin-bottom: 18px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }
        .ad-idle-icon { font-size: 28px; margin-bottom: 8px; }
        .ad-idle-text { font-size: 13px; color: #9ca3af; }

        /* Live Conversation */
        .ad-live-conv {
          background: linear-gradient(135deg, #f0fdf4 0%, #fff 100%);
          border: 1.5px solid rgba(16,185,129,0.2);
          border-radius: 14px; padding: 0;
          margin-bottom: 18px;
          box-shadow: 0 2px 16px rgba(16,185,129,0.08);
          overflow: hidden;
          animation: fadeInUp 0.3s ease;
        }
        .ad-lc-header {
          padding: 12px 16px;
          display: flex; align-items: center; gap: 8px;
          background: rgba(16,185,129,0.06);
          border-bottom: 1px solid rgba(16,185,129,0.1);
        }
        .ad-lc-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px 3px 7px;
          background: rgba(16,185,129,0.1); border-radius: 20px;
          font-size: 9px; font-weight: 800; color: #10b981;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .ad-lc-badge .ad-live-pulse { width: 5px; height: 5px; }
        .ad-lc-agents {
          display: flex; align-items: center; gap: 5px;
          margin-left: auto;
          font-size: 11px; font-weight: 600; color: #8a8a9a;
        }
        .ad-lc-agents .mini-av {
          width: 20px; height: 20px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 8px; font-weight: 700;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .ad-lc-body {
          padding: 14px 16px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .ad-lc-msg {
          padding: 9px 13px;
          border-radius: 12px;
          font-size: 12px; line-height: 1.5;
          max-width: 88%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .ad-lc-msg.self {
          background: rgba(232,93,69,0.06);
          border: 1px solid rgba(232,93,69,0.08);
          color: #3d3d4e; margin-left: auto;
          border-bottom-right-radius: 4px;
        }
        .ad-lc-msg.other {
          background: #fff;
          border: 1px solid #e5e5ed;
          color: #5c5c6e;
          border-bottom-left-radius: 4px;
        }
        .ad-lc-msg-name {
          font-size: 9px; font-weight: 700; color: #b5b5c4;
          margin-bottom: 2px; text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ad-lc-typing {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 0 2px;
          font-size: 11px; color: #10b981; font-weight: 500;
        }
        .ad-lc-typing-dots {
          display: flex; gap: 3px;
        }
        .ad-lc-typing-dots span {
          width: 5px; height: 5px; border-radius: 50%;
          background: #10b981;
          animation: typeBounce 1.4s infinite;
        }
        .ad-lc-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .ad-lc-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typeBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .ad-sec-title {
          font-size: 10px; font-weight: 700; color: #b5b5c4;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 12px; padding: 0 2px;
        }

        /* Timeline */
        .ad-timeline { position: relative; padding-left: 22px; margin-bottom: 20px; }
        .ad-timeline::before {
          content: ''; position: absolute; left: 5px; top: 6px; bottom: 6px;
          width: 1.5px; background: #e5e5ed;
        }
        .ad-tl-item {
          position: relative; margin-bottom: 16px;
          animation: fadeInUp 0.3s ease;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ad-tl-dot {
          position: absolute; left: -22px; top: 3px;
          width: 12px; height: 12px; border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px #e5e5ed;
        }
        .ad-tl-dot.task { background: #4f8cff; }
        .ad-tl-dot.chat { background: #a855f7; }
        .ad-tl-dot.analysis { background: #f59e0b; }
        .ad-tl-dot.report { background: #10b981; }
        .ad-tl-text { font-size: 13px; color: #5c5c6e; line-height: 1.4; }
        .ad-tl-time { font-size: 11px; color: #b5b5c4; margin-top: 2px; }

        /* Agent Conversations */
        .ad-conv { margin-bottom: 16px; }
        .ad-conv-header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 10px;
          padding: 8px 12px;
          background: #f7f7fa; border-radius: 10px;
          border: 1px solid #ececf0;
        }
        .ad-conv-av {
          width: 24px; height: 24px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 10px; font-weight: 700;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .ad-conv-label {
          font-size: 12px; font-weight: 600; color: #8a8a9a;
        }
        .ad-conv-label span { color: #5c5c6e; }
        .ad-bubble {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px; line-height: 1.5;
          margin-bottom: 6px;
          max-width: 92%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .ad-bubble.from-self {
          background: rgba(232,93,69,0.06);
          border: 1px solid rgba(232,93,69,0.1);
          color: #3d3d4e;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }
        .ad-bubble.from-other {
          background: #fff;
          border: 1px solid #e5e5ed;
          color: #5c5c6e;
          border-bottom-left-radius: 4px;
        }
        .ad-bubble-time { font-size: 10px; color: #b5b5c4; margin-top: 3px; text-align: right; }
        .ad-no-conv {
          text-align: center; padding: 16px;
          font-size: 13px; color: #b5b5c4;
          background: #f7f7fa; border-radius: 10px;
          border: 1px solid #ececf0;
        }

        /* ═══════ RESPONSIVE ═══════ */
        @media (max-width: 768px) {
          .sb { position: fixed; z-index: 100; height: 100vh; box-shadow: 4px 0 32px rgba(0,0,0,0.12); }
          .rp { position: fixed; right: 0; z-index: 100; height: 100vh; box-shadow: -4px 0 32px rgba(0,0,0,0.08); }
          .rp.hide, .sb.hide { width: 0; box-shadow: none; }
          .chat-scroll { padding: 24px 16px 12px; }
          .inp-wrap { padding: 10px 16px 20px; }
        }
      `}</style>

      <div className="dash">
        {/* ═══ LEFT SIDEBAR ═══ */}
        <div className={`sb ${sidebarOpen ? "" : "hide"}`}>
          <div className="sb-head">
            <div className="sb-logo-wrap">
              <div className="sb-logo-badge">
                <Image src="/logo_main.png" alt="M" width={20} height={20} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
              </div>
              <span className="sb-logo-text">Miraee</span>
            </div>
            <button className="sb-x" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>
          <button className="sb-new" onClick={handleNewChat}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Chat
          </button>
          <div className="sb-list">
            <div className="sb-lbl">Recent Chats</div>
            {sessions.map((s) => (
              <div key={s.id} className={`sb-it ${s.id === activeSessionId ? "on" : ""}`} onClick={() => setActiveSessionId(s.id)}>
                <div className="sb-it-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <span className="sb-it-t">{s.title}</span>
                <button className="sb-it-d" onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}>✕</button>
              </div>
            ))}
          </div>
          <div className="profile-menu-wrap" ref={profileRef}>
            {profileOpen && (
              <div className="profile-menu">
                <div className="pm-head">
                  <div className="sb-av">U</div>
                  <div className="pm-info">
                    <div className="pm-name">User</div>
                    <div className="pm-email">user@miraee.com</div>
                  </div>
                  <div className="pm-plan">PRO</div>
                </div>
                <button className="pm-item pm-logout" onClick={handleLogout}>
                  <div className="pm-item-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  </div>
                  Sign out
                </button>
              </div>
            )}
            <div className="sb-foot" onClick={() => setProfileOpen(!profileOpen)} style={{ cursor: "pointer" }}>
              <div className="sb-av">U</div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><div className="sb-nm">User</div><div className="sb-em">user@miraee.com</div></div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b5b5c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MAIN ═══ */}
        <div className="main">
          <div className="top">
            {!sidebarOpen && (
              <button className="top-btn" onClick={() => setSidebarOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            )}
            <span className="top-title">{active?.title || "New Chat"}</span>
            <button className={`top-btn ${rightPanelOpen ? "on" : ""}`} onClick={() => setRightPanelOpen(!rightPanelOpen)} title="Toggle side panel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
            </button>
          </div>

          <div className="chat-scroll">
            <div className="chat-feed">
              {messages.length === 0 ? (
                <div className="welcome">
                  <div className="welcome-logo">
                    <Image src="/logo_main.png" alt="Miraee" width={180} height={60} style={{ objectFit: "contain" }} priority />
                  </div>
                  <h2>Where would you like to go?</h2>
                  <p>I&apos;m your Miraee Travel assistant. I can help you book flights, find hotels, and arrange cabs — all in one place.</p>
                  <div className="chips">
                    {["Book a flight to Dubai", "Find hotels in Goa", "Airport cab in Mumbai", "Plan a Rajasthan trip"].map((s) => (
                      <button key={s} className="chip" onClick={() => { setInput(s); inputRef.current?.focus(); }}>{s}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) => (
                    <div key={m.id} className={`msg ${m.role === "assistant" ? "ai" : ""}`}>
                      <div className={`msg-av ${m.role === "user" ? "u" : "a"}`}>{m.role === "user" ? "U" : "M"}</div>
                      <div className="msg-body">
                        <div className="msg-who">{m.role === "user" ? "You" : "Miraee AI"}</div>
                        <div className="msg-txt">{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="msg ai">
                      <div className="msg-av a">M</div>
                      <div className="msg-body">
                        <div className="msg-who">Miraee AI</div>
                        <div className="msg-txt"><div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="inp-wrap">
            <div className="inp-box">
              <textarea ref={inputRef} rows={1} placeholder="Search flights, hotels, or cabs..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 150) + "px"; }} />
              <button className="inp-send" onClick={handleSend} disabled={!input.trim() || isTyping}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <p className="inp-hint">Miraee Travel helps find the best deals. Always verify booking details before confirmation.</p>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className={`rp ${rightPanelOpen ? "" : "hide"}`} style={{ position: "relative" }}>

          {/* Agent Detail Overlay */}
          {viewedAgent && viewedDetail && (
            <div className="agent-detail">
              <div className="ad-header">
                <button className="ad-back" onClick={() => setSelectedAgent(null)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div className="af-agent-av" style={{ background: `linear-gradient(135deg, ${viewedAgent.color}, ${viewedAgent.color}dd)`, width: 32, height: 32, borderRadius: 9, fontSize: 12 }}>
                  {viewedAgent.name.charAt(0)}
                </div>
                <div className="ad-header-info">
                  <div className="ad-header-name">{viewedAgent.name}</div>
                  <div className="ad-header-sub">{viewedAgent.owner} · {viewedAgent.dept}</div>
                </div>
                <div className={`af-agent-dot ${viewedAgent.status === "online" ? "on" : viewedAgent.status === "away" ? "away" : "off"}`} />
              </div>

              <div className="ad-body">
                {/* Live Task */}
                {viewedDetail.currentTask ? (
                  <div className="ad-live">
                    <div className="ad-live-badge">
                      <div className="ad-live-pulse" />
                      LIVE
                    </div>
                    <div className="ad-live-title">{viewedDetail.currentTask.title}</div>
                    <div className="ad-live-bar-wrap">
                      <div className="ad-live-bar" style={{ width: `${viewedDetail.currentTask.progress}%` }} />
                    </div>
                    <div className="ad-live-meta">
                      <span>{viewedDetail.currentTask.status}</span>
                      <span>{viewedDetail.currentTask.progress}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="ad-idle">
                    <div className="ad-idle-icon">😴</div>
                    <div className="ad-idle-text">Agent is currently idle</div>
                  </div>
                )}

                {/* Live Conversation */}
                {viewedDetail.liveConversation && viewedAgent && (
                  <div className="ad-live-conv">
                    <div className="ad-lc-header">
                      <div className="ad-lc-badge">
                        <div className="ad-live-pulse" />
                        LIVE CONVERSATION
                      </div>
                      <div className="ad-lc-agents">
                        <div className="mini-av" style={{ background: `linear-gradient(135deg, ${viewedAgent.color}, ${viewedAgent.color}dd)` }}>{viewedAgent.name.charAt(0)}</div>
                        <span>↔</span>
                        <div className="mini-av" style={{ background: `linear-gradient(135deg, ${viewedDetail.liveConversation.withColor}, ${viewedDetail.liveConversation.withColor}dd)` }}>{viewedDetail.liveConversation.withAgent.charAt(0)}</div>
                      </div>
                    </div>
                    <div className="ad-lc-body">
                      {viewedDetail.liveConversation.messages.map((msg, i) => (
                        <div key={i} className={`ad-lc-msg ${msg.from === viewedAgent.name ? "self" : "other"}`}>
                          <div className="ad-lc-msg-name">{msg.from}</div>
                          {msg.text}
                        </div>
                      ))}
                      {viewedDetail.liveConversation.isTyping && (
                        <div className="ad-lc-typing">
                          <div className="ad-lc-typing-dots"><span/><span/><span/></div>
                          {viewedDetail.liveConversation.isTyping} is typing...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Activity History */}
                <div className="ad-sec-title">Activity History</div>
                <div className="ad-timeline">
                  {viewedDetail.history.map((h) => (
                    <div key={h.id} className="ad-tl-item">
                      <div className={`ad-tl-dot ${h.type}`} />
                      <div className="ad-tl-text">{h.action}</div>
                      <div className="ad-tl-time">{h.time}</div>
                    </div>
                  ))}
                </div>

                {/* Agent Conversations */}
                <div className="ad-sec-title">Agent Conversations</div>
                {viewedDetail.conversations.length === 0 ? (
                  <div className="ad-no-conv">No recent conversations</div>
                ) : (
                  viewedDetail.conversations.map((conv) => (
                    <div key={conv.id} className="ad-conv">
                      <div className="ad-conv-header">
                        <div className="ad-conv-av" style={{ background: `linear-gradient(135deg, ${viewedAgent.color}, ${viewedAgent.color}dd)` }}>{viewedAgent.name.charAt(0)}</div>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        <div className="ad-conv-av" style={{ background: `linear-gradient(135deg, ${conv.withColor}, ${conv.withColor}dd)` }}>{conv.withAgent.charAt(0)}</div>
                        <div className="ad-conv-label"><span>{viewedAgent.name}</span> ↔ <span>{conv.withAgent}</span></div>
                      </div>
                      {conv.messages.map((msg, i) => (
                        <div key={i}>
                          <div className={`ad-bubble ${msg.from === viewedAgent.name ? "from-self" : "from-other"}`}>
                            <div style={{ fontSize: "10px", fontWeight: 600, color: "#bbb", marginBottom: 3 }}>{msg.from}</div>
                            {msg.text}
                          </div>
                          <div className="ad-bubble-time" style={{ textAlign: msg.from === viewedAgent.name ? "right" : "left" }}>{msg.time}</div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          <div className="rp-hd">
            <h3>Agents</h3>
            <button onClick={() => setRightPanelOpen(false)} style={{ background: "none", border: "none", color: "#b5b5c4", cursor: "pointer", fontSize: "16px" }}>✕</button>
          </div>
          <div className="rp-bd">
            {/* ── Section 1: Your Agent ── */}
            <div className="rp-sec">
              <div className="rp-sec-t">Your Agent</div>
              <div className="my-agent-card">
                <div className="my-agent-user">
                  <div className="my-agent-av">U</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2d3a" }}>User</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>user@miraee.com</div>
                  </div>
                </div>
                <div className="my-agent-bot">
                  <div className="my-agent-bot-av">🤖</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d2d3a" }}>Miraee Pro</div>
                    <div className="my-agent-status">Active</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rp-sep" />

            {/* ── Section 2: Agent Farm ── */}
            <div className="rp-sec" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="rp-sec-t">Agent Farm</div>

              {/* Search */}
              <div className="af-search">
                <div className="af-search-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search agents or users..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                />
              </div>

              {/* Agent List */}
              <div className="af-list">
                {filteredAgents.length === 0 ? (
                  <div className="af-empty">No agents found</div>
                ) : (
                  filteredAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`af-agent ${selectedAgent === agent.id ? "picked" : ""}`}
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    >
                      <div className="af-agent-av" style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)` }}>
                        {agent.name.charAt(0)}
                      </div>
                      <div className="af-agent-info">
                        <div className="af-agent-name">{agent.name}</div>
                        <div className="af-agent-meta">{agent.owner} · {agent.dept}</div>
                      </div>
                      <div className={`af-agent-dot ${agent.status === "online" ? "on" : agent.status === "away" ? "away" : "off"}`} title={agent.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
