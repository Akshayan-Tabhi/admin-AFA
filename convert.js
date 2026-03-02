const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const classMap = {
  // Global & Dash
  'dash': 'flex h-screen overflow-hidden bg-[#f4f4f8] text-[#2d2d3a]',
  // Sidebar
  'sb': 'w-[280px] bg-gradient-to-b from-white to-[#fbfbfe] flex flex-col transition-[width] duration-350 shrink-0 overflow-hidden border-r border-black/[0.06] shadow-[2px_0_24px_rgba(0,0,0,0.03),4px_0_8px_rgba(0,0,0,0.01)] md:static fixed z-[100] h-screen',
  'hide': '!w-0 !border-r-0 !shadow-none',
  'sb-head': 'p-[18px_16px_14px] flex items-center justify-between border-b border-[#ececf0]',
  'sb-logo-wrap': 'flex items-center gap-[10px]',
  'sb-logo-badge': 'w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#e85d45] to-[#c73a28] flex items-center justify-center shadow-[0_3px_10px_rgba(232,93,69,0.2)]',
  'sb-logo-text': 'text-[16px] font-bold text-[#1a1a2e] tracking-tight',
  'sb-x': 'w-[30px] h-[30px] flex items-center justify-center bg-[#f4f4f8] hover:bg-[#e8e8ee] border-none rounded-[8px] text-[#b0b0be] hover:text-[#888] cursor-pointer text-[13px] transition-all duration-200',
  'sb-new': 'm-[14px_14px_6px] p-[12px_16px] flex items-center gap-[9px] bg-gradient-to-br from-[#e85d45] to-[#c73a28] border-none text-white rounded-[12px] cursor-pointer text-[13px] font-semibold tracking-[0.01em] transition-all duration-300 shadow-[0_4px_16px_rgba(232,93,69,0.25),0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(232,93,69,0.3),0_2px_6px_rgba(0,0,0,0.1)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(232,93,69,0.2)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent before:pointer-events-none',
  'sb-list': 'flex-1 overflow-y-auto p-[6px_10px] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#dddde5] [&::-webkit-scrollbar-thumb]:rounded-[3px]',
  'sb-lbl': 'p-[14px_8px_6px] text-[10px] font-bold text-[#b5b5c4] uppercase tracking-[0.1em]',
  'sb-it': 'p-[10px_12px] rounded-[10px] cursor-pointer flex items-center gap-[10px] transition-all duration-200 mb-[3px] border border-transparent hover:bg-[#f7f7fa] hover:border-[#ececf0] hover:shadow-[0_1px_6px_rgba(0,0,0,0.03)] group',
  'sb-it.on': 'bg-[#e85d45]/5 border-[#e85d45]/10 shadow-[0_2px_10px_rgba(232,93,69,0.06)]',
  'sb-it-icon': 'w-[30px] h-[30px] rounded-[8px] bg-[#f4f4f8] flex items-center justify-center shrink-0 text-[#b0b0be] text-[12px] transition-all duration-200 group-[.on]:bg-[#e85d45]/10 group-[.on]:text-[#e85d45]',
  'sb-it-t': 'text-[13px] text-[#8a8a9a] whitespace-nowrap overflow-hidden text-ellipsis flex-1 group-[.on]:text-[#2d2d3a] group-[.on]:font-semibold',
  'sb-it-d': 'opacity-0 bg-transparent border-none text-[#c5c5d0] cursor-pointer text-[11px] p-[4px_6px] rounded-[6px] transition-all duration-150 shrink-0 group-hover:opacity-100 hover:!text-[#e85d45] hover:!bg-[#e85d45]/5',
  
  // Profile (in Sidebar)
  'sb-foot': 'p-[14px_16px] border-t border-[#ececf0] flex items-center gap-[11px] bg-[#f9f9fc] hover:bg-black/[0.02] transition-colors',
  'sb-av': 'w-[38px] h-[38px] rounded-[12px] bg-gradient-to-br from-[#e85d45] to-[#c73a28] flex items-center justify-center text-white text-[14px] font-bold shrink-0 shadow-[0_3px_10px_rgba(232,93,69,0.2)] relative after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[10px] after:h-[10px] after:rounded-full after:bg-[#10b981] after:border-[2px] after:border-[#f9f9fc] after:shadow-[0_0_6px_rgba(16,185,129,0.3)]',
  'sb-nm': 'text-[13px] font-semibold text-[#2d2d3a]',
  'sb-em': 'text-[11px] text-[#9ca3af]',
  'profile-menu-wrap': 'relative mt-auto w-full border-t border-[#ececf0]',
  
  // Profile Menu Dropdown (Converted later to Shadcn DropdownMenu, but keeping classes if they used native HTML)
  'profile-menu': 'absolute bottom-[calc(100%+12px)] left-[16px] w-[calc(100%-32px)] bg-white/85 backdrop-blur-xl border border-black/5 rounded-[16px] p-[6px] z-[999] shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.02)] origin-bottom-left animate-in fade-in zoom-in-95 duration-200',
  'pm-head': 'p-[12px] border-b border-black/[0.04] flex items-center gap-[10px] mb-[4px]',
  'pm-info': 'flex-1 min-w-0',
  'pm-name': 'text-[14px] font-semibold text-[#1a1a2e]',
  'pm-email': 'text-[11px] text-[#8a8a9a] whitespace-nowrap overflow-hidden text-ellipsis',
  'pm-plan': 'inline-flex items-center justify-center bg-gradient-to-br from-[#e85d45] to-[#c73a28] text-white text-[9px] font-[800] uppercase p-[3px_8px] rounded-[6px] tracking-[0.05em] shadow-[0_2px_8px_rgba(232,93,69,0.3)]',
  'pm-item': 'w-full flex items-center gap-[10px] p-[10px_12px] border-none bg-transparent rounded-[10px] cursor-pointer text-[#3d3d4e] text-[13px] font-medium transition-all duration-200 text-left hover:bg-black/5 hover:text-[#1a1a2e] group',
  'pm-item-icon': 'text-[#8a8a9a] flex transition-colors duration-200 group-hover:text-[#5c5c6e]',
  'pm-logout': 'text-[#dc2626] mt-[4px] hover:!bg-[#dc2626]/10 hover:!text-[#b91c1c] group/logout',
  
  // Main
  'main': 'flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#f9f9fc] via-[#f3f3f8] to-[#eff0f5]',
  'top': 'h-[60px] flex items-center p-[0_24px] gap-[12px] shrink-0 bg-white/75 backdrop-blur-xl border-b border-black/5 shadow-[0_1px_8px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.01)]',
  'top-btn': 'w-[38px] h-[38px] flex items-center justify-center bg-white/80 border border-black/5 rounded-[10px] cursor-pointer text-[#999] transition-all duration-250 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:bg-white hover:border-black/10 hover:text-[#666] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]',
  'top-btn.on': 'bg-[#e85d45]/5 border-[#e85d45]/20 text-[#e85d45]',
  'top-title': 'flex-1 text-[14px] font-semibold text-[#3d3d4e] tracking-[-0.01em]',

  // Chat Feed
  'chat-scroll': 'flex-1 overflow-y-auto p-[36px_28px_16px] md:p-[36px_28px_16px] p-[24px_16px_12px] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-[#dddde5] [&::-webkit-scrollbar-thumb]:rounded-[5px]',
  'chat-feed': 'max-w-[740px] w-full mx-auto',
  'welcome': 'h-full flex flex-col items-center justify-center gap-[20px] animate-in slide-in-from-bottom-5 fade-in duration-500',
  'welcome-logo': 'flex items-center justify-center relative mb-[4px] [&>img]:drop-shadow-[0_4px_16px_rgba(232,93,69,0.15)] after:absolute after:-inset-[24px] after:rounded-full after:bg-[radial-gradient(circle,rgba(232,93,69,0.06)_0%,transparent_70%)] after:-z-10 after:animate-pulse',
  'chips': 'flex flex-wrap gap-[10px] justify-center max-w-[560px] mt-[6px]',
  'chip': 'p-[11px_22px] bg-white/90 border border-black/5 rounded-[28px] text-[13px] font-medium text-[#777] cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md hover:border-[#e85d45]/30 hover:text-[#e85d45] hover:bg-white hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(232,93,69,0.1),0_2px_6px_rgba(0,0,0,0.04)]',
  'msg': 'flex gap-[14px] mb-[24px] animate-in slide-in-from-bottom-2 fade-in duration-300',
  'msg-av': 'w-[36px] h-[36px] rounded-[12px] flex items-center justify-center text-[12px] font-bold shrink-0 mt-[2px]',
  'msg-av.u': 'bg-gradient-to-br from-[#e85d45] to-[#c73a28] text-white shadow-[0_3px_12px_rgba(232,93,69,0.25)]',
  'msg-av.a': 'bg-gradient-to-br from-[#fafafe] to-[#f2f2f8] text-[#8a8a9a] border border-black/5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]',
  'msg-body': 'flex-1 min-w-0',
  'msg-who': 'text-[10px] font-bold text-[#b5b5c4] uppercase tracking-[0.08em] mb-[6px]',
  'msg-txt': 'text-[14px] leading-[1.75] text-[#3d3d4e] whitespace-pre-wrap break-words',
  'dots': 'flex gap-[5px] p-[16px_18px]',
  'dot': 'w-[7px] h-[7px] rounded-full bg-[#e85d45] opacity-40 animate-bounce',
  
  // Input
  'inp-wrap': 'p-[12px_28px_28px] md:p-[12px_28px_28px] p-[10px_16px_20px] shrink-0',
  'inp-box': 'max-w-[740px] mx-auto relative bg-white border-[1.5px] border-black/5 rounded-[18px] transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] focus-within:border-[#e85d45]/25 focus-within:shadow-[0_0_0_4px_rgba(232,93,69,0.05),0_12px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] focus-within:-translate-y-[1px]',
  'inp-send': 'absolute right-[10px] bottom-[10px] w-[42px] h-[42px] rounded-[12px] border-none bg-gradient-to-br from-[#e85d45] to-[#c73a28] text-white cursor-pointer flex items-center justify-center transition-all duration-300 shadow-[0_4px_18px_rgba(232,93,69,0.25),0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(232,93,69,0.3),0_2px_6px_rgba(0,0,0,0.1)] disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
  'inp-hint': 'text-center text-[11px] text-[#b5b5c4] mt-[12px] tracking-[0.01em]',

  // Right Panel
  'rp': 'w-[380px] bg-gradient-to-b from-white to-[#fbfbfe] border-l border-black/5 flex flex-col transition-[width] duration-350 shrink-0 overflow-hidden shadow-[-3px_0_24px_rgba(0,0,0,0.04),-1px_0_4px_rgba(0,0,0,0.01)] md:static fixed right-0 z-[100] h-screen',
  'rp-hd': 'p-[18px_22px] flex items-center justify-between border-b border-black/5 bg-white/60 backdrop-blur-md',
  'rp-bd': 'flex-1 overflow-y-auto p-[20px] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#dddde5] [&::-webkit-scrollbar-thumb]:rounded-[3px]',
  'rp-sec': 'mb-0 flex flex-col',
  'rp-sec-t': 'text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.1em] mb-[12px] px-[2px]',
  'rp-sep': 'h-[1px] w-full bg-[#e5e5ed] my-[18px]',

  // Agent Farm
  'my-agent-card': 'bg-gradient-to-br from-white to-[#f7f7fa] border border-[#e85d45]/10 rounded-[16px] p-[16px] shadow-[0_3px_16px_rgba(232,93,69,0.05),0_1px_3px_rgba(0,0,0,0.02)]',
  'my-agent-user': 'flex items-center gap-[10px] mb-[14px] pb-[12px] border-b border-[#e85d45]/10',
  'my-agent-av': 'w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-[#e85d45] to-[#c73a28] flex items-center justify-center text-white text-[13px] font-bold shadow-[0_3px_10px_rgba(232,93,69,0.25)]',
  'my-agent-bot': 'flex items-center gap-[10px]',
  'my-agent-bot-av': 'w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-[#f5f3f0] to-[#eceae7] flex items-center justify-center text-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]',
  'my-agent-status': 'inline-flex items-center gap-[4px] text-[11px] text-[#10b981] font-medium mt-[2px] before:w-[6px] before:h-[6px] before:rounded-full before:bg-[#10b981]',
  
  'af-search': 'relative mb-[14px]',
  'af-search-icon': 'absolute left-[12px] top-[14px] text-[#b5b5c4] pointer-events-none',
  'af-list': 'flex flex-col gap-[4px]',
  'af-agent': 'flex items-center gap-[10px] p-[10px_12px] rounded-[12px] cursor-pointer transition-all duration-250 border border-transparent hover:bg-black/5 hover:border-black/5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:translate-x-[2px] [&.picked]:bg-[#e85d45]/5 [&.picked]:border-[#e85d45]/10 [&.picked]:shadow-[0_2px_12px_rgba(232,93,69,0.06)] group',
  'af-agent-av': 'w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform duration-200 group-hover:scale-105',
  'af-agent-info': 'flex-1 min-w-0',
  'af-agent-name': 'text-[13px] font-semibold text-[#2d2d3a]',
  'af-agent-meta': 'text-[11px] text-[#9ca3af] whitespace-nowrap overflow-hidden text-ellipsis',
  'af-agent-dot': 'w-[7px] h-[7px] rounded-full shrink-0',
  
  // Agent Detail Overlay
  'agent-detail': 'absolute inset-0 bg-gradient-to-b from-white to-[#fbfbfe] flex flex-col z-10 animate-in slide-in-from-right duration-300',
  'ad-header': 'p-[16px_20px] flex items-center gap-[10px] border-b border-black/5 shrink-0 bg-white/70 backdrop-blur-md',
  'ad-back': 'w-[32px] h-[32px] flex items-center justify-center bg-black/5 border-none rounded-[9px] text-[#8a8a9a] cursor-pointer transition-colors hover:bg-black/10 hover:text-[#2d2d3a]',
  'ad-header-info': 'flex-1 min-w-0',
  'ad-header-name': 'text-[14px] font-bold text-[#1a1a2e]',
  'ad-header-sub': 'text-[11px] text-[#8a8a9a] whitespace-nowrap overflow-hidden text-ellipsis tracking-tight',
  'ad-body': 'flex-1 overflow-y-auto p-[20px_20px_40px] flex flex-col gap-[20px] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[#dddde5] [&::-webkit-scrollbar-thumb]:rounded-[3px]',
  'ad-idle': 'flex flex-col items-center justify-center p-[40px_20px] bg-[#f9f9fc] border border-[#ececf0] rounded-[14px]',
  'ad-idle-icon': 'text-[32px] mb-[12px] opacity-70 grayscale',
  'ad-idle-text': 'text-[13px] text-[#9ca3af] font-medium',
  
  'ad-live': 'bg-gradient-to-br from-[#1a1a2e] to-[#2d2d3a] rounded-[16px] p-[18px] text-white shadow-[0_8px_24px_rgba(26,26,46,0.15)] relative overflow-hidden',
  'ad-live-badge': 'inline-flex items-center gap-[6px] bg-[#e85d45]/20 text-[#ff806b] text-[9px] font-bold uppercase p-[4px_10px] rounded-full tracking-[0.1em] mb-[12px] border border-[#e85d45]/30',
  'ad-live-pulse': 'w-[6px] h-[6px] rounded-full bg-[#ff4757] shadow-[0_0_8px_#ff4757] animate-pulse',
  'ad-live-title': 'text-[14px] font-semibold leading-snug mb-[16px] pr-[10px]',
  'ad-live-bar-wrap': 'h-[6px] bg-white/10 rounded-full overflow-hidden mb-[10px]',
  'ad-live-bar': 'h-full bg-gradient-to-r from-[#e85d45] to-[#f43f5e] rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(232,93,69,0.5)]',
  'ad-live-meta': 'flex items-center justify-between text-[11px] font-medium text-white/50 tracking-tight',
  
  'ad-live-conv': 'border border-[#e85d45]/20 bg-white rounded-[16px] shadow-[0_4px_24px_rgba(232,93,69,0.06)] overflow-hidden flex flex-col relative',
  'ad-lc-header': 'p-[14px_16px] bg-[#fffaf9] border-b border-[#e85d45]/15 flex items-center justify-between',
  'ad-lc-badge': 'inline-flex items-center gap-[6px] text-[#e85d45] text-[9px] font-bold uppercase tracking-[0.1em] bg-[#e85d45]/10 p-[4px_8px] rounded-full',
  'ad-lc-agents': 'flex items-center gap-[8px] text-[#b5b5c4] text-[12px]',
  'mini-av': 'w-[20px] h-[20px] rounded-[6px] flex items-center justify-center text-white text-[9px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
  'ad-lc-body': 'p-[16px] flex flex-col gap-[12px] bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] flex-1',
  'ad-lc-msg': 'text-[13px] leading-tight p-[8px_12px] rounded-[10px] max-w-[90%] relative shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
  'ad-lc-msg-name': 'font-bold text-[9px] uppercase tracking-wide mb-[2px] opacity-70',
  'ad-lc-typing': 'text-[11px] text-[#9ca3af] font-medium flex items-center gap-[8px] italic mt-[4px]',
  'ad-lc-typing-dots': 'flex gap-[3px] [&>span]:w-[4px] [&>span]:h-[4px] [&>span]:bg-[#9ca3af] [&>span]:rounded-full [&>span]:animate-bounce',
  
  'ad-sec-title': 'text-[11px] font-bold text-[#1a1a2e] uppercase tracking-[0.08em] border-b border-black/5 pb-[8px]',
  'ad-timeline': 'flex flex-col gap-[14px] pl-[6px] border-l-[2px] border-black/5 ml-[8px]',
  'ad-tl-item': 'relative pl-[20px]',
  'ad-tl-dot': 'absolute left-[-25px] top-[4px] w-[10px] h-[10px] rounded-full border-[2px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]',
  'ad-tl-text': 'text-[13px] text-[#2d2d3a] font-medium leading-snug',
  'ad-tl-time': 'text-[11px] text-[#9ca3af] mt-[2px]',
  
  'ad-conv': 'bg-white border border-[#ececf0] rounded-[14px] p-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)]',
  'ad-conv-header': 'flex items-center gap-[8px] mb-[14px] pb-[10px] border-b border-[#f4f4f8]',
  'ad-conv-av': 'w-[24px] h-[24px] rounded-[7px] flex items-center justify-center text-white text-[10px] font-bold shadow-[0_1px_4px_rgba(0,0,0,0.1)]',
  'ad-conv-label': 'text-[12px] font-semibold text-[#8a8a9a] [&>span]:text-[#5c5c6e]',
  'ad-bubble': 'p-[10px_14px] rounded-[12px] text-[13px] leading-snug mb-[6px] max-w-[92%] shadow-[0_1px_4px_rgba(0,0,0,0.03)]',
  'ad-bubble-time': 'text-[10px] text-[#b5b5c4] mt-[3px]',
  'ad-no-conv': 'text-center p-[16px] text-[13px] text-[#b5b5c4] bg-[#f7f7fa] rounded-[10px] border border-[#ececf0]',
};


// Safe replacement function inside className properties
content = content.replace(/className=(["'])(.*?)\1|className=\{`([^`]*?)`\}/g, (match, quote, p1, p3) => {
  let isTemplate = !quote;
  let str = isTemplate ? p3 : p1;
  
  if (!str) return match;

  let newStr = str.split(/\s+/).map(kls => {
    return classMap[kls] ? classMap[kls] : kls;
  }).join(' ');
  
  if (isTemplate) {
    return `className={\`${newStr}\`}`;
  } else {
    return `className="${newStr}"`;
  }
});

// Advanced replacements that are JS logic specific
content = content.replace(/className=\{`sb-it \$\{s\.id === activeSessionId \? "on" : ""\}`\}/g, 
  'className={`p-[10px_12px] rounded-[10px] cursor-pointer flex items-center gap-[10px] transition-all duration-200 mb-[3px] border hover:bg-[#f7f7fa] hover:border-[#ececf0] hover:shadow-[0_1px_6px_rgba(0,0,0,0.03)] group ${s.id === activeSessionId ? "bg-[#e85d45]/5 border-[#e85d45]/10 shadow-[0_2px_10px_rgba(232,93,69,0.06)]" : "border-transparent"}`}');

content = content.replace(/className=\{`top-btn \$\{rightPanelOpen \? "on" : ""\}`\}/g, 
  'className={`w-[38px] h-[38px] flex items-center justify-center border rounded-[10px] cursor-pointer transition-all duration-250 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:-translate-y-[1px] ${rightPanelOpen ? "bg-[#e85d45]/5 border-[#e85d45]/20 text-[#e85d45] hover:bg-[#e85d45]/10 hover:border-[#e85d45]/30" : "bg-white/80 border-black/5 text-[#999] hover:bg-white hover:border-black/10 hover:text-[#666] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)]"}`}');

content = content.replace(/className=\{`af-agent \$\{selectedAgent === agent\.id \? "picked" : ""\}`\}/g,
  'className={`flex items-center gap-[10px] p-[10px_12px] rounded-[12px] cursor-pointer transition-all duration-250 border group hover:translate-x-[2px] ${selectedAgent === agent.id ? "bg-[#e85d45]/5 border-[#e85d45]/10 shadow-[0_2px_12px_rgba(232,93,69,0.06)]" : "border-transparent hover:bg-black/5 hover:border-black/5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"}`}');

content = content.replace(/className=\{`msg-av \$\{m\.role === "user" \? "u" : "a"\}`\}/g, 
  'className={`w-[36px] h-[36px] rounded-[12px] flex items-center justify-center text-[12px] font-bold shrink-0 mt-[2px] ${m.role === "user" ? "bg-gradient-to-br from-[#e85d45] to-[#c73a28] text-white shadow-[0_3px_12px_rgba(232,93,69,0.25)]" : "bg-gradient-to-br from-[#fafafe] to-[#f2f2f8] text-[#8a8a9a] border border-black/5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"}`}');

content = content.replace(/className="msg ai"/g, 'className="flex gap-[14px] mb-[24px] animate-in slide-in-from-bottom-2 fade-in duration-300 ai"');
content = content.replace(/className=\{`msg \$\{m\.role === "assistant" \? "ai" : ""\}`\}/g, 'className={`flex gap-[14px] mb-[24px] animate-in slide-in-from-bottom-2 fade-in duration-300 ${m.role === "assistant" ? "ai" : ""}`}');
content = content.replace(/className="msg-txt"/g, 'className="text-[14px] leading-[1.75] text-[#3d3d4e] whitespace-pre-wrap break-words [.ai_&]:bg-white [.ai_&]:border [.ai_&]:border-black/5 [.ai_&]:rounded-[16px] [.ai_&]:p-[18px_20px] [.ai_&]:shadow-[0_2px_16px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]"');

content = content.replace(/className=\{`ad-lc-msg \$\{msg\.from === viewedAgent\.name \? "self" : "other"\}`\}/g, 
  'className={`text-[13px] leading-tight p-[8px_12px] rounded-[10px] max-w-[90%] relative shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${msg.from === viewedAgent.name ? "bg-gradient-to-br from-[#e85d45] to-[#c73a28] text-white self-end rounded-br-[4px]" : "bg-black/5 text-[#3d3d4e] self-start rounded-bl-[4px]"}`}');

content = content.replace(/className=\{`ad-bubble \$\{msg\.from === viewedAgent\.name \? "from-self" : "from-other"\}`\}/g, 
  'className={`p-[10px_14px] rounded-[12px] text-[13px] leading-snug mb-[6px] max-w-[92%] shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${msg.from === viewedAgent.name ? "bg-[#e85d45]/[0.06] border border-[#e85d45]/10 text-[#3d3d4e] ml-auto rounded-br-[4px]" : "bg-white border border-[#e5e5ed] text-[#5c5c6e] rounded-bl-[4px]"}`}');

content = content.replace(/className=\{`af-agent-dot \$\{agent\.status === "online" \? "on" : agent\.status === "away" \? "away" : "off"\}`\}/g, 
  'className={`w-[7px] h-[7px] rounded-full shrink-0 ${agent.status === "online" ? "bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.3)]" : agent.status === "away" ? "bg-[#f59e0b] shadow-[0_0_6px_rgba(245,158,11,0.3)]" : "bg-[#d1d5db]"}`}');

content = content.replace(/className=\{`af-agent-dot \$\{viewedAgent\.status === "online" \? "on" : viewedAgent\.status === "away" \? "away" : "off"\}`\}/g, 
  'className={`w-[7px] h-[7px] rounded-full shrink-0 ${viewedAgent.status === "online" ? "bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.3)]" : viewedAgent.status === "away" ? "bg-[#f59e0b] shadow-[0_0_6px_rgba(245,158,11,0.3)]" : "bg-[#d1d5db]"}`}');

content = content.replace(/className=\{`ad-tl-dot \$\{h\.type\}`\}/g, 
  'className={`absolute left-[-25px] top-[4px] w-[10px] h-[10px] rounded-full border-[2px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)] ${h.type === "task" ? "bg-[#4f8cff]" : h.type === "chat" ? "bg-[#a855f7]" : h.type === "analysis" ? "bg-[#ec4899]" : h.type === "report" ? "bg-[#f59e0b]" : "bg-[#d1d5db]"}`}');

content = content.replace(/<style jsx global>\{\`[\s\S]*?`\}<\/style>/, '');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Conversion completed safely.');
