import { useState, useEffect, useRef } from "react";

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

  // Study module (credential selector → uses inline data)
  if(mode==="study") return (
    <div style={{padding:"18px 16px 100px"}}>
      <button onClick={()=>setMode("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.dusk,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:14,padding:0}}>Back</button>
      <div style={ser("18px",C.bark,700,{marginBottom:4})}>Study Modules</div>
      <div style={ss("12px",C.dusk,400,{marginBottom:16})}>Select your credential path to begin.</div>
      {[
        {r:"BT",    label:"Behavior Technician (BT)",    sub:"Interactive lessons — learn at your pace",          accent:C.sage,   badge:"Pre-RBT"},
        {r:"RBT",   label:"Registered BT (RBT)",          sub:"3rd Edition — 43 tasks — effective 2026",           accent:C.terra,  badge:"3rd Ed"},
        {r:"BCaBA", label:"BCaBA",                         sub:"6th Edition — 90 tasks — effective 2025",           accent:C.umber,  badge:"6th Ed"},
        {r:"BCBA",  label:"BCBA",                          sub:"6th Edition — 104 tasks — effective 2025",          accent:C.walnut, badge:"6th Ed"},
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
        <div style={ss("10px",C.dusk,600,{marginBottom:5})}>RBT Progress</div>
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
export default function TheAntecedent(){
  const [onboarded,setOnboarded]=useState(false);
  const [tab,setTab]=useState("home");
  const [popup,setPopup]=useState(null);
  const [saved,setSaved]=useState(new Set());
  const [points,setPoints]=useState(0);
  const [pointsHistory,setPointsHistory]=useState([]);
  const [profile,setProfile]=useState({name:"",role:"",org:"",favs:"",goal:""});
  const [studyDone,setStudyDone]=useState({});
  const hasInit=useRef(false);

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
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:`rgba(250,246,239,0.96)`,backdropFilter:"blur(16px)",borderTop:`1px solid ${C.sand}`,display:"flex",padding:"10px 0 14px",zIndex:50}}>
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
