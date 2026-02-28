"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
  const agentDetailData: Record<string, { currentTask: { title: string; progress: number; status: string } | null; history: { id: string; action: string; time: string; type: "task" | "chat" | "analysis" | "report" }[]; conversations: { id: string; withAgent: string; withColor: string; messages: { from: string; text: string; time: string }[] }[] }> = {
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
    },
    a2: {
      currentTask: { title: "Comparing 23 hotels in Goa for weekend package", progress: 42, status: "Filtering Results" },
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
      history: [
        { id: "h1", action: "Dispatched 15 airport cabs across Mumbai", time: "1 hr ago", type: "task" },
        { id: "h2", action: "Generated daily ride analytics report", time: "3 hrs ago", type: "report" },
        { id: "h3", action: "Coordinated with SkyBot for flight-aligned pickups", time: "5 hrs ago", type: "chat" },
      ],
      conversations: [],
    },
    a4: {
      currentTask: { title: "Building 7-day Rajasthan itinerary for a family of 5", progress: 85, status: "Almost Done" },
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
      history: [
        { id: "h1", action: "Detected 18% fare drop on BOM→BKK route", time: "20 min ago", type: "analysis" },
        { id: "h2", action: "Sent price alert to 42 subscribed users", time: "2 hrs ago", type: "report" },
      ],
      conversations: [],
    },
    a6: {
      currentTask: { title: "Processing 8 visa applications for Southeast Asia", progress: 55, status: "In Progress" },
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
      history: [
        { id: "h1", action: "Redeemed 50,000 miles for 3 free flights", time: "4 hrs ago", type: "task" },
        { id: "h2", action: "Generated loyalty tier upgrade report", time: "6 hrs ago", type: "report" },
      ],
      conversations: [],
    },
    a8: {
      currentTask: { title: "Processing ₹3,45,000 refund for cancelled Maldives trip", progress: 72, status: "In Progress" },
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const active = sessions.find((s) => s.id === activeSessionId);
  const messages = active?.messages || [];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; width: 100%; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #f5f3f0;
          color: #2d2d3a;
        }

        .dash { display: flex; height: 100vh; overflow: hidden; }

        /* ═══════ LEFT SIDEBAR ═══════ */
        .sb {
          width: 280px;
          background: #fff;
          display: flex; flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0; overflow: hidden;
          border-right: 1px solid #eceae7;
          box-shadow: 2px 0 20px rgba(0,0,0,0.03);
        }
        .sb.hide { width: 0; border-right: none; box-shadow: none; }

        .sb-head {
          padding: 18px 16px 14px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #f0eeeb;
        }
        .sb-logo-wrap {
          display: flex; align-items: center; gap: 10px;
        }
        .sb-logo-badge {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #e85d45, #d04030);
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
          background: #f5f3f0; border: none; border-radius: 8px;
          color: #bbb; cursor: pointer; font-size: 13px;
          transition: all 0.2s;
        }
        .sb-x:hover { background: #eceae7; color: #888; }

        .sb-new {
          margin: 14px 14px 6px; padding: 12px 16px;
          display: flex; align-items: center; gap: 9px;
          background: linear-gradient(135deg, #e85d45 0%, #d04030 100%);
          border: none; color: #fff;
          border-radius: 12px; cursor: pointer;
          font-size: 13px; font-weight: 600; font-family: inherit;
          letter-spacing: 0.01em;
          transition: all 0.25s;
          box-shadow: 0 4px 16px rgba(232,93,69,0.25);
        }
        .sb-new:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232,93,69,0.3);
        }
        .sb-new:active { transform: translateY(0); }

        .sb-list { flex: 1; overflow-y: auto; padding: 6px 10px; }
        .sb-list::-webkit-scrollbar { width: 3px; }
        .sb-list::-webkit-scrollbar-thumb { background: #e0ddd9; border-radius: 3px; }

        .sb-lbl {
          padding: 14px 8px 6px;
          font-size: 10px; font-weight: 700; color: #ccc;
          text-transform: uppercase; letter-spacing: 0.1em;
        }

        .sb-it {
          padding: 10px 12px; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          transition: all 0.2s; margin-bottom: 3px;
          border: 1px solid transparent;
        }
        .sb-it:hover {
          background: #faf9f7; border-color: #f0eeeb;
          box-shadow: 0 1px 6px rgba(0,0,0,0.03);
        }
        .sb-it.on {
          background: rgba(232,93,69,0.05);
          border-color: rgba(232,93,69,0.12);
          box-shadow: 0 2px 10px rgba(232,93,69,0.06);
        }
        .sb-it-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f5f3f0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #bbb; font-size: 12px;
          transition: all 0.2s;
        }
        .sb-it.on .sb-it-icon {
          background: rgba(232,93,69,0.1); color: #e85d45;
        }
        .sb-it-t {
          font-size: 13px; color: #888;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
        }
        .sb-it.on .sb-it-t { color: #333; font-weight: 600; }
        .sb-it-d {
          opacity: 0; background: none; border: none;
          color: #ccc; cursor: pointer; font-size: 11px;
          padding: 4px 6px; border-radius: 6px; transition: all 0.15s; flex-shrink: 0;
        }
        .sb-it:hover .sb-it-d { opacity: 1; }
        .sb-it-d:hover { color: #e85d45; background: rgba(232,93,69,0.06); }

        .sb-foot {
          padding: 14px 16px;
          border-top: 1px solid #f0eeeb;
          display: flex; align-items: center; gap: 11px;
          background: #faf9f7;
        }
        .sb-av {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, #e85d45, #d04030);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 14px; font-weight: 700; flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(232,93,69,0.2);
          position: relative;
        }
        .sb-av::after {
          content: ''; position: absolute; bottom: -1px; right: -1px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #10b981;
          border: 2px solid #faf9f7;
          box-shadow: 0 0 6px rgba(16,185,129,0.3);
        }
        .sb-nm { font-size: 13px; font-weight: 600; color: #333; }
        .sb-em { font-size: 11px; color: #bbb; }

        /* ═══════ MAIN ═══════ */
        .main {
          flex: 1; display: flex; flex-direction: column; min-width: 0;
          background: linear-gradient(180deg, #faf9f7 0%, #f3f1ee 100%);
        }

        .top {
          height: 58px; display: flex; align-items: center;
          padding: 0 20px; gap: 10px; flex-shrink: 0;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .top-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: #fff; border: 1px solid #eceae7;
          border-radius: 10px; cursor: pointer; color: #999;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .top-btn:hover { background: #faf9f7; border-color: #e0ddd9; color: #666; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
        .top-btn.on { background: rgba(232,93,69,0.06); border-color: rgba(232,93,69,0.18); color: #e85d45; }
        .top-title { flex: 1; font-size: 14px; font-weight: 600; color: #444; }

        /* ═══════ CHAT ═══════ */
        .chat-scroll { flex: 1; overflow-y: auto; padding: 36px 28px 16px; }
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #e0ddd9; border-radius: 5px; }
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
          width: 88px; height: 88px; border-radius: 22px;
          background: linear-gradient(145deg, #fff 0%, #f5f3f0 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow:
            0 8px 32px rgba(232,93,69,0.08),
            0 2px 8px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.8);
          position: relative;
        }
        .welcome-logo::after {
          content: ''; position: absolute; inset: -12px; border-radius: 34px;
          background: radial-gradient(circle, rgba(232,93,69,0.06) 0%, transparent 70%);
          z-index: -1;
        }
        .welcome h2 {
          font-size: 28px; font-weight: 800; color: #1a1a2e;
          letter-spacing: -0.03em;
        }
        .welcome p {
          font-size: 15px; color: #aaa; max-width: 400px;
          text-align: center; line-height: 1.6;
        }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 550px; margin-top: 4px; }
        .chip {
          padding: 11px 20px;
          background: #fff;
          border: 1px solid #eceae7;
          border-radius: 28px;
          font-size: 13px; font-weight: 500; color: #777;
          cursor: pointer; transition: all 0.25s; font-family: inherit;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .chip:hover {
          border-color: rgba(232,93,69,0.35); color: #e85d45;
          background: rgba(232,93,69,0.03);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(232,93,69,0.1);
        }

        /* Messages */
        .msg { display: flex; gap: 14px; margin-bottom: 24px; animation: msgSlide 0.35s ease; }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-av {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px;
        }
        .msg-av.u {
          background: linear-gradient(135deg, #e85d45, #d04030);
          color: #fff;
          box-shadow: 0 2px 8px rgba(232,93,69,0.2);
        }
        .msg-av.a {
          background: linear-gradient(135deg, #f8f7f5, #efeee9);
          color: #888;
          border: 1px solid #e8e6e3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .msg-body { flex: 1; min-width: 0; }
        .msg-who {
          font-size: 11px; font-weight: 700; color: #bbb;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;
        }
        .msg-txt {
          font-size: 14px; line-height: 1.75; color: #444;
          white-space: pre-wrap; word-wrap: break-word;
        }
        .msg.ai .msg-txt {
          background: #fff;
          border: 1px solid #eceae7;
          border-radius: 14px;
          padding: 16px 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.01);
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
        .inp-wrap { padding: 12px 28px 26px; flex-shrink: 0; }
        .inp-box {
          max-width: 740px; margin: 0 auto; position: relative;
          background: #fff;
          border: 1.5px solid #eceae7;
          border-radius: 16px;
          transition: all 0.25s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.01);
        }
        .inp-box:focus-within {
          border-color: rgba(232,93,69,0.3);
          box-shadow:
            0 0 0 4px rgba(232,93,69,0.06),
            0 8px 32px rgba(0,0,0,0.06);
        }
        .inp-box textarea {
          width: 100%; padding: 16px 58px 16px 20px;
          border: none; outline: none;
          font-size: 14px; font-family: inherit; color: #2d2d3a;
          background: transparent; resize: none; max-height: 150px; line-height: 1.5;
        }
        .inp-box textarea::placeholder { color: #ccc; }
        .inp-send {
          position: absolute; right: 10px; bottom: 10px;
          width: 40px; height: 40px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #e85d45, #d04030);
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s;
          box-shadow: 0 4px 16px rgba(232,93,69,0.25);
        }
        .inp-send:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,93,69,0.3); }
        .inp-send:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
        .inp-hint { text-align: center; font-size: 11px; color: #ccc; margin-top: 10px; }

        /* ═══════ RIGHT PANEL ═══════ */
        .rp {
          width: 380px;
          background: linear-gradient(180deg, #fff 0%, #faf9f7 100%);
          border-left: 1px solid #eceae7;
          display: flex; flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0; overflow: hidden;
          box-shadow: -2px 0 16px rgba(0,0,0,0.03);
        }
        .rp.hide { width: 0; border-left: none; box-shadow: none; }
        .rp-hd {
          padding: 18px 20px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #eceae7;
        }
        .rp-hd h3 { font-size: 14px; font-weight: 700; color: #333; }
        .rp-bd { flex: 1; overflow-y: auto; padding: 20px; }
        .rp-bd::-webkit-scrollbar { width: 3px; }
        .rp-bd::-webkit-scrollbar-thumb { background: #e0ddd9; border-radius: 3px; }
        .rp-sec { margin-bottom: 0; }
        .rp-sec-t {
          font-size: 10px; font-weight: 700; color: #bbb;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 12px; padding: 0 2px;
        }
        .rp-sep { height: 1px; background: #eceae7; margin: 18px 0; }

        /* Your Agent Card */
        .my-agent-card {
          background: linear-gradient(135deg, #fff8f6 0%, #fff 100%);
          border: 1px solid rgba(232,93,69,0.12);
          border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 12px rgba(232,93,69,0.05);
        }
        .my-agent-user {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(232,93,69,0.08);
        }
        .my-agent-av {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #e85d45, #d04030);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px; font-weight: 700;
          box-shadow: 0 2px 8px rgba(232,93,69,0.2);
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
          border: 1.5px solid #eceae7; border-radius: 10px;
          font-size: 13px; font-family: inherit; color: #2d2d3a;
          background: #faf9f7; outline: none;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .af-search input:focus {
          border-color: rgba(232,93,69,0.3);
          box-shadow: 0 0 0 3px rgba(232,93,69,0.06);
          background: #fff;
        }
        .af-search input::placeholder { color: #ccc; }
        .af-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #ccc; pointer-events: none;
        }

        /* Agent List */
        .af-list { display: flex; flex-direction: column; gap: 4px; }
        .af-agent {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          cursor: pointer; transition: all 0.2s;
          border: 1px solid transparent;
        }
        .af-agent:hover { background: #faf9f7; border-color: #eceae7; box-shadow: 0 1px 6px rgba(0,0,0,0.03); }
        .af-agent.picked {
          background: rgba(232,93,69,0.04); border-color: rgba(232,93,69,0.15);
          box-shadow: 0 2px 10px rgba(232,93,69,0.06);
        }
        .af-agent-av {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 12px; font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .af-agent-info { flex: 1; min-width: 0; }
        .af-agent-name { font-size: 13px; font-weight: 600; color: #333; }
        .af-agent-meta {
          font-size: 11px; color: #bbb;
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
          font-size: 13px; color: #ccc;
        }

        /* ═══════ AGENT DETAIL PANEL ═══════ */
        .agent-detail {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, #fff 0%, #faf9f7 100%);
          display: flex; flex-direction: column;
          z-index: 5;
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .ad-header {
          padding: 16px 18px;
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid #eceae7;
          flex-shrink: 0;
        }
        .ad-back {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          background: #f5f3f0; border: none; border-radius: 8px;
          color: #999; cursor: pointer; transition: all 0.2s;
        }
        .ad-back:hover { background: #eceae7; color: #666; }
        .ad-header-info { flex: 1; }
        .ad-header-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
        .ad-header-sub { font-size: 11px; color: #bbb; }

        .ad-body {
          flex: 1; overflow-y: auto; padding: 18px;
        }
        .ad-body::-webkit-scrollbar { width: 3px; }
        .ad-body::-webkit-scrollbar-thumb { background: #e0ddd9; border-radius: 3px; }

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
          font-size: 13px; font-weight: 600; color: #333;
          margin-bottom: 12px; line-height: 1.4;
        }
        .ad-live-bar-wrap {
          background: #f0eeeb; border-radius: 6px; height: 6px;
          overflow: hidden; margin-bottom: 6px;
        }
        .ad-live-bar {
          height: 100%; border-radius: 6px;
          background: linear-gradient(90deg, #e85d45, #f59e0b);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ad-live-meta {
          display: flex; justify-content: space-between;
          font-size: 11px; color: #bbb;
        }

        /* Idle state */
        .ad-idle {
          background: #faf9f7; border: 1px solid #eceae7;
          border-radius: 14px; padding: 20px;
          text-align: center; margin-bottom: 18px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }
        .ad-idle-icon { font-size: 28px; margin-bottom: 8px; }
        .ad-idle-text { font-size: 13px; color: #bbb; }

        .ad-sec-title {
          font-size: 10px; font-weight: 700; color: #ccc;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 12px; padding: 0 2px;
        }

        /* Timeline */
        .ad-timeline { position: relative; padding-left: 22px; margin-bottom: 20px; }
        .ad-timeline::before {
          content: ''; position: absolute; left: 5px; top: 6px; bottom: 6px;
          width: 1.5px; background: #eceae7;
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
          box-shadow: 0 0 0 1px #eceae7;
        }
        .ad-tl-dot.task { background: #4f8cff; }
        .ad-tl-dot.chat { background: #a855f7; }
        .ad-tl-dot.analysis { background: #f59e0b; }
        .ad-tl-dot.report { background: #10b981; }
        .ad-tl-text { font-size: 13px; color: #555; line-height: 1.4; }
        .ad-tl-time { font-size: 11px; color: #ccc; margin-top: 2px; }

        /* Agent Conversations */
        .ad-conv { margin-bottom: 16px; }
        .ad-conv-header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 10px;
          padding: 8px 12px;
          background: #faf9f7; border-radius: 10px;
          border: 1px solid #f0eeeb;
        }
        .ad-conv-av {
          width: 24px; height: 24px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 10px; font-weight: 700;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .ad-conv-label {
          font-size: 12px; font-weight: 600; color: #888;
        }
        .ad-conv-label span { color: #555; }
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
          color: #444;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }
        .ad-bubble.from-other {
          background: #fff;
          border: 1px solid #eceae7;
          color: #555;
          border-bottom-left-radius: 4px;
        }
        .ad-bubble-time { font-size: 10px; color: #ccc; margin-top: 3px; text-align: right; }
        .ad-no-conv {
          text-align: center; padding: 16px;
          font-size: 13px; color: #ccc;
          background: #faf9f7; border-radius: 10px;
          border: 1px solid #f0eeeb;
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
          <div className="sb-foot">
            <div className="sb-av">U</div>
            <div><div className="sb-nm">User</div><div className="sb-em">user@miraee.com</div></div>
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
                    <Image src="/logo_main.png" alt="Miraee" width={52} height={52} style={{ objectFit: "contain" }} />
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
            <button onClick={() => setRightPanelOpen(false)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "16px" }}>✕</button>
          </div>
          <div className="rp-bd">
            {/* ── Section 1: Your Agent ── */}
            <div className="rp-sec">
              <div className="rp-sec-t">Your Agent</div>
              <div className="my-agent-card">
                <div className="my-agent-user">
                  <div className="my-agent-av">U</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>User</div>
                    <div style={{ fontSize: "11px", color: "#bbb" }}>user@miraee.com</div>
                  </div>
                </div>
                <div className="my-agent-bot">
                  <div className="my-agent-bot-av">🤖</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>Miraee Pro</div>
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
