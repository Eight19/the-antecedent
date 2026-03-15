import { useState, useEffect, useRef } from "react";
import { BCABA_DOMAINS } from "./bcaba-data.js";
import { BCBA_DOMAINS } from "./bcba-data.js";

// ─── EARTH TONE DESIGN TOKENS ────────────────────────────────────────
const C = {
  // Base surfaces
  ivory:    "#FAF6EF",   // warm page background
  linen:    "#F2EBE0",   // card backgrounds, subtle surfaces
  sand:     "#E8DDD0",   // borders, dividers
  parchment:"#DDD0C0",   // stronger borders, inactive states

  // Terracotta family — primary accent
  terra:    "#C0614A",   // primary action, headers, CTAs
  clay:     "#A8503C",   // darker terracotta for hover/pressed
  blush:    "#E8C4B4",   // light terracotta for backgrounds
  rose:     "#D4906A",   // mid terracotta, tags, accents

  // Sage family — secondary accent
  sage:     "#6B8F6E",   // sage green accent
  leaf:     "#557A58",   // darker sage
  mist:     "#C4D9C6",   // light sage backgrounds
  meadow:   "#8FAD8C",   // mid sage

  // Warm neutrals — text
  bark:     "#2E1E0E",   // darkest text, headings
  umber:    "#5C3D22",   // body text, strong secondary
  dusk:     "#8B6347",   // muted secondary text
  stone:    "#B09880",   // placeholder, disabled, hint text

  // Deep accent — headers, nav
  walnut:   "#3C2415",   // deep warm brown, nav background
  espresso: "#2A1608",   // darkest, header gradient start
  copper:   "#C47E3C",   // warm gold accent

  white:    "#FFFFFF",
};

// ─── POINTS CONFIG ─────────────────────────────────────────────────
const POINT_ACTIONS = {
  openApp:      { pts:2,  label:"Opening the app"              },
  readMessage:  { pts:3,  label:"Reading a kindness note"      },
  saveMessage:  { pts:5,  label:"Saving a note"                },
  completeTask: { pts:10, label:"Completing a lesson"          },
  checkIn:      { pts:4,  label:"Daily mood check-in"          },
  readResource: { pts:5,  label:"Visiting a resource"          },
  readGuide:    { pts:8,  label:"Reading a conversation guide" },
  shareWin:     { pts:15, label:"Sharing a win"                },
};

const BADGES = [
  { id:"first_day",   icon:"*", name:"First Steps",      desc:"You showed up.",           pts:0   },
  { id:"week_1",      icon:"*", name:"Showing Up",       desc:"Earned 50+ points",        pts:50  },
  { id:"learner",     icon:"*", name:"Knowledge Seeker", desc:"Completed 5 lessons",      pts:100 },
  { id:"kind_heart",  icon:"*", name:"Kind Heart",       desc:"Earned 200+ points",       pts:200 },
  { id:"resilient",   icon:"*", name:"Resilient",        desc:"Earned 350+ points",       pts:350 },
  { id:"rising_star", icon:"*", name:"Rising Star",      desc:"Earned 500+ points",       pts:500 },
  { id:"luminary",    icon:"*", name:"Luminary",         desc:"Earned 750+ points",       pts:750 },
];

// ─── MESSAGE LIBRARY ─────────────────────────────────────────────────
// Perspectives removed from display — content speaks for itself
const MESSAGES = [
  { id:1,  cat:"encouragement", color:C.sage,
    title:"You showed up. That's everything.",
    body:"On the days when the drive is long, the session is hard, and nothing seems to click — the fact that you walked through that door matters more than you know. Showing up IS the intervention.", tag:"Burnout Prevention" },
  { id:2,  cat:"encouragement", color:C.terra,
    title:"We see you working hard.",
    body:"Your team notices your growth even when it feels invisible. The careful way you implement a program. The extra moment you give a client to respond. The kindness in your voice when things get hard. We see it all.", tag:"Recognition" },
  { id:3,  cat:"wellness",      color:C.sage,
    title:"Name what you're feeling today.",
    body:"Stressed. Tired. Excited. Nervous. Proud. Whatever it is — name it before your session. Awareness of your own state makes you a better, more regulated presence for your clients.", tag:"Self-Awareness" },
  { id:4,  cat:"education",     color:C.umber,
    title:"Reinforcement is not the same as reward.",
    body:"Reinforcement is defined by its effect — if behavior increases, it was reinforcement. If it doesn't increase, it wasn't reinforcement, regardless of how 'nice' it seemed. Always let the data tell the story.", tag:"ABA Fundamentals" },
  { id:5,  cat:"encouragement", color:C.sage,
    title:"Your consistency changes lives.",
    body:"Research tells us that therapeutic consistency is one of the strongest predictors of client outcomes. Every time you show up prepared, warm, and steady — you are literally improving a child's future. That is not small.", tag:"Purpose" },
  { id:6,  cat:"wellness",      color:C.terra,
    title:"Rest is not a reward. It is a requirement.",
    body:"You cannot deliver compassionate, effective care from an empty place. Your mental health, your sleep, your boundaries — these are clinical tools. Protect them with the same seriousness you protect your client's dignity.", tag:"Self-Care" },
  { id:7,  cat:"education",     color:C.umber,
    title:"Behavior is communication.",
    body:"Before we call something challenging behavior, let's ask what it's communicating. Aggression may say this is too hard. Elopement may say I need a break. Every behavior has a message worth hearing.", tag:"Behavior Analysis" },
  { id:8,  cat:"encouragement", color:C.sage,
    title:"You are someone's favorite person.",
    body:"To at least one of your clients, you are the most exciting part of their day. They have learned to trust you. That trust is sacred, and you earned every bit of it through patience, consistency, and genuine care.", tag:"Meaning in the Work" },
  { id:9,  cat:"encouragement", color:C.copper,
    title:"Families trust you.",
    body:"When a family opens their front door and lets you into their child's life, that is the deepest form of trust. Honor it every day. You are not just staff — you are a beacon in their world.", tag:"Family Relationships" },
  { id:10, cat:"wellness",      color:C.sage,
    title:"Secondary trauma is real in this field.",
    body:"Working with families in pain, witnessing difficult behaviors, carrying others' hard days — it accumulates. If you're feeling numb, disconnected, or drained, that's a signal — not weakness. Please talk to someone you trust.", tag:"Mental Health" },
  { id:11, cat:"education",     color:C.umber,
    title:"The gentlest prompt is usually best first.",
    body:"We start with the least intrusive prompt before moving to more support. This says: I believe you can do this. Let me give you the chance to show me. Prompting is an act of respect.", tag:"Teaching Procedures" },
  { id:12, cat:"encouragement", color:C.terra,
    title:"The first ninety days are the hardest.",
    body:"The learning curve is steep, the emotions are big, and you will question yourself. That is completely normal. Every skilled clinician you admire felt exactly what you're feeling right now. Keep going.", tag:"New Staff" },
  { id:13, cat:"celebrate",     color:C.copper,
    title:"Happy Work Anniversary",
    body:"Every year in this field is a year of showing up for children and families who needed you. Work anniversaries in ABA are not just milestones — they are a testament to your heart and your resilience.", tag:"Celebration" },
  { id:14, cat:"celebrate",     color:C.copper,
    title:"You passed your RBT Exam.",
    body:"You studied, you prepared, and you showed up for that exam the same way you show up for your clients — with everything you have got. RBT Certified. That title belongs to you. We are so proud of you.", tag:"Milestone" },
  { id:15, cat:"wellness",      color:C.terra,
    title:"End your day with intention.",
    body:"Before you close your session notes, name one thing that went well today. Not for the data — for you. This small practice, done consistently, is one of the most powerful burnout prevention tools we know of.", tag:"Daily Practice" },
  { id:16, cat:"encouragement", color:C.sage,
    title:"Your path to BCBA is happening now.",
    body:"Every supervision hour, every data sheet, every tricky behavior you navigate thoughtfully — it's building the clinician you're becoming. The exam is the last step. The learning started on day one.", tag:"Career Growth" },
  { id:17, cat:"education",     color:C.umber,
    title:"Mand training is priority number one.",
    body:"Teaching a client to ask for what they want is the highest-priority language goal in ABA. A client who can communicate their needs is less likely to use behavior to communicate. Prioritize manding across all settings.", tag:"Verbal Behavior" },
  { id:18, cat:"encouragement", color:C.copper,
    title:"You belong in this field.",
    body:"Imposter syndrome is common, especially early on. But here is the truth: you were chosen, you were trained, and you are doing the work. Belonging is not something you earn after a certain number of sessions. You already belong.", tag:"Confidence" },
  { id:19, cat:"wellness",      color:C.sage,
    title:"You do not have to be okay all the time.",
    body:"This work is emotionally demanding by nature. On the days when you are not okay — please say so. To your supervisor, a colleague, someone who gets it. Silence does not make hard days easier. Connection does.", tag:"Vulnerability" },
  { id:20, cat:"education",     color:C.umber,
    title:"Build the relationship before you teach.",
    body:"Before running programs with a new client, spend time pairing yourself with reinforcement. Be the person who gives good things, plays preferred games, and makes no demands. A well-paired technician is a more effective one.", tag:"Therapeutic Relationship" },
];

// ─── RESOURCES ───────────────────────────────────────────────────────
const RESOURCES = [
  { category:"Official BACB Resources", color:C.walnut, items:[
    { title:"BACB Website",                      desc:"Certification requirements, ethics code, task lists, continuing education", url:"https://www.bacb.com" },
    { title:"BACB Ethics Code for RBTs",          desc:"The complete ethics code every RBT must know — read it, bookmark it",     url:"https://www.bacb.com/rbt-ethics-code/" },
    { title:"BACB Ethics Code for BCBAs/BCaBAs",  desc:"Full ethics code for supervisor-level practitioners",                      url:"https://www.bacb.com/ethics/ethics-codes/" },
    { title:"RBT Task List (3rd Edition)",         desc:"The official content outline for the RBT exam — effective 2026",          url:"https://www.bacb.com/rbt-task-list/" },
    { title:"BACB Newsletter",                    desc:"Stay current on policy updates, research, and field news",                  url:"https://www.bacb.com/bacb-newsletter/" },
  ]},
  { category:"Essential Books", color:C.umber, items:[
    { title:"Applied Behavior Analysis — Cooper, Heron & Heward", desc:"The gold standard textbook. If you own one ABA book, it's this one.", url:"https://www.pearson.com/en-us/subject-catalog/p/applied-behavior-analysis/P200000003498" },
    { title:"The ABA Big Book — Michael Maloney",                  desc:"Accessible and excellent for RBT and BCBA exam prep",               url:"https://www.amazon.com/ABA-BIG-BOOK-Michael-Maloney/dp/0966843517" },
    { title:"Verbal Behavior — B.F. Skinner",                      desc:"The foundational text for understanding language through behavioral analysis", url:"https://www.amazon.com/Verbal-Behavior-B-F-Skinner/dp/1614278121" },
    { title:"Ethics for Behavior Analysts — Bailey & Burch",       desc:"The most practical ethics guide for everyday ABA practice",         url:"https://www.routledge.com/Ethics-for-Behavior-Analysts/Bailey-Burch/p/book/9781138038370" },
    { title:"Behavioral Skills Training — Parsons, Rollyson & Reid",desc:"The definitive guide to BST — the supervision method you will use and receive", url:"https://www.amazon.com/Behavioral-Skills-Training-Program-Implementation/dp/0398092087" },
  ]},
  { category:"YouTube Channels", color:C.terra, items:[
    { title:"ABA Exam Review",                     desc:"Clear, high-quality exam prep for RBT and BCBA — one of the best free resources available", url:"https://www.youtube.com/@ABAExamReview" },
    { title:"Behavior Analyst Certification Board", desc:"Official BACB channel — ethics webinars, policy updates, professional development",        url:"https://www.youtube.com/@TheBACB" },
    { title:"Dr. Mary Barbera — Turn Autism Around",desc:"Verbal behavior and parent training content — accessible and practical",                   url:"https://www.youtube.com/@DrMaryBarbera" },
    { title:"Autism Partnership Foundation",        desc:"Evidence-based ABA explanations, research discussions, and clinical content",                url:"https://www.youtube.com/@AutismPartnershipFoundation" },
  ]},
  { category:"Career & Professional Growth", color:C.sage, items:[
    { title:"BACB Supervision Requirements", desc:"Step-by-step guide to finding a qualified supervisor for your BCBA hours",          url:"https://www.bacb.com/supervision/" },
    { title:"CEU Requirements & Providers",  desc:"Everything you need to know about maintaining your certification",                   url:"https://www.bacb.com/continuing-education/" },
    { title:"Journal of Applied Behavior Analysis", desc:"The premier peer-reviewed journal in ABA — free access to many articles",   url:"https://onlinelibrary.wiley.com/journal/19383703" },
    { title:"Behavior Analysis in Practice", desc:"Practitioner-focused research — more accessible and directly clinical",              url:"https://link.springer.com/journal/40617" },
  ]},
];

// ─── CONVERSATION GUIDES ─────────────────────────────────────────────
const CONVERSATIONS = [
  { id:"approach_bcba",       title:"Approaching your BCBA about a concern",          color:C.sage,
    intro:"This one takes courage — and you should feel proud for even wanting to do it right. Coming to your BCBA with a concern is not weakness. It is exactly what good clinical practice looks like.",
    context:"Maybe something in a session did not sit right. Maybe you noticed a pattern in the data. Maybe you are just not sure if what you are doing is working. Whatever it is — your observation matters. BCBAs need your eyes and your honesty.",
    doSay:[
      { label:"Opening the door",             text:"\"Hey, do you have a few minutes this week? I wanted to share something I noticed in session and get your thoughts.\"" },
      { label:"Describing what you observed", text:"\"I have noticed that [client] seems to escalate right when I introduce [task]. I wanted to make sure I am not missing something in how I am setting it up.\"" },
      { label:"Asking for guidance",          text:"\"I want to make sure I am implementing this correctly. Could you observe a session and give me feedback on my approach?\"" },
    ],
    avoid:"Do not open with 'I think the program is wrong' — even if that is what you suspect. Start with what you observed and let the conversation develop. Your BCBA will appreciate the data more than the conclusion.",
    reminder:"Your BCBA is on your team. A good one wants you to bring things to them. If bringing concerns forward ever feels punished, that is important information about the supervisory relationship — and a reason to seek support.",
  },
  { id:"disagree_supervisor", title:"Disagreeing professionally with a supervisor",   color:C.umber,
    intro:"Disagreeing with someone who has authority over you is one of the hardest professional skills to develop. The goal is not to win — it is to advocate for your client and your clinical reasoning without damaging the relationship.",
    context:"You have a right to your clinical observations and your questions. Professionalism does not mean silence — it means advocating through the right channels with the right tone.",
    doSay:[
      { label:"Framing it as a question",  text:"\"I want to make sure I understand the reasoning here — can you help me see why we are choosing this approach over [alternative]?\"" },
      { label:"Leading with the client",   text:"\"I am seeing [behavior] happen a lot, and I want to make sure our plan is addressing it effectively. I had a thought — would it be okay to share it?\"" },
      { label:"Acknowledging their view",  text:"\"I understand you have more context than I do. I just wanted to flag what I was observing so you had the full picture.\"" },
    ],
    avoid:"Do not bring disagreements up in front of clients, families, or colleagues. Do not frame it as you are wrong. And do not give up after one attempt — if you genuinely believe something matters clinically, you can revisit it respectfully.",
    reminder:"If a supervisor's decision creates an ethical concern — not just a clinical preference difference — that is a different situation. You may have an obligation to escalate. See the reporting ethics guide for that.",
  },
  { id:"ethics_report",       title:"Reporting an ethics concern up the chain",        color:C.terra,
    intro:"This is one of the bravest things you may ever have to do in your career. Reporting an ethics concern is not betrayal — it is exactly what the BACB Ethics Code asks of you. And it protects clients.",
    context:"If you have witnessed something that violates client dignity, falsifies data, uses unauthorized procedures, or harms someone — you have an ethical obligation to act. You do not have to be certain. You just have to report what you observed.",
    doSay:[
      { label:"Starting with your supervisor",     text:"\"I witnessed something in session that I want to make sure is documented and reviewed. Can I walk you through what I observed?\"" },
      { label:"If your supervisor is the concern", text:"\"I want to bring something to your attention that I believe may need review at a higher level. Can we talk?\"" },
      { label:"Writing it down first",             text:"Write out exactly what you observed — specific behaviors, dates, who was present. Keep it factual. 'At 2pm on Tuesday, I observed [specific action]' — not interpretations." },
    ],
    avoid:"Do not confront the person you are reporting in the moment. Do not investigate on your own. Do not wait to see if it happens again before reporting something serious. Document everything — the date you reported, to whom, and what was said.",
    reminder:"The BACB has a formal ethics complaint process at bacb.com. If a client is in immediate danger, safety comes before chain of command. You are not alone in this.",
  },
  { id:"family_situation",    title:"Navigating a difficult family or caregiver situation", color:C.copper,
    intro:"Families are not obstacles — they are the most important members of the treatment team. But working with caregivers under stress, with different values, or in disagreement with the plan requires real skill.",
    context:"You are a guest in their world. Every interaction with a caregiver is either building trust or eroding it. Your job is not to convince them — it is to collaborate with them.",
    doSay:[
      { label:"When a parent disagrees",          text:"\"I hear that this does not feel right to you. Can you help me understand what you are seeing at home? That context really matters for how we think about this.\"" },
      { label:"When a request is outside scope",  text:"\"That is a great question — I want to make sure you get the best answer. Let me loop in [BCBA name] so we can talk through that together.\"" },
      { label:"When a session went badly",        text:"\"I understand today was hard. I want you to know I am taking this seriously. Can we find a time to sit down with [BCBA] and talk through it?\"" },
    ],
    avoid:"Never make promises about outcomes. Never modify a program because a parent asked — that is your BCBA's role. Never take a parent's frustration personally, even if it feels directed at you.",
    reminder:"If a family situation feels unsafe — threats, harassment, or concerning behavior — that is an immediate supervisor notification. You do not have to manage safety alone.",
  },
  { id:"more_supervision",    title:"Asking for more supervision or support",          color:C.sage,
    intro:"Asking for more supervision is not an admission that you are struggling. It is a sign that you understand how learning works — and that you take your clients' outcomes seriously. The best technicians ask for more, not less.",
    context:"You are entitled to adequate supervision under the BACB Ethics Code. If you are not getting enough, or if it is not the kind that helps you grow, you can and should say something.",
    doSay:[
      { label:"Requesting observation time",         text:"\"I have been working on [skill/situation] and I would really benefit from having you observe and give me direct feedback. Would it be possible to schedule a session observation this week?\"" },
      { label:"Being specific about what you need",  text:"\"I feel confident on most programs, but I am less sure about [specific procedure]. Could we spend part of our next supervision meeting walking through it together?\"" },
      { label:"When meetings keep getting cancelled",text:"\"I want to make sure I am staying on track with my supervision hours and professional development. Can we protect a regular time that does not get bumped?\"" },
    ],
    avoid:"Do not wait until you are overwhelmed to ask. Do not assume your supervisor knows you need more — tell them. And do not frame it as a complaint — frame it around your growth and your clients.",
    reminder:"If supervision requirements are genuinely not being met, that is something you can bring to the BACB or your state licensing board. Your certification — and your clients — are worth protecting.",
  },
  { id:"coworker_limits",     title:"Setting limits with coworkers",                   color:C.umber,
    intro:"You spend a lot of time with your coworkers — in cars, in homes, in sessions next door. Limits at work are not walls. They are the thing that makes the relationship sustainable and the work environment healthy.",
    context:"Setting limits is not about being cold. It is about being clear — so both people know what to expect and the working relationship stays professional and respectful.",
    doSay:[
      { label:"When confidentiality is being crossed",  text:"\"Hey, I want to flag something — I know you are just venting, but some of those details are client information. Let us be careful about where we have these conversations.\"" },
      { label:"When you are being asked to overextend", text:"\"I want to help, and right now I am at capacity. Can we check in with [supervisor] to figure out what is most important to cover?\"" },
      { label:"When conduct feels unprofessional",      text:"\"I noticed [specific thing] and I wanted to mention it to you directly before it becomes a bigger issue. I am saying this because I respect you.\"" },
    ],
    avoid:"Do not triangulate — going to a third person before talking to the coworker directly, unless safety is involved. Do not make it personal. And do not assume bad intent — most people do not realize they are crossing a line.",
    reminder:"If a coworker's behavior is crossing into harassment, unsafe practice, or ethics violations — that is above a direct conversation. Document it and bring it to your supervisor. You do not have to fix systemic problems by yourself.",
  },
];

// ─── TYPOGRAPHY HELPERS ──────────────────────────────────────────────
const ss  = (sz,col,wt=400,ex={}) => ({fontSize:sz,color:col,fontWeight:wt,fontFamily:"'DM Sans',sans-serif",...ex});
const ser = (sz,col,wt=700,ex={}) => ({fontSize:sz,color:col,fontWeight:wt,fontFamily:"'Playfair Display',serif",...ex});
const ital= (sz,col,wt=400,ex={}) => ({fontSize:sz,color:col,fontWeight:wt,fontFamily:"'Lora',serif",fontStyle:"italic",...ex});

// ─── SHARED COMPONENTS ───────────────────────────────────────────────
function PBar({value,color,h=4}){
  return (
    <div style={{height:h,background:C.sand,borderRadius:h/2,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(100,value)}%`,background:color,borderRadius:h/2,transition:"width 0.6s ease"}}/>
    </div>
  );
}

function Tag({label,color}){
  return (
    <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:`${color}18`,border:`1px solid ${color}44`,fontSize:"10px",fontWeight:600,color,letterSpacing:"0.03em"}}>
      {label}
    </span>
  );
}

function CategoryDot({color}){
  return <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:color,flexShrink:0}}/>;
}

// ─── ONBOARDING ──────────────────────────────────────────────────────
function Onboarding({onDone}){
  const [step,setStep]=useState(0);
  const steps=[
    {
      content:(
        <div style={{textAlign:"center"}}>
          <div style={{width:64,height:2,background:`${C.terra}66`,margin:"0 auto 28px",borderRadius:1}}/>
          <div style={ser("38px",C.white,700,{lineHeight:1.1,marginBottom:10})}>The Antecedent</div>
          <div style={ital("17px","rgba(255,255,255,0.75)",400,{marginBottom:28,letterSpacing:"0.03em"})}>
            Showing up with kindness, on purpose.
          </div>
          <div style={{width:32,height:1,background:"rgba(255,255,255,0.2)",margin:"0 auto 24px"}}/>
          <p style={ss("14px","rgba(255,255,255,0.7)",400,{lineHeight:1.85,maxWidth:300,margin:"0 auto"})}>
            Before anything changes — something has to come first.
          </p>
        </div>
      )
    },
    {
      content:(
        <div style={{textAlign:"center"}}>
          <div style={{width:32,height:32,borderRadius:"50%",border:`1.5px solid ${C.terra}88`,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:C.terra}}/>
          </div>
          <div style={ser("22px",C.white,700,{lineHeight:1.4,marginBottom:16})}>
            "Let us not love with words<br/>or speech but with actions<br/>and in truth."
          </div>
          <div style={ital("13px","rgba(255,255,255,0.55)",400,{marginBottom:24})}>1 John 3:17–18</div>
          <p style={ss("13px","rgba(255,255,255,0.7)",400,{lineHeight:1.85,maxWidth:300,margin:"0 auto"})}>
            This app exists because love in action looks like showing up for each other — in a data sheet filled with integrity, in a session run with patience, in a colleague encouraged at the end of a hard day.
          </p>
        </div>
      )
    },
    {
      content:(
        <div style={{textAlign:"center"}}>
          <div style={ser("22px",C.white,700,{lineHeight:1.4,marginBottom:16})}>
            You were called<br/>to this work.
          </div>
          <p style={ss("13px","rgba(255,255,255,0.78)",400,{lineHeight:1.85,maxWidth:300,margin:"0 auto 18px"})}>
            The Antecedent was built for BTs, RBTs, BCaBAs, and BCBAs who want to grow — as clinicians, as professionals, and as people.
          </p>
          <p style={ital("13px","rgba(255,255,255,0.5)",400,{maxWidth:280,margin:"0 auto"})}>
            Encouragement. Education. Guidance. Resources. All with kindness, on purpose.
          </p>
        </div>
      )
    },
  ];

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(170deg,${C.espresso} 0%,${C.walnut} 45%,${C.umber} 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"64px 28px 48px",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lora:ital,wght@1,400;0,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      {/* Subtle texture rings */}
      {[{s:280,t:-60,l:-80,o:0.04},{s:200,b:60,r:-40,o:0.05}].map((r,i)=>(
        <div key={i} style={{position:"absolute",width:r.s,height:r.s,borderRadius:"50%",border:`1px solid ${C.terra}`,opacity:r.o,top:r.t,left:r.l,right:r.r,bottom:r.b,pointerEvents:"none"}}/>
      ))}

      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",width:"100%",maxWidth:360}}>
        {steps[step].content}
      </div>

      {/* Step dots */}
      <div style={{display:"flex",gap:8,marginBottom:28}}>
        {steps.map((_,i)=>(
          <div key={i} style={{width:i===step?22:7,height:7,borderRadius:4,background:i===step?C.terra:"rgba(255,255,255,0.2)",transition:"all 0.3s"}}/>
        ))}
      </div>

      <button onClick={()=>step<steps.length-1?setStep(s=>s+1):onDone()} style={{width:"100%",maxWidth:300,padding:"15px 0",borderRadius:14,background:C.terra,border:"none",cursor:"pointer",color:C.white,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"15px",letterSpacing:"0.02em"}}>
        {step<steps.length-1?"Continue":"Begin"}
      </button>
      {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif",fontSize:"12px",marginTop:12}}>Back</button>}
    </div>
  );
}

// ─── APP HEADER ──────────────────────────────────────────────────────
function AppHeader({points}){
  const currentBadge=BADGES.filter(b=>b.pts<=points).pop()||BADGES[0];
  const nextBadge=BADGES.find(b=>b.pts>points);
  const pct=nextBadge?Math.min(100,((points-(currentBadge?.pts||0))/((nextBadge?.pts||1)-(currentBadge?.pts||0)))*100):100;

  return (
    <div style={{background:`linear-gradient(170deg,${C.espresso} 0%,${C.walnut} 100%)`,padding:"20px 20px 0",position:"sticky",top:0,zIndex:40}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div>
          <div style={{display:"flex",alignItems:"baseline",gap:4}}>
            <span style={ser("11px","rgba(255,255,255,0.45)",400,{letterSpacing:"0.12em",textTransform:"uppercase"})}>The</span>
            <span style={ser("22px",C.white,700,{letterSpacing:"-0.01em"})}> Antecedent</span>
          </div>
          <div style={ital("11px","rgba(255,255,255,0.45)",400,{letterSpacing:"0.02em",marginTop:1})}>
            Showing up with kindness, on purpose.
          </div>
        </div>
        <div style={{textAlign:"right",background:"rgba(255,255,255,0.07)",borderRadius:12,padding:"7px 12px"}}>
          <div style={ss("17px",C.white,700,{textAlign:"center",lineHeight:1})}>{points}</div>
          <div style={ss("8px","rgba(255,255,255,0.4)",500,{textAlign:"center",letterSpacing:"0.06em",textTransform:"uppercase"})}>pts</div>
        </div>
      </div>
      {nextBadge&&(
        <div style={{marginBottom:14}}>
          <PBar value={pct} color={C.terra} h={2}/>
          <div style={ss("9px","rgba(255,255,255,0.3)",500,{marginTop:3,textAlign:"right"})}>{nextBadge.pts-points} pts to {nextBadge.name}</div>
        </div>
      )}
    </div>
  );
}

// ─── KINDNESS POPUP ──────────────────────────────────────────────────
function KindnessPopup({msg,onClose,onSave,saved}){
  const [vis,setVis]=useState(false);
  const [exit,setExit]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),40);return()=>clearTimeout(t);},[]);
  const close=()=>{setExit(true);setTimeout(onClose,380);};

  const catColors={encouragement:C.terra,wellness:C.sage,education:C.umber,celebrate:C.copper};
  const accent=catColors[msg.cat]||C.terra;

  return (
    <div onClick={close} style={{position:"fixed",inset:0,background:"rgba(30,15,5,0.55)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24,opacity:vis&&!exit?1:0,transition:"opacity 0.35s"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:370,background:C.ivory,borderRadius:24,boxShadow:`0 28px 70px rgba(30,15,5,0.3)`,padding:"28px 24px 22px",transform:vis&&!exit?"translateY(0) scale(1)":"translateY(30px) scale(0.94)",transition:"transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",borderTop:`3px solid ${accent}`}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <Tag label={msg.tag} color={accent}/>
          <div style={ser("20px",C.bark,700,{display:"block",lineHeight:1.35,marginTop:12})}>{msg.title}</div>
        </div>
        <p style={ss("13px",C.umber,400,{lineHeight:1.8,textAlign:"center",margin:"0 0 22px"})}>{msg.body}</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={close} style={{flex:1,padding:"11px 0",borderRadius:12,background:C.linen,border:`1px solid ${C.sand}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"13px",color:C.umber}}>Close</button>
          <button onClick={()=>{onSave(msg.id);close();}} style={{flex:1,padding:"11px 0",borderRadius:12,background:accent,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"13px",color:C.white}}>{saved?"Saved":"Save note"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── MOOD CHECK-IN ───────────────────────────────────────────────────
const MOODS=[
  {label:"Ready to shine",   color:C.copper,  msg:"What a beautiful energy to bring today. Let it carry you into every session."},
  {label:"Calm and grounded",color:C.sage,    msg:"Grounded is powerful. Your steadiness is felt by everyone around you."},
  {label:"Feeling grateful", color:C.terra,   msg:"Gratitude is contagious. Your clients will feel it before you say a word."},
  {label:"Nervous but here", color:C.umber,   msg:"Nervous means you care. That care is exactly what makes you good at this."},
  {label:"Still waking up",  color:C.dusk,    msg:"That is okay. You showed up anyway. That is the whole job, really."},
  {label:"Ready to work",    color:C.leaf,    msg:"Channel that energy. Your clients are ready for you."},
];

const AFFIRMATIONS=[
  "You are making a difference today.",
  "Kindness is a clinical superpower.",
  "You chose this field because you care. That matters.",
  "Every session is a chance to connect.",
  "This work is hard. You are harder.",
  "Someone is fortunate to have you as their technician.",
  "Your presence is part of the intervention.",
  "You are seen. You are valued. You belong here.",
  "Love in action — that is what you do every day.",
  "Before anything changes, something has to come first. You are that something.",
];

// ─── HOME TAB ────────────────────────────────────────────────────────
function HomeTab({profile,points,addPoints,setPopup,saved,setSaved,setTab}){
  const [mood,setMood]=useState(null);
  const [affIdx,setAffIdx]=useState(0);
  const poolRef=useRef([...MESSAGES]);

  useEffect(()=>{const t=setInterval(()=>setAffIdx(i=>(i+1)%AFFIRMATIONS.length),8000);return()=>clearInterval(t);},[]);

  const sendPop=()=>{
    if(poolRef.current.length===0)poolRef.current=[...MESSAGES];
    const idx=Math.floor(Math.random()*poolRef.current.length);
    const msg=poolRef.current.splice(idx,1)[0];
    setPopup(msg);
    addPoints("readMessage");
  };

  const todayMsg=MESSAGES[new Date().getDate()%MESSAGES.length];
  const currentBadge=BADGES.filter(b=>b.pts<=points).pop()||BADGES[0];
  const nextBadge=BADGES.find(b=>b.pts>points);
  const pct=nextBadge?Math.min(100,((points-(currentBadge?.pts||0))/((nextBadge?.pts||1)-(currentBadge?.pts||0)))*100):100;

  return (
    <div style={{padding:"18px 16px 100px"}}>
      {/* Affirmation strip */}
      <div style={{background:C.linen,borderRadius:14,padding:"12px 16px",marginBottom:14,borderLeft:`3px solid ${C.terra}`}}>
        <div style={ital("13px",C.umber,400,{lineHeight:1.6})}>{AFFIRMATIONS[affIdx]}</div>
      </div>

      {/* Progress card */}
      <div style={{background:C.linen,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={ss("10px",C.dusk,600,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6})}>{currentBadge.name} — {points} points</div>
          <PBar value={pct} color={C.terra} h={4}/>
          {nextBadge&&<div style={ss("10px",C.stone,500,{marginTop:4})}>{nextBadge.pts-points} pts to {nextBadge.name}</div>}
        </div>
      </div>

      {/* Mood check-in */}
      <div style={{background:C.white,borderRadius:18,padding:18,marginBottom:14,boxShadow:`0 2px 12px ${C.sand}`}}>
        <div style={ser("15px",C.bark,700,{marginBottom:12})}>How are you arriving today?</div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {MOODS.map(m=>(
            <button key={m.label} onClick={()=>{setMood(m);addPoints("checkIn");}} style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${mood?.label===m.label?m.color:C.sand}`,background:mood?.label===m.label?`${m.color}15`:C.linen,cursor:"pointer",fontSize:"11px",fontWeight:600,color:mood?.label===m.label?m.color:C.dusk,fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
              {m.label}
            </button>
          ))}
        </div>
        {mood&&<div style={ital("13px",C.umber,400,{marginTop:12,lineHeight:1.65})}>{mood.msg}</div>}
      </div>

      {/* Main CTA */}
      <button onClick={sendPop} style={{width:"100%",padding:"15px 0",borderRadius:16,background:`linear-gradient(135deg,${C.terra},${C.clay})`,border:"none",cursor:"pointer",color:C.white,fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:700,boxShadow:`0 6px 20px ${C.terra}44`,marginBottom:14,letterSpacing:"0.01em"}}>
        Send me a kindness note
      </button>

      {/* Quick access */}
      <div style={ser("14px",C.bark,700,{marginBottom:10})}>Where do you need support today?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        {[
          {tab:"learn",     label:"Learn and grow",         from:C.mist,  to:C.sage,  accent:C.sage},
          {tab:"support",   label:"Hard conversations",     from:C.blush, to:C.terra, accent:C.terra},
          {tab:"resources", label:"Resources and links",    from:C.linen, to:C.umber, accent:C.umber},
          {tab:"me",        label:"My journey",             from:C.linen, to:C.copper,accent:C.copper},
        ].map(c=>(
          <button key={c.tab} onClick={()=>setTab(c.tab)} style={{padding:"16px 14px",borderRadius:16,background:`linear-gradient(135deg,${c.from},${c.to}18)`,border:`1.5px solid ${c.from}`,cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform=""}>
            <div style={{width:24,height:3,borderRadius:2,background:c.accent,marginBottom:8}}/>
            <div style={ss("12px",C.bark,700,{lineHeight:1.3})}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Today's note */}
      <div style={ser("14px",C.bark,700,{marginBottom:10})}>Today's note</div>
      <div style={{background:C.white,borderRadius:18,overflow:"hidden",boxShadow:`0 2px 12px ${C.sand}`}}>
        <div style={{height:3,background:`linear-gradient(90deg,${todayMsg.color},${todayMsg.color}55)`}}/>
        <div style={{padding:18}}>
          <div style={{marginBottom:10}}><Tag label={todayMsg.tag} color={todayMsg.color}/></div>
          <div style={ser("16px",C.bark,700,{marginBottom:10})}>{todayMsg.title}</div>
          <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.8})}>{todayMsg.body}</p>
          <div style={{marginTop:12,display:"flex",justifyContent:"flex-end"}}>
            <button onClick={()=>{const ns=new Set(saved);ns.has(todayMsg.id)?ns.delete(todayMsg.id):ns.add(todayMsg.id);setSaved(ns);if(!saved.has(todayMsg.id))addPoints("saveMessage");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:"16px",color:saved.has(todayMsg.id)?C.copper:C.stone}}>
              {saved.has(todayMsg.id)?"♥":"♡"}
            </button>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div style={{marginTop:18,background:`linear-gradient(135deg,${C.espresso},${C.walnut})`,borderRadius:16,padding:18}}>
        <div style={ital("12px",`${C.terra}cc`,400,{marginBottom:8})}>Our Mission</div>
        <p style={ss("12px","rgba(255,255,255,0.7)",400,{lineHeight:1.85,margin:"0 0 10px"})}>
          The Antecedent was built on one belief: that the people who show up for others deserve someone showing up for them. Before anything changes in a client's life, something has to come first.
        </p>
        <div style={ital("11px","rgba(255,255,255,0.35)",400,{letterSpacing:"0.02em"})}>
          "Love in action. Not just words." — 1 John 3:17–18
        </div>
      </div>
    </div>
  );
}

// ─── SHARED CREDENTIAL STUDY MODULE (BCaBA + BCBA) ──────────────────
function CredentialStudyModule({label,edition,domains,accent,onBack,done,markDone,addPoints}){
  const [domain,setDomain]=useState(null);
  const [taskIdx,setTaskIdx]=useState(0);
  const [tab,setTab]=useState("learn");
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [flipped,setFlipped]=useState(false);

  const total=domains.reduce((s,d)=>s+d.tasks.length,0);
  const doneCount=domains.reduce((s,d)=>s+d.tasks.filter(t=>done[t.code]).length,0);
  const dom=domain?domains.find(d=>d.key===domain):null;
  const tasks=dom?.tasks||[];
  const task=tasks[taskIdx]||null;

  const switchTab=(t)=>{setTab(t);setSel(null);setAnswered(false);setFlipped(false);};
  const switchTask=(i)=>{setTaskIdx(i);switchTab("learn");};

  const handleAnswer=(qdata,i)=>{
    if(answered)return;
    setSel(i);setAnswered(true);
    if(i===qdata.a&&!done[task.code])markDone(task.code);
  };

  const renderQ=(qdata,type)=>(
    <div>
      <div style={{background:`${dom.color}12`,borderRadius:12,padding:12,marginBottom:12,borderLeft:`3px solid ${dom.color}`}}>
        {type==="sc"&&<div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3})}>Scenario</div>}
        <p style={ss("13px",C.bark,600,{margin:0,lineHeight:1.6})}>{qdata.q}</p>
      </div>
      {qdata.opts.map((o,i)=>{
        let bg=C.linen,bc=C.sand,tc=C.umber;
        if(answered){if(i===qdata.a){bg="#e8f0e8";bc=C.sage;tc="#2a5c2a";}else if(i===sel){bg="#f5e8e8";bc=C.terra;tc=C.terra;}}
        else if(i===sel){bg=`${dom.color}15`;bc=dom.color;}
        return <button key={i} onClick={()=>handleAnswer(qdata,i)} style={{width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${bc}`,background:bg,color:tc,marginBottom:7,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"12px",fontWeight:500,transition:"all 0.2s"}}>{String.fromCharCode(65+i)}. {o}</button>;
      })}
      {answered&&<div style={{background:"#e8f0e8",borderRadius:12,padding:12,marginTop:6,fontSize:"12px",color:"#2a5c2a",lineHeight:1.6}}>{qdata.ex}</div>}
    </div>
  );

  if(!domain) return (
    <div style={{padding:"18px 16px 100px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:12,padding:0}}>← Back</button>
      <div style={ser("18px",C.bark,700,{marginBottom:2})}>{label} Study Module</div>
      <div style={ss("11px",C.dusk,400,{marginBottom:10})}>{edition}</div>
      <div style={{marginBottom:14}}>
        <div style={ss("10px",C.dusk,600,{marginBottom:4})}>{doneCount} of {total} tasks completed</div>
        <PBar value={total?doneCount/total*100:0} color={accent} h={5}/>
      </div>
      {domains.map(d=>{
        const dc=d.tasks.filter(t=>done[t.code]).length;
        const pct=d.tasks.length?Math.round(dc/d.tasks.length*100):0;
        return (
          <div key={d.key} onClick={()=>{setDomain(d.key);setTaskIdx(0);switchTab("learn");}} style={{background:C.white,borderRadius:16,padding:"14px 16px",marginBottom:10,boxShadow:`0 1px 6px ${C.sand}`,borderLeft:`4px solid ${d.color}`,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 14px ${C.sand}`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 1px 6px ${C.sand}`}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <div style={ss("9px",d.color,700,{textTransform:"uppercase",letterSpacing:"0.07em"})}>Section {d.key} · {d.pct}</div>
                <div style={ser("14px",C.bark,700,{marginTop:1})}>{d.label}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={ss("15px",d.color,700)}>{pct}%</div>
                <div style={ss("9px",C.stone,400)}>{dc}/{d.tasks.length}</div>
              </div>
            </div>
            <PBar value={pct} color={d.color} h={3}/>
            <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
              {d.tasks.map(t=><span key={t.code} style={{fontSize:"9px",fontWeight:600,padding:"2px 7px",borderRadius:6,background:done[t.code]?`${d.color}22`:C.linen,color:done[t.code]?d.color:C.stone,border:`1px solid ${done[t.code]?d.color+"44":C.sand}`}}>{done[t.code]?"✓ ":""}{t.code}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{padding:"0 0 100px"}}>
      <div style={{background:`${dom.color}12`,padding:"18px 18px 0",borderBottom:`1px solid ${C.sand}`}}>
        <button onClick={()=>setDomain(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:8,padding:0}}>← All Sections</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.07em"})}>Section {domain} · {dom.label}</div>
            <div style={ser("15px",C.bark,700,{marginTop:2})}>{task?.code}: {task?.title}</div>
          </div>
          <div style={ss("11px",C.dusk,400)}>{taskIdx+1}/{tasks.length}</div>
        </div>
        <div style={{display:"flex",gap:5,marginTop:10,overflowX:"auto",scrollbarWidth:"none",paddingBottom:12}}>
          {tasks.map((t,i)=><button key={t.code} onClick={()=>switchTask(i)} style={{flexShrink:0,padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"9px",background:i===taskIdx?dom.color:done[t.code]?`${dom.color}22`:C.linen,color:i===taskIdx?C.white:done[t.code]?dom.color:C.stone,transition:"all 0.2s"}}>{done[t.code]?"✓ ":""}{t.code}</button>)}
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",gap:4,marginBottom:14}}>
          {[["learn","Learn"],["mc","Multiple Choice"],["sc","Scenario"],["fl","Flashcard"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>switchTab(id)} style={{flex:1,padding:"7px 0",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"10px",background:tab===id?dom.color:C.linen,color:tab===id?C.white:C.dusk,transition:"all 0.2s"}}>{lbl}</button>
          ))}
        </div>
        <div style={{background:C.white,borderRadius:18,padding:18,boxShadow:`0 1px 8px ${C.sand}`,border:`1px solid ${dom.color}22`}}>
          {tab==="learn"&&(
            <div>
              <div style={{background:`${dom.color}0A`,borderRadius:12,padding:12,marginBottom:12,borderLeft:`3px solid ${dom.color}`}}>
                <div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3})}>Concept</div>
                <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.75})}>{task.lesson}</p>
              </div>
              <div style={{marginBottom:10}}>
                <div style={ss("11px",C.bark,600,{marginBottom:4})}>Why it matters:</div>
                <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.75})}>{task.why}</p>
              </div>
              <div style={{marginBottom:10}}>
                <div style={ss("11px",C.bark,600,{marginBottom:4})}>Examples:</div>
                <ul style={{margin:0,paddingLeft:18}}>
                  {task.examples.map((e,i)=><li key={i} style={ss("12px",C.umber,400,{marginBottom:4,lineHeight:1.6})}>{e}</li>)}
                </ul>
              </div>
              <div style={{background:`${dom.color}0A`,borderRadius:12,padding:12,borderLeft:`3px solid ${dom.color}`}}>
                <div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3})}>Pro tip:</div>
                <p style={ss("12px",C.umber,400,{margin:0,lineHeight:1.65})}>{task.tip}</p>
              </div>
              {!done[task.code]&&<button onClick={()=>{markDone(task.code);addPoints("completeTask");}} style={{width:"100%",marginTop:12,padding:11,borderRadius:12,background:dom.color,color:C.white,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"13px"}}>Mark as learned</button>}
              {done[task.code]&&<div style={ss("13px",dom.color,700,{textAlign:"center",marginTop:10})}>Learned</div>}
            </div>
          )}
          {tab==="mc"&&task.mc&&renderQ(task.mc,"mc")}
          {tab==="sc"&&task.sc&&renderQ(task.sc,"sc")}
          {tab==="fl"&&task.fl&&(
            <div onClick={()=>{setFlipped(f=>!f);if(!flipped&&!done[task.code])markDone(task.code);}} style={{minHeight:140,borderRadius:14,cursor:"pointer",background:flipped?`${dom.color}10`:C.linen,border:`1.5px solid ${flipped?dom.color:C.sand}`,padding:20,textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",gap:8,transition:"all 0.3s"}}>
              <div style={ss("9px",flipped?dom.color:C.dusk,600,{textTransform:"uppercase",letterSpacing:"0.08em"})}>{flipped?"Answer":"Question — tap to flip"}</div>
              <p style={ser("13px",C.bark,700,{margin:0,lineHeight:1.7,whiteSpace:"pre-line"})}>{flipped?task.fl.b:task.fl.f}</p>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <button onClick={()=>{if(taskIdx>0)switchTask(taskIdx-1);}} disabled={taskIdx===0} style={{flex:1,padding:12,borderRadius:12,background:taskIdx===0?C.linen:C.white,border:`1.5px solid ${taskIdx===0?C.sand:dom.color}`,color:taskIdx===0?C.stone:C.umber,cursor:taskIdx===0?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"13px"}}>Previous</button>
          <button onClick={()=>taskIdx<tasks.length-1?switchTask(taskIdx+1):setDomain(null)} style={{flex:1,padding:12,borderRadius:12,background:dom.color,border:"none",color:C.white,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"13px"}}>{taskIdx<tasks.length-1?"Next":"Section done"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── RBT STUDY MODULE DATA ───────────────────────────────────────────
const RBT_DOMAINS=[
  {key:"A",label:"Data Collection & Graphing",color:C.sage,tasks:[
    {code:"A.1",title:"Continuous Measurement",lesson:"Continuous measurement records EVERY instance — frequency, duration, latency, and IRT.",why:"Provides precise, complete data. Essential when every occurrence matters.",examples:["Frequency: count each instance","Duration: how long it lasts","Latency: time from SD to response","IRT: time between responses"],tip:"Use continuous methods when behavior isn't too fast to count.",mc:{q:"Which records the TIME between end of one response and start of the next?",opts:["Duration","Latency","IRT","Frequency"],a:2,ex:"IRT measures time between consecutive responses — distinct from latency."},sc:{q:"BCBA wants to know how long each self-stim bout lasts. Best method?",opts:["Frequency","Duration","IRT","Permanent product"],a:1,ex:"Duration captures how long each instance lasts."},fl:{f:"What 4 dimensions does continuous measurement cover?",b:"1. Frequency — occurrences\n2. Duration — how long\n3. Latency — SD to response\n4. IRT — between responses"}},
    {code:"A.2",title:"Discontinuous Measurement",lesson:"Discontinuous methods sample behavior: partial interval, whole interval, or momentary time sampling (MTS).",why:"Used when continuous recording is impractical.",examples:["Partial interval: '+' if behavior occurs ANY part","Whole interval: '+' only if ENTIRE interval","MTS: observe only at END of interval"],tip:"Partial overestimates. Whole underestimates. MTS most accurate for prevalence.",mc:{q:"Which MOST LIKELY overestimates behavior frequency?",opts:["Whole interval","MTS","Partial interval","Duration"],a:2,ex:"Partial interval scores the whole interval if behavior occurs even briefly."},sc:{q:"You check on-task at the END of each 5-min interval only. This is:",opts:["Partial interval","Whole interval","MTS","Frequency"],a:2,ex:"Observing only at interval end moment = MTS."},fl:{f:"Whole vs. Partial — which over/underestimates?",b:"Whole UNDERESTIMATES (must fill entire interval)\nPartial OVERESTIMATES (any occurrence scores full interval)"}},
    {code:"A.3",title:"Permanent Product Recording",lesson:"Measures the physical outcome of behavior after it occurred rather than observing directly.",why:"Useful when you cannot observe the behavior live.",examples:["Completed worksheets","Assembled items","Written words"],tip:"The product must reliably indicate the behavior.",mc:{q:"Teacher counts completed math problems after the session. This is:",opts:["Frequency","MTS","Permanent product","Duration"],a:2,ex:"Counting the outcome after behavior occurred = permanent product."},sc:{q:"You check sorted objects after a task — you didn't observe the sorting. This is:",opts:["Partial interval","Latency","Permanent product","Continuous"],a:2,ex:"Measuring the lasting product of behavior = permanent product recording."},fl:{f:"What is permanent product recording?",b:"Measuring the physical result remaining after behavior occurs — evidence of behavior without direct observation."}},
    {code:"A.4",title:"Enter Data & Update Graphs",lesson:"Data must be entered accurately and promptly. Graphs updated regularly so clinical decisions reflect current information.",why:"Missing or outdated data prevents BCBAs from making timely decisions.",examples:["Enter session data same day","Plot on correct session","Connect points only within same phase","Phase change lines mark condition changes"],tip:"Never reconstruct data from memory. Note uncertainty and report to BCBA.",mc:{q:"What does a phase change line on a graph represent?",opts:["Missed session","Conditions changed","Data error","End of month"],a:1,ex:"Phase change lines mark when conditions changed."},sc:{q:"You forgot to collect data during two trials. You should:",opts:["Fill in estimated data","Leave blank and note to BCBA","Mark as correct","Skip in graph"],a:1,ex:"Never fabricate data. Document honestly and report to BCBA."},fl:{f:"X and Y axes of a behavior graph?",b:"X-axis: time / sessions / dates\nY-axis: the behavior measure (frequency, %, duration, rate)"}},
    {code:"A.5",title:"Describe Behavior in Observable Terms",lesson:"Operational definitions describe behavior precisely enough that two observers record the same event the same way.",why:"Vague definitions lead to unreliable data and poor clinical decisions.",examples:["Poor: 'had a tantrum'","Better: 'dropped to floor, cried loudly for ≥10 seconds'"],tip:"Stranger test: could someone unfamiliar with your client use this consistently?",mc:{q:"Which is the BEST operational definition of aggression?",opts:["Client acts out","Client hits, kicks, or bites another person","Client gets upset","Client has issues"],a:1,ex:"Observable, measurable, unambiguous."},sc:{q:"BCBA asks you to collect data on 'appropriate play.' Before you begin:",opts:["Start immediately","Ask for an operational definition first","Use your judgment","Record anything positive"],a:1,ex:"Without a shared definition your data won't be reliable."},fl:{f:"What is an operational definition?",b:"Describes behavior in observable, measurable, unambiguous terms so all observers record the same events consistently."}},
    {code:"A.6",title:"Calculate & Summarize Data",lesson:"Raw data converted into rate, mean duration, percentage correct for meaningful interpretation.",why:"A count of 10 means little without context. Rate and percentage allow fair comparisons.",examples:["Rate = count ÷ time","Percentage = correct ÷ total × 100","Mean duration = total ÷ occurrences"],tip:"Always use same time unit when comparing rates across sessions.",mc:{q:"Client had 12 correct in 20-trial session. Percentage correct?",opts:["12%","60%","20%","80%"],a:1,ex:"12 ÷ 20 × 100 = 60%."},sc:{q:"Session A: 8 in 20 min. Session B: 10 in 40 min. Higher rate?",opts:["Session A — 0.4/min","Session B — 0.25/min","Equal","Cannot determine"],a:0,ex:"Rate A = 0.4/min, Rate B = 0.25/min."},fl:{f:"Why is rate preferred over raw frequency?",b:"Rate = count ÷ time. Accounts for different session lengths so comparisons are fair."}},
    {code:"A.7",title:"Identify Trends in Graphed Data",lesson:"Three trend directions: increasing (accelerating), decreasing (decelerating), and stable (flat).",why:"Trend analysis guides when to modify a program, celebrate mastery, or investigate changes.",examples:["Increasing on skill = learning occurring","Decreasing problem behavior = intervention working","Flat skill = may need modification"],tip:"Look at last 3–5 data points together. One bad point doesn't make a trend.",mc:{q:"Flat line across 7 sessions on a skill program most likely indicates:",opts:["Mastery","Program may need modification","Data error","Decreasing behavior"],a:1,ex:"Flat trend on acquisition signals the procedure isn't producing learning."},sc:{q:"Steady decrease over 4 weeks then a spike last session. You should:",opts:["Restart plan","Document and report to BCBA","Assume plan failed","Ignore it"],a:1,ex:"Document, report, let BCBA determine next steps."},fl:{f:"3 trend directions on a behavior graph?",b:"1. Increasing (accelerating)\n2. Decreasing (decelerating)\n3. Stable/Flat\n\nVariability assessed separately."}},
    {code:"A.8",title:"Risks of Unreliable Data",lesson:"Unreliable data and poor procedural fidelity undermine the entire clinical process.",why:"Clinical decisions, billing, and client safety depend on accurate data.",examples:["Filling in data from memory = unreliable","Skipping steps = poor fidelity","Both lead to wrong decisions"],tip:"If you made a mistake — tell your BCBA immediately.",mc:{q:"Poor procedural fidelity means:",opts:["Too much data","Not implementing procedure as designed","Too frequent data","High IOA"],a:1,ex:"Poor fidelity = steps missed, changed, or inconsistently applied."},sc:{q:"You realize you've been skipping an error correction step for two weeks. You should:",opts:["Continue","Fix quietly","Inform your BCBA immediately","Wait and watch"],a:2,ex:"BCBA needs to know to accurately interpret data."},fl:{f:"Why does procedural fidelity matter clinically?",b:"If not implemented as designed, we can't know whether outcomes are due to the intervention or the deviation — invalidating data and decisions."}},
  ]},
  {key:"B",label:"Behavior Assessment",color:C.terra,tasks:[
    {code:"B.1",title:"Conduct Preference Assessments",lesson:"Identify potential reinforcers using free operant, paired stimulus (PS), or MSWO assessment.",why:"Reinforcers must be empirically identified — what looks reinforcing may not function that way.",examples:["Free operant: observe natural approach","PS: present 2 items, record choice","MSWO: array, remove selected items"],tip:"Preferences change! Run a brief check before every session.",mc:{q:"In MSWO, after client selects an item you:",opts:["Return immediately","Remove from array","Replace with new","End assessment"],a:1,ex:"MSWO removes selected items — produces hierarchy as options reduce."},sc:{q:"Client is disinterested in today's items. Best action?",opts:["Continue","Quick free operant observation","Skip reinforcement","Ask parent"],a:1,ex:"Preferences change. Free operant scan identifies current motivation."},fl:{f:"3 main preference assessment types?",b:"1. Free Operant — natural approach behavior\n2. Paired Stimulus — 2 items, record selection\n3. MSWO — array, remove selected, hierarchy"}},
    {code:"B.2",title:"Participate in Skill Assessments",lesson:"RBTs assist BCBAs by running designated assessment probes exactly as instructed.",why:"Skill assessments inform program targets — build on strengths, teach what's missing.",examples:["ABLLS-R, VB-MAPP tools","RBT role: implement probes, record accurately"],tip:"Record exactly what you observe — not what you expect.",mc:{q:"During probe, client doesn't respond. You should:",opts:["Prompt","Record no response and move on","Skip","Give hint"],a:1,ex:"Probes must be conducted without prompting to obtain valid baseline."},sc:{q:"BCBA asks you to run VB-MAPP mand probes. Your role is to:",opts:["Design criteria","Implement exactly and record","Interpret results","Modify based on mood"],a:1,ex:"RBTs implement as directed — design and interpretation is BCBA's role."},fl:{f:"RBT's role in skill assessments?",b:"Implement probes as directed, record accurately, report results.\nNOT: design, set criteria, or interpret — that's the BCBA's role."}},
    {code:"B.3",title:"Participate in Functional Assessment",lesson:"RBTs collect ABC data and implement functional analysis components under BCBA supervision.",why:"Treatment only works when it targets the actual function of behavior.",examples:["ABC data: antecedent, behavior, consequence","Scatter plots","FA conditions: BCBA-designed, RBT implements"],tip:"Your accuracy in ABC data matters enormously — any missed ABCs can lead to incorrect function identification.",mc:{q:"Within RBT scope during functional assessment:",opts:["Designing FA conditions","Interpreting function","Collecting ABC data as directed","Writing BIP"],a:2,ex:"RBTs collect data and implement conditions as directed — not design or interpret."},sc:{q:"Your ABC data shows a clear pattern. You should:",opts:["Conclude function and tell family","Document pattern and share with BCBA","Change behavior plan","Ignore — not your job"],a:1,ex:"Document carefully and share observations — BCBA determines whether data supports a hypothesis."},fl:{f:"3 levels of functional assessment?",b:"1. Indirect — interviews, rating scales\n2. Descriptive — ABC, observation\n3. Experimental FA — controlled conditions (BCBA-designed)"}},
  ]},
  {key:"C",label:"Behavior Acquisition",color:C.sage,tasks:[
    {code:"C.1",title:"Positive & Negative Reinforcement",lesson:"Positive SR: add stimulus → increase. Negative SR: remove stimulus → increase. Both INCREASE behavior — defined by effect.",why:"Misidentifying reinforcement type leads to wrong treatment.",examples:["Positive: token after task → completion increases","Negative: demand removed after FCT → FCT increases"],tip:"Negative reinforcement = removal + increase. Both words required.",mc:{q:"Student completes work to be excused from remaining tasks. This is:",opts:["Positive reinforcement","Negative reinforcement","Automatic reinforcement","Punishment"],a:1,ex:"Work removal (aversive removed) → behavior increases = negative reinforcement."},sc:{q:"You give stickers but completion hasn't increased after 2 weeks. Stickers are:",opts:["A reinforcer","Not functioning as a reinforcer","A punisher","An MO"],a:1,ex:"Reinforcement defined by EFFECT. No increase = not a reinforcer."},fl:{f:"Positive vs. Negative Reinforcement",b:"Positive SR+: ADD → INCREASES\nNegative SR-: REMOVE → INCREASES\n\nBoth = REINFORCEMENT = INCREASES\n+/- = what happened to the environment"}},
    {code:"C.2",title:"Conditioned Reinforcers",lesson:"Conditioned reinforcers acquire value through pairing with other reinforcers — they are not naturally reinforcing.",why:"Allows reinforcement when primary reinforcers are impractical.",examples:["Praise paired with preferred item → praise gains value","Tokens paired with backup reinforcers"],tip:"Always pair a new conditioned reinforcer with existing reinforcers before relying on it.",mc:{q:"To establish a token as a conditioned reinforcer you must first:",opts:["Give freely","Pair with backup reinforcers consistently","Use as punisher","Give after 10 responses"],a:1,ex:"Pairing tokens with backup reinforcers conditions them to acquire reinforcing value."},sc:{q:"'Nice work' has no effect on a new client. To make it a reinforcer:",opts:["Say it louder","Stop using it","Pair 'nice work' immediately with a known reinforcer","Ask family"],a:2,ex:"Pairing praise with an existing reinforcer conditions praise to acquire reinforcing value."},fl:{f:"What is a conditioned reinforcer?",b:"Neutral stimulus that acquires reinforcing value through pairing with other reinforcers.\n\nEstablished by: consistent pairing with backup/primary reinforcers."}},
    {code:"C.3",title:"Discrete Trial Teaching (DTT)",lesson:"Structured teaching format: SD → Response → Consequence → ITI.",why:"Allows many learning trials per session with consistent antecedents and consequences.",examples:["SD: instruction → Response → SR+ → ITI","Error correction: prompt correct, transfer trial"],tip:"Keep your SD consistent — same words, same tone every time.",mc:{q:"In DTT, the inter-trial interval (ITI) is:",opts:["SD to response time","Time between end of one trial and start of next","SR delivery time","Total session time"],a:1,ex:"ITI is the brief pause between trials — a reset."},sc:{q:"Client says 'cat' to a dog picture. DTT error correction:",opts:["Reinforce the attempt","Ignore","Prompt 'dog,' reinforce, re-present dog SD","Mark incorrect and end"],a:2,ex:"Error correction: prompted correct response + reinforcement, then re-present original SD."},fl:{f:"4 components of a DTT trial?",b:"1. SD — instruction\n2. Response — client behavior\n3. Consequence — reinforcement or error correction\n4. ITI — pause before next trial"}},
    {code:"C.4",title:"Naturalistic Teaching (NET)",lesson:"Embeds instruction into natural routines, play, and activities — following the client's motivation.",why:"Skills learned in natural contexts generalize more easily.",examples:["Incidental teaching: follow client's lead","Mand training when client reaches for item"],tip:"NET requires constant vigilance — opportunities appear and disappear in seconds.",mc:{q:"Child reaches for preferred toy. Best NET response:",opts:["Run DTT session","Prompt verbal request before giving toy","End session","Preference assessment"],a:1,ex:"Child reaching = maximum motivation — prime mand training moment."},sc:{q:"Client spontaneously labels a picture: 'dog!' Your best response:",opts:["Redirect to table for DTT","Deliver enthusiastic SR+ and expand","Record and move silently","Prompt full sentence first"],a:1,ex:"Reinforce spontaneous tacting immediately in NET."},fl:{f:"What is incidental teaching?",b:"Arranging environment to create motivation, then following child's initiation to embed a teaching trial using natural reinforcers — child leads, therapist captures the moment."}},
    {code:"C.5",title:"Task Analysis & Chaining",lesson:"Task analysis breaks complex skills into sequential steps. Forward, backward, and total task chaining teach those steps in different orders.",why:"Multi-step skills are too complex to teach all at once.",examples:["Forward: teach step 1, prompt rest","Backward: teach LAST step first — client always finishes","Total task: prompt all steps, reinforce at end"],tip:"Follow your BCBA's chaining method exactly.",mc:{q:"In backward chaining, which step is taught independently first?",opts:["Step 1","Hardest step","Last step","Step client knows best"],a:2,ex:"Backward starts with last step — client always experiences task completion."},sc:{q:"You prompt steps 1–7 and reinforce when step 8 is independent. This is:",opts:["Forward chaining","Backward chaining","Total task","Shaping"],a:2,ex:"Prompting all and reinforcing at end = total task presentation."},fl:{f:"Forward vs. Backward vs. Total Task?",b:"Forward: teach step 1 forward, prompt remaining\nBackward: teach last step backward, prompt prior\nTotal task: prompt and reinforce ALL steps every trial"}},
    {code:"C.6",title:"Discrimination Training",lesson:"Teaches responding to SD and not S∆ through differential reinforcement.",why:"Foundation of language, safety, and academic skills.",examples:["SD signals reinforcement available","S∆ signals reinforcement NOT available"],tip:"Start with very different stimuli before introducing similar items.",mc:{q:"An S∆ signals:",opts:["Reinforcement available","Behavior should increase","Reinforcement NOT available","Punishment coming"],a:2,ex:"S∆ signals reinforcement is not available — the contrast to SD."},sc:{q:"Client says 'dog' to cat pictures too. This is:",opts:["Mastery","Overgeneralization — not discriminated","Prompt dependency","Extinction burst"],a:1,ex:"Responding 'dog' to cats = overgeneralization — discrimination training needed."},fl:{f:"SD vs. S∆?",b:"SD: signals reinforcement IS available for specific response\nS∆: signals reinforcement is NOT available\n\nDiscrimination: reinforce SD-responding, extinguish S∆-responding"}},
    {code:"C.7",title:"Prompting & Fading",lesson:"Prompts are supplemental cues. Fading reduces prompts systematically so natural SDs control behavior independently.",why:"The goal is always independence — the natural SD, not our prompt, should control behavior.",examples:["Types: physical, model, verbal, gestural, positional","LTM: minimal first","MTL: maximum first, fade systematically","Errorless: prompt before any error"],tip:"Plan fading BEFORE teaching begins — prompt dependency happens when fading is neglected.",mc:{q:"Errorless teaching involves:",opts:["Never correcting errors","Prompting BEFORE client can make error","Fading as fast as possible","Using LTM hierarchy"],a:1,ex:"Errorless delivers prompts proactively — before errors occur."},sc:{q:"Client only responds when you point at the answer. To increase independence:",opts:["Stop pointing immediately","Begin systematic prompt fading per BCBA's hierarchy","Add verbal prompt","Reinforce pointing more"],a:1,ex:"Systematic fading gradually removes prompt while maintaining correct responding."},fl:{f:"What is prompt dependency and how is it prevented?",b:"Prompt dependency: client only responds when prompted — can't respond to natural SD.\n\nPrevented by: planning fading BEFORE teaching begins and following it consistently."}},
    {code:"C.8",title:"Generalization Procedures",lesson:"Skills must generalize across people, places, and materials. Must be programmed deliberately.",why:"A skill that only works at the therapy table is a fragile skill.",examples:["Probe across multiple therapists","Train in varied settings","Use varied materials"],tip:"Program for generalization from day one — build variation in from the beginning.",mc:{q:"Child can request with BCBA but not with parent. This is failure of:",opts:["Acquisition","Stimulus generalization across people","Maintenance","Shaping"],a:1,ex:"Skill hasn't generalized to new person — stimulus generalization failure."},sc:{q:"BCBA asks you to probe skill at client's home next week. Purpose:",opts:["IOA data","Assess generalization across settings","Re-teach the skill","Assess maintenance"],a:1,ex:"Probing in new setting tests whether skill generalized beyond training context."},fl:{f:"3 types of generalization with examples?",b:"1. Across people — performs with parent, not just BCBA\n2. Across settings — performs at home, not just clinic\n3. Response generalization — variations of trained response increase"}},
    {code:"C.9",title:"Maintenance vs. Acquisition",lesson:"Acquisition builds new skills. Maintenance keeps mastered skills occurring over time.",why:"Skills lost without maintenance programming waste clinical investment.",examples:["Acquisition: CRF, high prompts, structured trials","Maintenance: VR schedule, reduced prompts, naturalistic"],tip:"Follow your BCBA's mastery criteria for when to shift from acquisition to maintenance.",mc:{q:"Best schedule for maintaining a mastered skill:",opts:["CRF","VR","FR1","No reinforcement"],a:1,ex:"VR produces extinction-resistant, consistent responding — ideal for maintenance."},sc:{q:"Client mastered color ID 2 months ago and it's no longer being run. How to incorporate?",opts:["Never run again","Remove from all programs","Embed into naturalistic activities and periodic probes","Re-teach from baseline"],a:2,ex:"Mastered skills need ongoing maintenance — naturalistic embedding and periodic probes ensure retention."},fl:{f:"Acquisition vs. Maintenance — key differences?",b:"Acquisition: building NEW skill\n→ CRF, more prompting, structured\n\nMaintenance: keeping MASTERED skill\n→ Intermittent SR, fewer prompts, naturalistic"}},
    {code:"C.10",title:"Shaping",lesson:"Reinforces successive approximations toward a target behavior — used when client can't yet perform the target.",why:"Some behaviors must be built from scratch.",examples:["Teaching vocalization → word approximation → word","Reinforce 1s eye contact → 2s → 3s"],tip:"Move too fast → failure. Move too slow → stagnation.",mc:{q:"Teaching 'ball' — client says 'bah.' You should reinforce:",opts:["'Ball' only","'Bah' — closest approximation","Any vocalization","Silence"],a:1,ex:"Start where the client is. 'Bah' is current best approximation."},sc:{q:"After 'bah' is reliable, to continue shaping toward 'ball':",opts:["Keep reinforcing 'bah'","Stop all reinforcement","Raise criterion — only reinforce closer approximations","Switch targets"],a:2,ex:"Raise the criterion: stop reinforcing previous level, only reinforce closer approximations."},fl:{f:"What are successive approximations?",b:"A series of responses each progressively closer to the target. Each approximation reinforced only until a closer one is established — gradually sculpting toward the final goal."}},
    {code:"C.11",title:"Token Economies",lesson:"Use conditioned reinforcers (tokens) exchanged for backup reinforcers — allowing delayed, flexible reinforcement.",why:"Tokens bridge the gap between behavior and reward.",examples:["Stars → exchange for preferred activity","Token board: 5 spaces → full board = break"],tip:"Token economies only work if tokens have been conditioned — pair with backup reinforcers first.",mc:{q:"What makes tokens effective reinforcers?",opts:["Size and color","Given freely","Paired with backup reinforcers","Resemble money"],a:2,ex:"Tokens are conditioned reinforcers — value from pairing. Without pairing, no function."},sc:{q:"Client earned 4/5 tokens. Coworker removes 2 as punishment. This is:",opts:["Appropriate response cost","Ethical violation — earned tokens should not be removed","Fine if BCBA approved","Good teaching"],a:1,ex:"Removing already-earned tokens is unethical."},fl:{f:"What is token thinning?",b:"Gradually increasing responses required per token over time — shifting toward naturally occurring schedules and reducing token system dependence."}},
  ]},
  {key:"D",label:"Behavior Reduction",color:C.terra,tasks:[
    {code:"D.1",title:"Functions of Behavior",lesson:"All behavior serves a function — SEAT: Sensory/Automatic, Escape/Avoidance, Attention, Tangibles.",why:"Function-based treatment is dramatically more effective than topography-based approaches.",examples:["Attention: screams → parent comes","Escape: flips desk → removed from task","Tangible: grabs toy → gets toy","Automatic: rocks → vestibular stimulation"],tip:"Look at what CONSISTENTLY follows behavior across multiple ABCs.",mc:{q:"Student destroys materials every time worksheets appear, then is removed from activity. Function is:",opts:["Attention","Tangibles","Automatic","Escape/avoidance"],a:3,ex:"Destruction followed by removal from work = escape function."},sc:{q:"Client bangs head during quiet independent play, no one nearby. This may be:",opts:["Attention-maintained","Escape-maintained","Automatic/sensory reinforcement","Tangibles"],a:2,ex:"Occurring without social consequences = automatic/sensory reinforcement."},fl:{f:"4 functions of behavior (SEAT)?",b:"S — Sensory/Automatic\nE — Escape/Avoidance\nA — Attention\nT — Tangibles"}},
    {code:"D.2",title:"Antecedent Interventions",lesson:"Modify conditions BEFORE behavior occurs — the most proactive and least restrictive approach.",why:"Preventing behavior is always preferable to reacting to it.",examples:["NCR: reinforcer on time schedule regardless of behavior","High-p sequences: easy requests before hard ones","Demand fading","Visual schedules"],tip:"NCR for attention: deliver attention every X minutes regardless of behavior — removes the contingency.",mc:{q:"NCR reduces behavior by:",opts:["Punishing behavior","Reinforcing alternatives","Delivering reinforcer on time schedule — removing contingency","Increasing extinction"],a:2,ex:"NCR abolishes EO — reinforcer is freely available so behavior is no longer necessary."},sc:{q:"Before a demand you ask 3 easy questions client always answers. This is:",opts:["Backward chain","Errorless","High-probability request sequence","DRO"],a:2,ex:"High-p sequences build behavioral momentum before low-p demands."},fl:{f:"What is NCR and what function does it target best?",b:"NCR = Non-Contingent Reinforcement. Deliver on fixed-time schedule regardless of behavior.\n\nMost effective for: attention-maintained and tangible-maintained — makes behavior unnecessary."}},
    {code:"D.3",title:"Differential Reinforcement",lesson:"Reinforces desired behaviors while placing others on extinction. DRO, DRA, DRI, FCT each target differently.",why:"DR reduces problem behavior while reinforcing better alternatives — ethical and effective.",examples:["DRO: reinforce ABSENCE for X interval","DRA: reinforce functionally equivalent alternative","DRI: reinforce INCOMPATIBLE behavior","FCT: communication response replaces behavior"],tip:"FCT is DRA where the alternative is a communication response.",mc:{q:"You teach child to tap shoulder to request peer attention instead of hitting. This is:",opts:["DRO","DRL","DRI","FCT (form of DRA)"],a:3,ex:"FCT replaces behavior with communication response serving same function."},sc:{q:"You reinforce every 3 minutes when hitting has NOT occurred. This is:",opts:["DRA","DRI","DRO","FCT"],a:2,ex:"DRO = reinforcement when target behavior hasn't occurred during interval."},fl:{f:"DRA vs DRI vs DRO?",b:"DRA: reinforce ALTERNATIVE (same function, appropriate form)\nDRI: reinforce INCOMPATIBLE (can't occur with problem behavior)\nDRO: reinforce ABSENCE during interval\nFCT: type of DRA — alternative is communication response"}},
    {code:"D.4",title:"Extinction",lesson:"Withhold the reinforcer maintaining a behavior. Expect an extinction burst. Only implement under BCBA-approved behavior plan.",why:"Extinction is powerful but requires correct function identification and consistent implementation.",examples:["Attention extinction: withhold social attention","Escape extinction: continue task despite behavior","Expect burst: temporary increase"],tip:"Critical prerequisite: correctly identify the FUNCTION first.",mc:{q:"Extinction works by:",opts:["Punishing behavior","Withholding the reinforcer maintaining behavior","Reinforcing alternative","Changing antecedent"],a:1,ex:"Extinction = no longer delivering the consequence that was reinforcing behavior."},sc:{q:"You begin ignoring attention-maintained whining. Day 2 it gets much louder. This is:",opts:["Treatment failure","Spontaneous recovery","Extinction burst — expected","New behavior problem"],a:2,ex:"Extinction bursts are expected — behavior temporarily intensifies. Maintain the procedure."},fl:{f:"4 secondary effects of extinction?",b:"1. Extinction burst — temporary INCREASE\n2. Response variation — new forms emerge\n3. Resurgence — previously extinguished behaviors return\n4. Emotional responding — frustration, aggression"}},
    {code:"D.5",title:"Punishment Procedures",lesson:"Positive punishment: add aversive → decrease. Negative punishment: remove desired → decrease. Both require BCBA authorization.",why:"Punishment used only when reinforcement-based strategies are insufficient.",examples:["Positive: reprimand → behavior decreases","Negative: time-out → behavior decreases","NEVER improvise punishment"],tip:"Time-out only works if time-in is reinforcing.",mc:{q:"Time-out is an example of:",opts:["Positive punishment","Negative punishment","Extinction","Negative reinforcement"],a:1,ex:"Time-out removes access to positive reinforcement = negative punishment."},sc:{q:"You think a reprimand might help. You should:",opts:["Try it — reprimands are mild","Consult BCBA before any punishment","Implement then document","Only use when severe"],a:1,ex:"ANY punishment requires BCBA authorization — never implement without supervision."},fl:{f:"Positive vs. Negative Punishment?",b:"Positive punishment: ADD aversive → DECREASES\nNegative punishment: REMOVE desired → DECREASES\n\nBoth require BCBA authorization and informed consent."}},
    {code:"D.6",title:"Secondary Effects of Extinction & Punishment",lesson:"Both extinction and punishment can produce side effects that must be anticipated, monitored, and reported.",why:"Understanding side effects helps RBTs anticipate and respond appropriately.",examples:["Extinction: burst, variation, resurgence, emotional responding","Punishment: fear of therapist, avoidance","Document and report all side effects"],tip:"Always document side effects and report to BCBA — or immediately if safety is a concern.",mc:{q:"Previously extinguished behavior reappears weeks later without reinforcement. This is:",opts:["Extinction burst","Response variation","Spontaneous recovery","Resurgence"],a:2,ex:"Spontaneous recovery: temporary reappearance after rest period — continue extinction."},sc:{q:"Client becomes avoidant of you after punishment is implemented. This is:",opts:["Unrelated","Expected side effect — document and report","Sign to increase punishment","Normal — improves with time"],a:1,ex:"Avoidance of therapist is a known side effect. Document, report, BCBA determines modifications."},fl:{f:"Secondary effects of extinction?",b:"1. Extinction burst — temporary increase\n2. Response variation — new forms emerge\n3. Resurgence — return of previously extinguished behavior\n4. Emotional responding\n5. Spontaneous recovery — reappearance after pause"}},
    {code:"D.7",title:"Crisis & Emergency Procedures",lesson:"When a client poses imminent risk, crisis procedures ensure safety. Follow exactly as trained — never improvise.",why:"Safety is always first. Deviating from authorized procedures creates legal and ethical risks.",examples:["Know your protocol BEFORE you need it","Space management and de-escalation always first","Physical intervention ONLY if trained, authorized, necessary"],tip:"If not trained in a specific procedure — do not use it. Call for backup.",mc:{q:"After a crisis event, your FIRST clinical responsibility is:",opts:["Complete incident report","Ensure everyone is safe then contact supervisor","Continue session","Call family independently"],a:1,ex:"Physical safety first. Then contact supervisor — they guide documentation and required reporting."},sc:{q:"Client escalates and you don't know the approved crisis procedure. You should:",opts:["Use any restraint you know","Do nothing","Maintain safe distance, call for support, follow only training","Try what worked with another client"],a:2,ex:"Never improvise. Maintain distance, protect everyone, call trained support."},fl:{f:"Why must crisis procedures be followed exactly?",b:"Built on safety research, client-specific risk factors, and legal requirements. Deviation — even with good intentions — can cause injury, liability, and ethics violations.\n\nKnow your plan BEFORE you need it."}},
  ]},
  {key:"E",label:"Documentation & Reporting",color:C.copper,tasks:[
    {code:"E.1",title:"Communicate Concerns to Supervisor",lesson:"RBTs must communicate concerns and observations to their supervisor in a timely manner.",why:"RBTs are the eyes and ears of the clinical team. Information that doesn't reach the BCBA cannot be acted on.",examples:["Parent reports medication change — report to BCBA same day","New behavior observed — document and report"],tip:"When in doubt, report it. There is no such thing as over-communicating with your supervisor about client welfare.",mc:{q:"Client's parent tells you a new medication was started yesterday. You should:",opts:["Note and monitor","Report to BCBA immediately","Adjust programs","Ask family to contact BCBA"],a:1,ex:"Medication changes are clinically significant and must be communicated promptly."},sc:{q:"Caregiver mentions client didn't sleep last night. Your BCBA should know because:",opts:["Sleep issues are emergencies","Background only","Sleep disruption can affect behavior — document as variable","BCBA decides schedule"],a:2,ex:"Variables affecting client progress must be documented and reported."},fl:{f:"What must always be communicated to supervisor?",b:"• New or unexpected behaviors\n• Changes in existing behavior patterns\n• Medical changes (illness, medication)\n• Schedule or environment changes\n• Anything outside the current behavior plan\n• Safety concerns — immediately"}},
    {code:"E.2",title:"Seek Clinical Direction Timely",lesson:"RBTs must seek clinical direction from supervisors when facing situations outside their competence.",why:"Improvising clinical decisions can harm clients and violates professional standards.",examples:["Training need: don't know how → ask BCBA first","Data irregularity: doesn't match observation → report"],tip:"No clinical situation is ever better solved by guessing. When in doubt — stop and call.",mc:{q:"New behavior not in the behavior plan. You should:",opts:["Handle with judgment","Ignore until next supervision","Document and seek direction from BCBA promptly","Ask family"],a:2,ex:"New behaviors require clinical assessment. Document and report promptly."},sc:{q:"Your data looks inconsistent with what you observed. Before next session:",opts:["Submit as collected","Report irregularity to BCBA","Correct data to match memory","Assume bad session"],a:1,ex:"Data irregularities must be reported — never alter data."},fl:{f:"What is chain of command in ABA?",b:"RBT → BCBA → Clinical Director → Management\n\nFollowing chain of command ensures clinical decisions are made by qualified people and protects both client and RBT."}},
    {code:"E.3",title:"Document Variables Affecting Progress",lesson:"Document and report variables that might affect client behavior — illness, medication, schedule disruptions.",why:"Behavior doesn't occur in a vacuum. BCBAs need context to make accurate clinical decisions.",examples:["Client has a cold → behavior may be more irritable","School break → routine changed","New sibling → schedule disrupted"],tip:"Document in session notes and report verbally at next supervision — or immediately if significant.",mc:{q:"Which most warrants documentation as a variable affecting progress?",opts:["You were 3 minutes late","Parent started new job affecting morning routine","Ran out of one preferred item","Same room as usual"],a:1,ex:"Change in parent's routine affects client's schedule and reinforcer access — clinically significant."},sc:{q:"Client's behavior is significantly better than usual today. You should:",opts:["Note 'good session'","Document improvement and any related variables","Increase all criteria","Not document — it was good"],a:1,ex:"Both improvements AND declines should be documented with context."},fl:{f:"5 types of variables to always document?",b:"1. Illness or medical changes\n2. Medication changes\n3. Schedule changes\n4. Sleep disruption\n5. Environmental changes\n\nAlso: significant emotional events, dietary changes"}},
    {code:"E.4",title:"Communicate Objectively in Sessions",lesson:"Session communication must be objective — observable, measurable terms — in accordance with legal and workplace requirements.",why:"Session notes are legal and billing documents. Subjective language creates liability.",examples:["Objective: 'Client emitted 4 instances of head-hitting during transitions'","Avoid: 'Client was frustrated and acted out'"],tip:"Write session notes as if a judge might read them. Specific, factual, complete.",mc:{q:"Which session note is written correctly?",opts:["Client was difficult","Client seemed sad","Client emitted 3 instances of elopement during demand; each lasted 15–30 seconds","Session was hard but we got through it"],a:2,ex:"Specific (count, duration), behavioral (observable), objective (no interpretation)."},sc:{q:"A crisis occurred in session. Your session note should:",opts:["Briefly mention 'there was an incident'","Document skill data only","Include objective description, procedures implemented, outcomes, follow-up","Wait to document after BCBA"],a:2,ex:"Crisis events require complete, objective documentation."},fl:{f:"3 standards session notes must meet?",b:"1. Objective — observable, measurable (no interpretation)\n2. Accurate — reflects what actually happened\n3. Compliant — follows HIPAA, regulatory, and organizational requirements"}},
  ]},
  {key:"F",label:"Ethics",color:C.umber,tasks:[
    {code:"F.1",title:"BACB Ethics Code Core Principles",lesson:"Core principles: benefit others; treat others with compassion, dignity, and respect; behave with integrity.",why:"Core principles guide decisions not explicitly covered by specific code requirements.",examples:["Benefit others: prioritize client welfare","Dignity: no demeaning language","Integrity: honest documentation"],tip:"When ethically gray — that feeling is your signal to consult a supervisor immediately.",mc:{q:"Primary ethical obligation of an RBT is to:",opts:["Employer","Supervising BCBA","Client welfare","Following all instructions"],a:2,ex:"Client welfare is the foundation. All other obligations exist in service of protecting the client."},sc:{q:"Employer asks you to document activities that didn't occur for billing. You should:",opts:["Do it — employer knows billing","Comply once then flag","Refuse — this is fraud","Ask a colleague"],a:2,ex:"Falsifying documentation is fraud and an ethics violation regardless of employer instruction."},fl:{f:"3 core principles of BACB RBT Ethics Code?",b:"1. Benefit others — prioritize client welfare\n2. Treat others with compassion, dignity, and respect\n3. Behave with integrity"}},
    {code:"F.2",title:"Demonstrate Competence",lesson:"RBTs must demonstrate competence through training, practice, feedback, and assessment before providing services independently.",why:"Clients deserve competent services. Providing services beyond your competence harms clients.",examples:["Complete 40-hour initial training","Pass RBT Competency Assessment","Seek training before implementing unfamiliar procedures"],tip:"Competence is ongoing — new client needs, new procedures all require new demonstration.",mc:{q:"RBT is asked to implement a new intervention they've never been trained on. They should:",opts:["Implement — trained professional","Ask colleague quickly","Inform BCBA and request training before implementing","Watch YouTube and try"],a:2,ex:"Providing services beyond demonstrated competence is an ethics violation."},sc:{q:"Client transfers with complex medical needs you've never encountered. You should:",opts:["Handle like other clients","Inform BCBA and request specialized training","Research independently","Refer without BCBA"],a:1,ex:"New competency needs must be communicated to the supervising BCBA."},fl:{f:"How is RBT competence established?",b:"1. Complete 40-hour training\n2. Pass RBT Competency Assessment\n3. Pass RBT certification exam\n4. Maintain through ongoing supervision and development"}},
    {code:"F.3",title:"Services Under Qualified Supervision",lesson:"RBTs must provide services only under ongoing supervision of a BCBA or BCaBA who meets BACB requirements.",why:"Supervision protects clients and RBTs — clinical decisions must be made by qualified practitioners.",examples:["Minimum 5% of monthly hours supervised","At least one individual supervision contact per period","Supervisor must be BCBA or BCaBA in good standing"],tip:"Track your own supervision hours. Don't rely solely on your organization.",mc:{q:"BACB minimum required supervision for RBTs:",opts:["2% monthly","5% monthly","10% monthly","No minimum"],a:1,ex:"BACB requires at least 5% of monthly service hours in supervision."},sc:{q:"Your supervising BCBA leaves and no replacement is assigned. You should:",opts:["Continue — you are trained","Inform employer you cannot provide unsupervised services","Provide services for established clients only","Self-supervise"],a:1,ex:"Without a qualified supervisor, RBTs cannot provide services. Notify employer."},fl:{f:"What happens if an RBT's supervisor leaves?",b:"Without a BCBA or BCaBA supervisor, an RBT CANNOT provide services. Services must pause until a qualified supervisor is established.\n\nProtects clients and RBT's certification."}},
    {code:"F.4",title:"Effective Supervision Practices",lesson:"Effective supervision includes: instructions, modeling, rehearsal, and performance feedback — plus direct observation.",why:"Supervision quality directly affects client outcomes.",examples:["BCBA models new procedure","RBT rehearses while BCBA observes","BCBA delivers specific behavioral feedback"],tip:"Come to supervision with questions. Growth happens when RBTs are active participants.",mc:{q:"A component of effective supervision (F.4):",opts:["Weekly emails only","Graph review without observation","Instructions, modeling, rehearsal, and performance feedback","Observation only — no feedback"],a:2,ex:"F.4 specifically identifies instructions, modeling, rehearsal, and feedback — plus direct observation."},sc:{q:"BCBA observes a session and gives corrective feedback. Best professional response:",opts:["Feel embarrassed and apologize","Thank them, ask clarifying questions, implement feedback","Explain why you did it your way","Wait to see if they bring it up again"],a:1,ex:"Professional: acknowledge, clarify, implement. Feedback is clinical investment in you and your clients."},fl:{f:"4 components of effective supervision (F.4)?",b:"1. Instructions — clear explanation\n2. Modeling — supervisor demonstrates\n3. Rehearsal — RBT practices\n4. Feedback — specific, behavioral, from direct observation"}},
    {code:"F.5",title:"Confidentiality Requirements",lesson:"RBTs must protect client information under HIPAA and organizational policies.",why:"Client privacy is a legal and ethical right. Violations can end careers and harm families.",examples:["Never discuss clients by name in public","No client info on social media — ever","Secure devices with session data"],tip:"When in doubt about sharing — don't share until confirmed with supervisor.",mc:{q:"Which is a HIPAA violation?",opts:["Discussing data with their BCBA","Texting a friend about client using first name","Documenting in approved system","Reviewing files before session"],a:1,ex:"Sharing any identifying client information with unauthorized individuals = HIPAA violation."},sc:{q:"Parent asks you to email session data to a new provider. You should:",opts:["Send — parent authorized","Get direction from BCBA before sharing records","Refuse entirely","Send via personal email"],a:1,ex:"Even with parent authorization, proper channels must be followed."},fl:{f:"What is PHI?",b:"Protected Health Information — anything identifying a client:\n• Name, DOB, address\n• Diagnosis, medical history\n• Session notes, data sheets\n• Photos, videos\n\nAll protected under HIPAA."}},
    {code:"F.6",title:"Public Statements & Social Media",lesson:"RBTs must accurately represent credentials and must not post about clients — even without names.",why:"Misrepresentation harms clients and families who make decisions based on false information.",examples:["Never claim credentials you don't hold","Don't post about clients — even without names","Personal social media is still professional"],tip:"If you wouldn't want your Clinical Director to read it — don't post it.",mc:{q:"RBT posts: 'Tough session with my little guy today.' This is:",opts:["Fine — no name used","Potentially an ethics and HIPAA violation even without a name","Appropriate","Standard social media"],a:1,ex:"Even without a name, session posts can potentially identify a client."},sc:{q:"Friend who is also RBT asks you to review their client data for a difficult case. You should:",opts:["Help — both trained","Share general knowledge without reviewing actual data","Review — it benefits client","Refuse entirely"],a:1,ex:"Sharing actual client PHI with unauthorized person violates confidentiality."},fl:{f:"What is misrepresentation of credentials?",b:"Claiming credentials you don't have (calling yourself BCBA when you're RBT).\n\nProhibited because: families make decisions based on credentials. Misrepresentation is fraud."}},
    {code:"F.7",title:"Multiple Relationships",lesson:"Multiple relationships occur when an RBT has more than one type of relationship with a client or family.",why:"Multiple relationships compromise objectivity and can harm clients even when well-intentioned.",examples:["Social media friendships with client families","Becoming personal friends with client's parent"],tip:"When a potential multiple relationship arises — consult your BCBA before any decisions.",mc:{q:"Client's parent invites you to family party. Most appropriate first response:",opts:["Accept — builds rapport","Decline immediately","Consult BCBA before any decision","Accept but keep professional topics only"],a:2,ex:"Social contact with client families = potential multiple relationship. Always consult BCBA."},sc:{q:"New client's parent is your close neighbor and friend. You should:",opts:["Provide services normally","Immediately disclose to BCBA","Refuse case without telling anyone","Ask family to keep it private"],a:1,ex:"Pre-existing personal relationships are potential multiple relationships — disclose immediately."},fl:{f:"What is a multiple relationship and why is it a concern?",b:"Exists when RBT has more than one type of relationship with client/family.\n\nConcern: compromises objectivity, creates conflicts of interest, can harm the therapeutic relationship."}},
    {code:"F.8",title:"Gift Giving & Receiving",lesson:"Follow organizational guidelines and err on the side of declining gifts from clients and families.",why:"Gifts can create dual relationships, obligations, and the appearance of preferential treatment.",examples:["Holiday gift basket — consult BCBA","Child's drawing — typically acceptable","Offer to pay privately for extra sessions — decline and consult BCBA"],tip:"When family offers any gift: 'That's so kind — let me check with my supervisor first.'",mc:{q:"Client's family offers $50 gift card as thanks. You should:",opts:["Accept — you earned it","Accept only if great progress","Decline and consult BCBA","Ask for cash instead"],a:2,ex:"Significant value creates dual relationship risk. Consult BCBA."},sc:{q:"6-year-old client hands you a drawing they made for you. You should:",opts:["Decline — all gifts must be refused","Accept only with BCBA approval first","Accept warmly — child's drawing is a nominal gesture","Document as ethics concern"],a:2,ex:"A child's drawing is a nominal, sincere gesture — not a dual relationship risk."},fl:{f:"What is nominal value in the ethics code context?",b:"Small, token gifts with minimal monetary worth and no dual relationship risk — such as a child's artwork.\n\nGifts of significant monetary value should be declined and reported to supervisor."}},
    {code:"F.9",title:"Interpersonal & Professional Skills",lesson:"RBTs must demonstrate: accepting feedback, active listening, seeking input, and collaborating in all professional relationships.",why:"Professional effectiveness depends on relationship quality with clients, families, and colleagues.",examples:["Accepting feedback: remain open, implement changes","Active listening: clarifying questions","Seeking input: consult when uncertain"],tip:"Your BCBA is your clinical partner. Bring your observations, questions, and genuine engagement.",mc:{q:"BCBA tells you your trial presentation is too fast. Best professional response:",opts:["Explain why you pace quickly","Thank them and ask for demonstration","Continue current pace","Accept verbally but don't change"],a:1,ex:"Professional: thank, understand, implement. Asking for demonstration shows genuine engagement."},sc:{q:"During team meeting you disagree with a proposed change. How to respond?",opts:["Stay quiet","Disagree loudly","Respectfully share observation and ask questions, then implement team decision","Vent to colleague after"],a:2,ex:"Professional collaboration: share observations with rationale, then implement team decisions."},fl:{f:"4 interpersonal skills F.9 requires?",b:"1. Accepting feedback — openly, implementing changes\n2. Listening actively — full engagement, clarifying\n3. Seeking input — proactively asking when uncertain\n4. Collaborating — contributing while respecting roles"}},
    {code:"F.10",title:"Cultural Humility & Responsiveness",lesson:"RBTs must engage in ongoing cultural humility — identifying personal biases and adapting services to be culturally responsive.",why:"Cultural factors affect behavior, reinforcement, family priorities, and treatment acceptability.",examples:["Examine cultural assumptions before decisions","Ask families about their values","Adapt reinforcers to be culturally meaningful"],tip:"Cultural humility is continuous — recognizing what you don't know and staying genuinely curious.",mc:{q:"Cultural humility most importantly involves:",opts:["Learning one culture thoroughly","Treating all clients identically","Ongoing self-reflection about biases and responsiveness to each client's cultural context","Using only English for consistency"],a:2,ex:"Cultural humility is ongoing and individualized — continuous self-reflection, not claimed expertise."},sc:{q:"Family uses different discipline practices than the behavior plan. Your first step:",opts:["Inform them ABA standards take precedence","Report as non-compliant","Discuss with BCBA to understand family values","Document as non-compliance"],a:2,ex:"Bring observation to BCBA so team can honor family values within effective clinical framework."},fl:{f:"Cultural humility vs. cultural competence?",b:"Cultural competence: claims mastery\n\nCultural humility:\n• Ongoing self-reflection\n• Recognizing limits\n• Centering client/family as expert on own culture\n• Continuous learning\n\nNo finish line — always more to learn"}},
  ]},
];

// ── RBT Study Module Component ────────────────────────────────────
function RBTStudyModule({onBack,done,markDone,addPoints}){
  const [domain,setDomain]=useState(null);
  const [taskIdx,setTaskIdx]=useState(0);
  const [tab,setTab]=useState("learn");
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [flipped,setFlipped]=useState(false);

  const total=RBT_DOMAINS.reduce((s,d)=>s+d.tasks.length,0);
  const doneCount=Object.keys(done).length;
  const dom=domain?RBT_DOMAINS.find(d=>d.key===domain):null;
  const tasks=dom?.tasks||[];
  const task=tasks[taskIdx]||null;

  const switchTab=(t)=>{setTab(t);setSel(null);setAnswered(false);setFlipped(false);};
  const switchTask=(i)=>{setTaskIdx(i);switchTab("learn");};

  const handleAnswer=(qdata,i)=>{
    if(answered)return;
    setSel(i);setAnswered(true);
    if(i===qdata.a&&!done[task.code])markDone(task.code);
  };

  const renderQ=(qdata,type)=>(
    <div>
      <div style={{background:`${dom.color}12`,borderRadius:12,padding:12,marginBottom:12,borderLeft:`3px solid ${dom.color}`}}>
        {type==="sc"&&<div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3})}>Scenario</div>}
        <p style={ss("13px",C.bark,600,{margin:0,lineHeight:1.6})}>{qdata.q}</p>
      </div>
      {qdata.opts.map((o,i)=>{
        let bg=C.linen,bc=C.sand,tc=C.umber;
        if(answered){if(i===qdata.a){bg="#e8f0e8";bc=C.sage;tc="#2a5c2a";}else if(i===sel){bg="#f5e8e8";bc=C.terra;tc=C.terra;}}
        else if(i===sel){bg=`${dom.color}15`;bc=dom.color;}
        return <button key={i} onClick={()=>handleAnswer(qdata,i)} style={{width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${bc}`,background:bg,color:tc,marginBottom:7,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"12px",fontWeight:500,transition:"all 0.2s"}}>{String.fromCharCode(65+i)}. {o}</button>;
      })}
      {answered&&<div style={{background:"#e8f0e8",borderRadius:12,padding:12,marginTop:6,fontSize:"12px",color:"#2a5c2a",lineHeight:1.6}}>{qdata.ex}</div>}
    </div>
  );

  // Domain list
  if(!domain) return (
    <div style={{padding:"18px 16px 100px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:12,padding:0}}>← Back</button>
      <div style={ser("18px",C.bark,700,{marginBottom:2})}>RBT Study Module</div>
      <div style={ss("11px",C.dusk,400,{marginBottom:10})}>3rd Edition · 43 tasks · Effective 2026</div>
      <div style={{marginBottom:14}}>
        <div style={ss("10px",C.dusk,600,{marginBottom:4})}>{doneCount} of {total} tasks completed</div>
        <PBar value={total?doneCount/total*100:0} color={C.terra} h={5}/>
      </div>
      {RBT_DOMAINS.map(d=>{
        const dc=d.tasks.filter(t=>done[t.code]).length;
        const pct=Math.round(dc/d.tasks.length*100);
        return (
          <div key={d.key} onClick={()=>{setDomain(d.key);setTaskIdx(0);switchTab("learn");}} style={{background:C.white,borderRadius:16,padding:"14px 16px",marginBottom:10,boxShadow:`0 1px 6px ${C.sand}`,borderLeft:`4px solid ${d.color}`,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 14px ${C.sand}`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 1px 6px ${C.sand}`}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <div style={ss("9px",d.color,700,{textTransform:"uppercase",letterSpacing:"0.07em"})}>Section {d.key}</div>
                <div style={ser("14px",C.bark,700,{marginTop:1})}>{d.label}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={ss("15px",d.color,700)}>{pct}%</div>
                <div style={ss("9px",C.stone,400)}>{dc}/{d.tasks.length}</div>
              </div>
            </div>
            <PBar value={pct} color={d.color} h={3}/>
            <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
              {d.tasks.map(t=><span key={t.code} style={{fontSize:"9px",fontWeight:600,padding:"2px 7px",borderRadius:6,background:done[t.code]?`${d.color}22`:C.linen,color:done[t.code]?d.color:C.stone,border:`1px solid ${done[t.code]?d.color+"44":C.sand}`}}>{done[t.code]?"✓ ":""}{t.code}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Task view
  return (
    <div style={{padding:"0 0 100px"}}>
      <div style={{background:`${dom.color}12`,padding:"18px 18px 0",borderBottom:`1px solid ${C.sand}`}}>
        <button onClick={()=>setDomain(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:8,padding:0}}>← All Sections</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.07em"})}>Section {domain} · {dom.label}</div>
            <div style={ser("15px",C.bark,700,{marginTop:2})}>{task?.code}: {task?.title}</div>
          </div>
          <div style={ss("11px",C.dusk,400)}>{taskIdx+1}/{tasks.length}</div>
        </div>
        <div style={{display:"flex",gap:5,marginTop:10,overflowX:"auto",scrollbarWidth:"none",paddingBottom:12}}>
          {tasks.map((t,i)=><button key={t.code} onClick={()=>switchTask(i)} style={{flexShrink:0,padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"9px",background:i===taskIdx?dom.color:done[t.code]?`${dom.color}22`:C.linen,color:i===taskIdx?C.white:done[t.code]?dom.color:C.stone,transition:"all 0.2s"}}>
            {done[t.code]?"✓ ":""}{t.code}
          </button>)}
        </div>
      </div>

      <div style={{padding:"14px 16px"}}>
        {/* Tab bar */}
        <div style={{display:"flex",gap:4,marginBottom:14}}>
          {[["learn","Learn"],["mc","Multiple Choice"],["sc","Scenario"],["fl","Flashcard"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>switchTab(id)} style={{flex:1,padding:"7px 0",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"10px",background:tab===id?dom.color:C.linen,color:tab===id?C.white:C.dusk,transition:"all 0.2s"}}>{lbl}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{background:C.white,borderRadius:18,padding:18,boxShadow:`0 1px 8px ${C.sand}`,border:`1px solid ${dom.color}22`}}>
          {tab==="learn"&&(
            <div>
              <div style={{background:`${dom.color}0A`,borderRadius:12,padding:12,marginBottom:12,borderLeft:`3px solid ${dom.color}`}}>
                <div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3})}>Concept</div>
                <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.75})}>{task.lesson}</p>
              </div>
              <div style={{marginBottom:10}}>
                <div style={ss("11px",C.bark,600,{marginBottom:4})}>Why it matters:</div>
                <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.75})}>{task.why}</p>
              </div>
              <div style={{marginBottom:10}}>
                <div style={ss("11px",C.bark,600,{marginBottom:4})}>Examples:</div>
                <ul style={{margin:0,paddingLeft:18}}>
                  {task.examples.map((e,i)=><li key={i} style={ss("12px",C.umber,400,{marginBottom:4,lineHeight:1.6})}>{e}</li>)}
                </ul>
              </div>
              <div style={{background:`${dom.color}0A`,borderRadius:12,padding:12,borderLeft:`3px solid ${dom.color}`}}>
                <div style={ss("9px",dom.color,700,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3})}>Pro tip:</div>
                <p style={ss("12px",C.umber,400,{margin:0,lineHeight:1.65})}>{task.tip}</p>
              </div>
              {!done[task.code]&&<button onClick={()=>{markDone(task.code);addPoints("completeTask");}} style={{width:"100%",marginTop:12,padding:11,borderRadius:12,background:dom.color,color:C.white,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"13px"}}>Mark as learned</button>}
              {done[task.code]&&<div style={ss("13px",dom.color,700,{textAlign:"center",marginTop:10})}>Learned</div>}
            </div>
          )}
          {tab==="mc"&&task.mc&&renderQ(task.mc,"mc")}
          {tab==="sc"&&task.sc&&renderQ(task.sc,"sc")}
          {tab==="fl"&&task.fl&&(
            <div onClick={()=>{setFlipped(f=>!f);if(!flipped&&!done[task.code])markDone(task.code);}} style={{minHeight:140,borderRadius:14,cursor:"pointer",background:flipped?`${dom.color}10`:C.linen,border:`1.5px solid ${flipped?dom.color:C.sand}`,padding:20,textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",gap:8,transition:"all 0.3s"}}>
              <div style={ss("9px",flipped?dom.color:C.dusk,600,{textTransform:"uppercase",letterSpacing:"0.08em"})}>{flipped?"Answer":"Question — tap to flip"}</div>
              <p style={ser("13px",C.bark,700,{margin:0,lineHeight:1.7,whiteSpace:"pre-line"})}>{flipped?task.fl.b:task.fl.f}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <button onClick={()=>{if(taskIdx>0)switchTask(taskIdx-1);}} disabled={taskIdx===0} style={{flex:1,padding:12,borderRadius:12,background:taskIdx===0?C.linen:C.white,border:`1.5px solid ${taskIdx===0?C.sand:dom.color}`,color:taskIdx===0?C.stone:C.umber,cursor:taskIdx===0?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"13px"}}>Previous</button>
          <button onClick={()=>taskIdx<tasks.length-1?switchTask(taskIdx+1):setDomain(null)} style={{flex:1,padding:12,borderRadius:12,background:dom.color,border:"none",color:C.white,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"13px"}}>
            {taskIdx<tasks.length-1?"Next":"Section done"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LEARN TAB ───────────────────────────────────────────────────────
const CAT_CONFIG={
  encouragement:{ label:"Encouragement", color:C.terra,  bg:`${C.terra}0A` },
  wellness:     { label:"Wellness",      color:C.sage,   bg:`${C.sage}0A`  },
  education:    { label:"Education",     color:C.umber,  bg:`${C.umber}0A` },
  celebrate:    { label:"Celebrate",     color:C.copper, bg:`${C.copper}0A`},
};

function LearnTab({saved,setSaved,addPoints,studyDone,markStudyDone}){
  const [mode,setMode]=useState("home");
  const [filter,setFilter]=useState("all");
  const [expanded,setExpanded]=useState(null);

  const filtered=filter==="all"?MESSAGES:MESSAGES.filter(m=>m.cat===filter);
  const totalStudy=43;
  const doneStudy=Object.keys(studyDone).length;

  if(mode==="library") return (
    <div style={{padding:"18px 16px 100px"}}>
      <button onClick={()=>setMode("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:14,padding:0}}>Back</button>
      <div style={ser("20px",C.bark,700,{marginBottom:3})}>Message Library</div>
      <div style={ss("12px",C.dusk,400,{marginBottom:14})}>{MESSAGES.length} notes — tap any card to read</div>

      {/* Filter pills */}
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
        {[{id:"all",label:"All",color:C.terra},...Object.entries(CAT_CONFIG).map(([id,v])=>({id,label:v.label,color:v.color}))].map(c=>(
          <button key={c.id} onClick={()=>setFilter(c.id)} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${filter===c.id?c.color:C.sand}`,background:filter===c.id?c.color:C.linen,color:filter===c.id?C.white:C.dusk,fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(msg=>{
          const cfg=CAT_CONFIG[msg.cat]||CAT_CONFIG.encouragement;
          const isExp=expanded===msg.id;
          return (
            <div key={msg.id} onClick={()=>{setExpanded(isExp?null:msg.id);if(!isExp)addPoints("readMessage");}} style={{borderRadius:16,overflow:"hidden",background:C.white,border:`1.5px solid ${isExp?msg.color+"55":C.sand}`,boxShadow:isExp?`0 6px 18px ${msg.color}22`:`0 1px 6px ${C.sand}`,cursor:"pointer",transition:"all 0.3s"}}>
              <div style={{height:3,background:`linear-gradient(90deg,${msg.color},${msg.color}44)`}}/>
              <div style={{padding:"14px 16px",background:cfg.bg}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,paddingRight:8}}>
                    {/* No perspective label — removed as requested */}
                    <div style={ser("14px",C.bark,700,{lineHeight:1.3})}>{msg.title}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <button onClick={e=>{e.stopPropagation();const ns=new Set(saved);ns.has(msg.id)?ns.delete(msg.id):ns.add(msg.id);setSaved(ns);if(!saved.has(msg.id))addPoints("saveMessage");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:"15px",color:saved.has(msg.id)?C.copper:C.stone}}>
                      {saved.has(msg.id)?"♥":"♡"}
                    </button>
                    <span style={ss("10px",C.stone)}>{isExp?"▲":"▼"}</span>
                  </div>
                </div>
                {isExp&&<p style={ss("13px",C.umber,400,{margin:"10px 0 8px",lineHeight:1.8})}>{msg.body}</p>}
                <div style={{marginTop:8}}><Tag label={msg.tag} color={msg.color}/></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── BCaBA / BCBA interactive modules ──────────────────────────────
  if(mode==="study_BCaBA"||mode==="study_BCBA"){
    const isBCBA=mode==="study_BCBA";
    const domains=isBCBA?BCBA_DOMAINS:BCABA_DOMAINS;
    const accent=isBCBA?C.walnut:C.umber;
    return <CredentialStudyModule
      label={isBCBA?"BCBA":"BCaBA"}
      edition={isBCBA?"6th Edition · 104 tasks · Effective 2025":"6th Edition · 90 tasks · Effective 2025"}
      domains={domains}
      accent={accent}
      onBack={()=>setMode("study")}
      done={studyDone}
      markDone={markStudyDone}
      addPoints={addPoints}
    />;
  }

  // ── RBT + BT inline study module ──────────────────────────────────
  if(mode==="study_RBT"||mode==="study_BT"){
    return <RBTStudyModule onBack={()=>setMode("study")} done={studyDone} markDone={markStudyDone} addPoints={addPoints}/>;
  }

  // Study module credential selector
  if(mode==="study") return (
    <div style={{padding:"18px 16px 100px"}}>
      <button onClick={()=>setMode("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:14,padding:0}}>Back</button>
      <div style={ser("18px",C.bark,700,{marginBottom:4})}>Study Modules</div>
      <div style={ss("12px",C.dusk,400,{marginBottom:16})}>Select your credential path to begin.</div>
      {[
        {r:"BT",    label:"Behavior Technician (BT)",   sub:"Interactive lessons — learn at your pace",  accent:C.sage,   badge:"Pre-RBT"},
        {r:"RBT",   label:"Registered BT (RBT)",         sub:"3rd Edition — 43 tasks — effective 2026",   accent:C.terra,  badge:"3rd Ed"},
        {r:"BCaBA", label:"BCaBA",                        sub:"6th Edition — 90 tasks — effective 2025",   accent:C.umber,  badge:"6th Ed"},
        {r:"BCBA",  label:"BCBA",                         sub:"6th Edition — 104 tasks — effective 2025",  accent:C.walnut, badge:"6th Ed"},
      ].map(o=>(
        <div key={o.r} style={{background:C.white,borderRadius:16,padding:"16px 18px",marginBottom:10,boxShadow:`0 1px 6px ${C.sand}`,borderLeft:`4px solid ${o.accent}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 16px ${C.sand}`}
          onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 1px 6px ${C.sand}`}
          onClick={()=>setMode(`study_${o.r}`)}>
          <div>
            <div style={ss("14px",C.bark,700)}>{o.label}</div>
            <div style={ss("11px",C.dusk,400,{marginTop:2})}>{o.sub}</div>
          </div>
          <div style={{background:`${o.accent}18`,borderRadius:8,padding:"3px 9px",fontSize:"9px",fontWeight:700,color:o.accent,letterSpacing:"0.04em"}}>{o.badge}</div>
        </div>
      ))}
      <div style={{marginTop:16,background:C.linen,borderRadius:14,padding:"12px 14px"}}>
        <div style={ss("10px",C.dusk,600,{marginBottom:5})}>RBT / BT Progress</div>
        <PBar value={totalStudy?doneStudy/totalStudy*100:0} color={C.terra}/>
        <div style={ss("10px",C.stone,500,{marginTop:4,textAlign:"right"})}>{doneStudy} of {totalStudy} tasks</div>
      </div>
    </div>
  );

  // Learn home
  return (
    <div style={{padding:"18px 16px 100px"}}>
      <div style={ser("20px",C.bark,700,{marginBottom:3})}>Learn</div>
      <div style={ss("12px",C.dusk,400,{marginBottom:18})}>Encouragement, education, and exam prep — all in one place.</div>

      {/* Message library card */}
      <div style={{background:C.white,borderRadius:18,overflow:"hidden",boxShadow:`0 2px 12px ${C.sand}`,marginBottom:12,cursor:"pointer"}} onClick={()=>setMode("library")}>
        <div style={{height:3,background:`linear-gradient(90deg,${C.terra},${C.copper})`}}/>
        <div style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={ser("15px",C.bark,700)}>Message Library</div>
            <div style={ss("12px",C.dusk,400,{marginTop:2})}>{MESSAGES.length} notes of encouragement, wellness, education and celebration</div>
          </div>
          <span style={ss("16px",C.stone)}>→</span>
        </div>
      </div>

      {/* Study module card */}
      <div style={{background:C.white,borderRadius:18,overflow:"hidden",boxShadow:`0 2px 12px ${C.sand}`,marginBottom:12,cursor:"pointer"}} onClick={()=>setMode("study")}>
        <div style={{height:3,background:`linear-gradient(90deg,${C.sage},${C.leaf})`}}/>
        <div style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={ser("15px",C.bark,700)}>Interactive Study Modules</div>
            <div style={ss("12px",C.dusk,400,{marginTop:2})}>BT — RBT — BCaBA — BCBA — all credential paths</div>
          </div>
          <span style={ss("16px",C.stone)}>→</span>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPORT TAB ─────────────────────────────────────────────────────
function SupportTab({addPoints}){
  const [active,setActive]=useState(null);
  const conv=active?CONVERSATIONS.find(c=>c.id===active):null;

  if(conv) return (
    <div style={{padding:"0 0 100px"}}>
      <div style={{background:`linear-gradient(160deg,${conv.color}18,transparent)`,padding:"20px 18px 16px",borderBottom:`1px solid ${C.sand}`}}>
        <button onClick={()=>setActive(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:10,padding:0}}>Back</button>
        <div style={{width:28,height:3,borderRadius:2,background:conv.color,marginBottom:10}}/>
        <div style={ser("18px",C.bark,700,{lineHeight:1.3})}>{conv.title}</div>
      </div>
      <div style={{padding:"16px"}}>
        {/* First hear this */}
        <div style={{background:C.white,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 1px 6px ${C.sand}`,borderLeft:`3px solid ${conv.color}`}}>
          <div style={ss("9px",conv.color,700,{textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5})}>First, hear this</div>
          <p style={ss("14px",C.bark,500,{margin:0,lineHeight:1.8})}>{conv.intro}</p>
        </div>
        {/* Situation */}
        <div style={{background:C.white,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 1px 6px ${C.sand}`}}>
          <div style={ss("9px",C.dusk,700,{textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5})}>The situation</div>
          <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.8})}>{conv.context}</p>
        </div>
        {/* What to say */}
        <div style={ss("10px",C.bark,700,{textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10})}>What you could say</div>
        {conv.doSay.map((s,i)=>(
          <div key={i} style={{background:C.white,borderRadius:14,padding:15,marginBottom:10,boxShadow:`0 1px 6px ${C.sand}`,borderLeft:`3px solid ${conv.color}`}}>
            <div style={ss("9px",conv.color,700,{textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6})}>{s.label}</div>
            <p style={ital("13px",C.umber,400,{margin:0,lineHeight:1.75})}>{s.text}</p>
          </div>
        ))}
        {/* Avoid */}
        <div style={{background:C.linen,borderRadius:14,padding:15,marginBottom:12,border:`1px solid ${C.sand}`}}>
          <div style={ss("9px",C.dusk,700,{textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5})}>Worth keeping in mind</div>
          <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.75})}>{conv.avoid}</p>
        </div>
        {/* Remember */}
        <div style={{background:`${conv.color}0A`,borderRadius:14,padding:15,border:`1px solid ${conv.color}33`}}>
          <div style={ss("9px",conv.color,700,{textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5})}>Remember</div>
          <p style={ss("13px",C.umber,400,{margin:0,lineHeight:1.75})}>{conv.reminder}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{padding:"20px 16px 100px"}}>
      <div style={ser("20px",C.bark,700,{marginBottom:3})}>Difficult Conversations</div>
      <div style={ss("13px",C.dusk,400,{marginBottom:18,lineHeight:1.65})}>Real guidance for real situations — written the way a trusted mentor would talk to you.</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {CONVERSATIONS.map(c=>(
          <button key={c.id} onClick={()=>{setActive(c.id);addPoints("readGuide");}} style={{textAlign:"left",padding:"16px 18px",borderRadius:18,background:C.white,border:`1px solid ${C.sand}`,cursor:"pointer",boxShadow:`0 1px 6px ${C.sand}`,fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",display:"flex",justifyContent:"space-between",alignItems:"center"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 14px ${C.sand}`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 1px 6px ${C.sand}`}>
            <div style={{flex:1,paddingRight:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <CategoryDot color={c.color}/>
                <div style={ser("14px",C.bark,700)}>{c.title}</div>
              </div>
              <div style={ss("12px",C.dusk,400,{lineHeight:1.5,paddingLeft:15})}>{c.intro.slice(0,80)}...</div>
            </div>
            <span style={ss("14px",C.stone)}>→</span>
          </button>
        ))}
      </div>

      {/* Career guidance */}
      <div style={ser("16px",C.bark,700,{marginBottom:12})}>Career Guidance</div>
      {[
        {title:"Approaching your BCBA about career goals",color:C.sage,  body:"Share your 'why' before your 'what.' Start with: 'I am really passionate about [area] and I have been thinking about where I want to go professionally. I would love your guidance.' Your BCBA cannot mentor what they do not know about."},
        {title:"Preparing for RBT certification renewal",  color:C.umber, body:"Ninety days before your renewal date: audit your supervision hours, check CEU requirements, verify your supervisor's certification is current. Do not wait — thirty days is not enough runway."},
        {title:"When you are ready to pursue your BCBA",  color:C.terra, body:"Tell your supervisor first — before you research programs. Ask: 'I am considering pursuing my BCBA. Would you be willing to supervise my hours?' The relationship comes before the application."},
        {title:"Building your professional reputation",    color:C.copper,body:"Three things that follow you everywhere: your reliability, your documentation, and how you speak about clients and colleagues. Build all three from day one."},
      ].map((item,i)=>(
        <div key={i} style={{background:C.white,borderRadius:14,padding:16,marginBottom:10,boxShadow:`0 1px 6px ${C.sand}`,borderLeft:`3px solid ${item.color}`}}>
          <div style={ss("13px",C.bark,700,{marginBottom:6})}>{item.title}</div>
          <p style={ss("12px",C.umber,400,{margin:0,lineHeight:1.75})}>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

// ─── RESOURCES TAB ───────────────────────────────────────────────────
function ResourcesTab({addPoints}){
  const [openCat,setOpenCat]=useState(null);
  return (
    <div style={{padding:"20px 16px 100px"}}>
      <div style={ser("20px",C.bark,700,{marginBottom:3})}>Resources</div>
      <div style={ss("12px",C.dusk,400,{marginBottom:18})}>Curated links, books, and tools — everything in one place.</div>
      {RESOURCES.map((section,si)=>{
        const isOpen=openCat===si;
        return (
          <div key={si} style={{marginBottom:10}}>
            <button onClick={()=>setOpenCat(isOpen?null:si)} style={{width:"100%",textAlign:"left",padding:"14px 16px",borderRadius:isOpen?"16px 16px 0 0":"16px",background:C.white,border:`1px solid ${C.sand}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:`0 1px 6px ${C.sand}`}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <CategoryDot color={section.color}/>
                <div style={ss("14px",C.bark,700)}>{section.category}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:"10px",fontWeight:700,padding:"2px 8px",borderRadius:10,background:`${section.color}15`,color:section.color}}>{section.items.length}</span>
                <span style={ss("12px",C.stone)}>{isOpen?"▲":"▼"}</span>
              </div>
            </button>
            {isOpen&&(
              <div style={{background:C.white,borderRadius:"0 0 16px 16px",border:`1px solid ${C.sand}`,borderTop:"none",overflow:"hidden"}}>
                {section.items.map((item,ii)=>(
                  <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer" onClick={()=>addPoints("readResource")} style={{display:"block",padding:"13px 16px",borderTop:`1px solid ${C.linen}`,textDecoration:"none",transition:"background 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.linen}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1,paddingRight:12}}>
                        <div style={ss("13px",section.color,600,{marginBottom:2})}>{item.title}</div>
                        <div style={ss("11px",C.dusk,400,{lineHeight:1.5})}>{item.desc}</div>
                      </div>
                      <span style={ss("11px",C.stone)}>↗</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ME TAB ──────────────────────────────────────────────────────────
function MeTab({profile,setProfile,points,pointsHistory,saved}){
  const [editing,setEditing]=useState(!profile.name);
  const [draft,setDraft]=useState(profile);

  const earnedBadges=BADGES.filter(b=>b.pts<=points);
  const nextBadge=BADGES.find(b=>b.pts>points);
  const prevBadge=earnedBadges[earnedBadges.length-1]||BADGES[0];
  const pct=nextBadge?Math.min(100,((points-(prevBadge?.pts||0))/((nextBadge?.pts||1)-(prevBadge?.pts||0)))*100):100;
  const monthPts=pointsHistory.filter(h=>{const d=new Date(h.date),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}).reduce((s,h)=>s+h.pts,0);

  if(editing) return (
    <div style={{padding:"24px 18px 100px"}}>
      <div style={ser("20px",C.bark,700,{marginBottom:3})}>Your Profile</div>
      <div style={ss("12px",C.dusk,400,{marginBottom:20})}>Let's personalize your experience.</div>
      {[
        {label:"Your name",                     key:"name", ph:"What should we call you?"},
        {label:"Your role",                     key:"role", ph:"BT · RBT · BCaBA · BCBA"},
        {label:"Your organization",             key:"org",  ph:"Optional"},
        {label:"Three of your favorite things", key:"favs", ph:"e.g. coffee, hiking, cooking"},
        {label:"Your career goal",              key:"goal", ph:"e.g. Become a BCBA by 2026"},
      ].map(f=>(
        <div key={f.key} style={{marginBottom:14}}>
          <div style={ss("11px",C.bark,600,{marginBottom:5})}>{f.label}</div>
          <input value={draft[f.key]||""} onChange={e=>setDraft(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
            style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1.5px solid ${C.sand}`,fontSize:"13px",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",background:C.white,color:C.bark}}/>
        </div>
      ))}
      <button onClick={()=>{setProfile(draft);setEditing(false);}} style={{width:"100%",padding:"14px",borderRadius:14,background:`linear-gradient(135deg,${C.espresso},${C.walnut})`,border:"none",cursor:"pointer",color:C.white,fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"15px"}}>
        Save profile
      </button>
    </div>
  );

  return (
    <div style={{padding:"0 0 100px"}}>
      {/* Profile hero */}
      <div style={{background:`linear-gradient(135deg,${C.espresso},${C.walnut})`,padding:"26px 18px 22px",color:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={ser("22px",C.white,700)}>{profile.name||"Welcome"}</div>
            <div style={ss("12px","rgba(255,255,255,0.45)",400,{marginTop:2})}>{profile.role}{profile.org?" — "+profile.org:""}</div>
            {profile.goal&&<div style={{marginTop:8,background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"4px 10px",display:"inline-block"}}>
              <span style={ss("11px",`${C.terra}cc`,400)}>{profile.goal}</span>
            </div>}
          </div>
          <button onClick={()=>setEditing(true)} style={{background:"rgba(255,255,255,0.08)",border:`1px solid rgba(255,255,255,0.15)`,cursor:"pointer",borderRadius:10,padding:"6px 12px",fontSize:"12px",color:"rgba(255,255,255,0.7)",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Edit</button>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[{label:"Total",val:points},{label:"This month",val:monthPts},{label:"Saved",val:saved.size}].map(s=>(
            <div key={s.label} style={{flex:1,background:"rgba(255,255,255,0.07)",borderRadius:10,padding:"9px 6px",textAlign:"center"}}>
              <div style={ss("17px",C.white,700,{textAlign:"center",lineHeight:1})}>{s.val}</div>
              <div style={ss("8px","rgba(255,255,255,0.35)",500,{textAlign:"center",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2})}>{s.label}</div>
            </div>
          ))}
        </div>
        {nextBadge&&<>
          <PBar value={pct} color={C.terra} h={3}/>
          <div style={ss("9px","rgba(255,255,255,0.35)",400,{marginTop:3,textAlign:"right"})}>{nextBadge.pts-points} pts to {nextBadge.name}</div>
        </>}
      </div>

      <div style={{padding:"18px 16px"}}>
        {/* Monthly summary */}
        <div style={{background:C.white,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 1px 6px ${C.sand}`}}>
          <div style={ser("14px",C.bark,700,{marginBottom:10})}>This Month</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",minHeight:36}}>
            {pointsHistory.filter(h=>{const d=new Date(h.date),n=new Date();return d.getMonth()===n.getMonth();}).slice(-10).map((h,i)=>(
              <div key={i} style={{background:C.linen,borderRadius:8,padding:"5px 9px",textAlign:"center",border:`1px solid ${C.sand}`}}>
                <div style={ss("11px",C.terra,600,{marginTop:1})}>+{h.pts}</div>
              </div>
            ))}
            {monthPts===0&&<div style={ital("12px",C.stone,400)}>Start engaging to see your monthly journey here.</div>}
          </div>
          {monthPts>=50&&(
            <div style={{marginTop:12,background:`${C.sage}12`,borderRadius:12,padding:12,borderLeft:`3px solid ${C.sage}`}}>
              <div style={ss("12px",C.sage,700,{marginBottom:3})}>Monthly recognition — {profile.name||"friend"}</div>
              <p style={ss("12px",C.umber,400,{margin:0,lineHeight:1.7})}>
                {monthPts} points this month. That is real growth, real engagement, real showing up.{profile.favs?` You deserve something you love — like ${profile.favs.split(",")[0].trim()}.`:""}
              </p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div style={{background:C.white,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 1px 6px ${C.sand}`}}>
          <div style={ser("14px",C.bark,700,{marginBottom:12})}>Badges</div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {BADGES.map(b=>{
              const earned=b.pts<=points;
              return (
                <div key={b.id} style={{textAlign:"center",opacity:earned?1:0.28,transition:"opacity 0.3s",minWidth:52}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:earned?`${C.terra}22`:C.linen,border:`1.5px solid ${earned?C.terra:C.sand}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 4px"}}>
                    <div style={{width:12,height:12,borderRadius:"50%",background:earned?C.terra:C.stone}}/>
                  </div>
                  <div style={ss("9px",earned?C.bark:C.stone,600,{textAlign:"center",lineHeight:1.3})}>{b.name}</div>
                  {!earned&&<div style={ss("8px",C.stone,400,{textAlign:"center"})}>{b.pts}pts</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to earn */}
        <div style={{background:C.white,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 1px 6px ${C.sand}`}}>
          <div style={ser("14px",C.bark,700,{marginBottom:10})}>How to earn points</div>
          {Object.values(POINT_ACTIONS).map(a=>(
            <div key={a.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.linen}`}}>
              <div style={ss("12px",C.umber,400)}>{a.label}</div>
              <span style={{fontSize:"10px",fontWeight:700,padding:"2px 8px",borderRadius:10,background:`${C.terra}15`,color:C.terra}}>+{a.pts}</span>
            </div>
          ))}
        </div>

        {/* Saved notes */}
        {saved.size>0&&(
          <div style={{background:C.white,borderRadius:16,padding:16,boxShadow:`0 1px 6px ${C.sand}`}}>
            <div style={ser("14px",C.bark,700,{marginBottom:10})}>Saved Notes ({saved.size})</div>
            {MESSAGES.filter(m=>saved.has(m.id)).map(m=>(
              <div key={m.id} style={{borderRadius:10,padding:"9px 12px",background:C.linen,border:`1px solid ${C.sand}`,marginBottom:7}}>
                <div style={ss("13px",C.bark,600)}>{m.title}</div>
                <div style={{marginTop:4}}><Tag label={m.tag} color={m.color}/></div>
              </div>
            ))}
          </div>
        )}

        {/* Mission footer */}
        <div style={{marginTop:18,textAlign:"center",padding:"0 8px"}}>
          <div style={ser("13px",C.terra,600,{marginBottom:6,fontStyle:"italic"})}>The Antecedent</div>
          <div style={ital("11px",C.stone,400,{lineHeight:1.7})}>"Love in action. Not just words."<br/>— 1 John 3:17–18</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
const LS={get:(k,def)=>{try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):def;}catch{return def;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},};

export default function TheAntecedent(){
  const [onboarded,setOnboarded]=useState(()=>LS.get("ta_onboarded",false));
  const [tab,setTab]=useState(()=>LS.get("ta_tab","home"));
  const [popup,setPopup]=useState(null);
  const [saved,setSaved]=useState(()=>new Set(LS.get("ta_saved",[])));
  const [points,setPoints]=useState(()=>LS.get("ta_points",0));
  const [pointsHistory,setPointsHistory]=useState(()=>LS.get("ta_history",[]));
  const [profile,setProfile]=useState(()=>LS.get("ta_profile",{name:"",role:"",org:"",favs:"",goal:""}));
  const [studyDone,setStudyDone]=useState(()=>LS.get("ta_study",{}));
  const hasInit=useRef(false);
  useEffect(()=>LS.set("ta_onboarded",onboarded),[onboarded]);
  useEffect(()=>LS.set("ta_tab",tab),[tab]);
  useEffect(()=>LS.set("ta_saved",[...saved]),[saved]);
  useEffect(()=>LS.set("ta_points",points),[points]);
  useEffect(()=>LS.set("ta_history",pointsHistory),[pointsHistory]);
  useEffect(()=>LS.set("ta_profile",profile),[profile]);
  useEffect(()=>LS.set("ta_study",studyDone),[studyDone]);
```

  const markStudyDone=(code)=>setStudyDone(p=>({...p,[code]:true}));

  useEffect(()=>{
    if(onboarded&&!hasInit.current){
      hasInit.current=true;
      addPoints("openApp");
    }
  },[onboarded]);

  const addPoints=(action)=>{
    const cfg=POINT_ACTIONS[action];
    if(!cfg)return;
    setPoints(p=>p+cfg.pts);
    setPointsHistory(h=>[...h,{action,pts:cfg.pts,date:new Date().toISOString()}]);
  };

  if(!onboarded) return <Onboarding onDone={()=>setOnboarded(true)}/>;

  const TABS=[
    {id:"home",      label:"Home"},
    {id:"learn",     label:"Learn"},
    {id:"support",   label:"Support"},
    {id:"resources", label:"Resources"},
    {id:"me",        label:"Me"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.ivory,fontFamily:"'DM Sans',sans-serif",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora:ital,wght@1,400;0,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {popup&&<KindnessPopup msg={popup} onClose={()=>setPopup(null)} onSave={id=>{const ns=new Set(saved);ns.add(id);setSaved(ns);addPoints("saveMessage");}} saved={saved.has(popup?.id)}/>}

      <AppHeader points={points} profile={profile}/>

      <div style={{paddingBottom:70}}>
        {tab==="home"      &&<HomeTab      profile={profile} points={points} addPoints={addPoints} setPopup={setPopup} saved={saved} setSaved={setSaved} setTab={setTab}/>}
        {tab==="learn"     &&<LearnTab     saved={saved} setSaved={setSaved} addPoints={addPoints} studyDone={studyDone} markStudyDone={markStudyDone}/>}
        {tab==="support"   &&<SupportTab   addPoints={addPoints}/>}
        {tab==="resources" &&<ResourcesTab addPoints={addPoints}/>}
        {tab==="me"        &&<MeTab        profile={profile} setProfile={setProfile} points={points} pointsHistory={pointsHistory} saved={saved}/>}
      </div>

      {/* Bottom navigation — text only, no emojis */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(250,246,239,0.96)",backdropFilter:"blur(16px)",borderTop:"1px solid "+C.sand,display:"flex",padding:"10px 0 14px",zIndex:50}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontFamily:"'DM Sans',sans-serif",padding:"2px 0"}}>
            {/* Active indicator dot instead of emoji */}
            <div style={{width:5,height:5,borderRadius:"50%",background:tab===t.id?C.terra:"transparent",marginBottom:2,transition:"background 0.2s"}}/>
            <span style={{fontSize:"11px",fontWeight:tab===t.id?700:400,color:tab===t.id?C.bark:C.stone,transition:"all 0.2s",letterSpacing:"0.02em"}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
    
  );
}
